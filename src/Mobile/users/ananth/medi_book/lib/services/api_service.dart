
// lib/services/api_service.dart
import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

import '../models/appointment.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../models/time_slot.dart';
import '../models/saved_patient.dart';
import '../models/saved_card.dart';
import '../models/saved_insurance.dart';
import '../models/rx_order.dart';

class SavedFinancialData {
  final List<SavedCard> cards;
  final List<SavedInsurance> insurances;
  const SavedFinancialData(this.cards, this.insurances);
}

// ── Hospital model ────────────────────────────────────────────────────────────
class Hospital {
  final String id;
  final String name;
  final String location;
  final String imageUrl;   // network URL or empty
  final String logoPath;   // raw path from API (e.g. /logos/sunrise.png)

  const Hospital({
    required this.id,
    required this.name,
    required this.location,
    this.imageUrl = '',
    this.logoPath = '',
  });
}
class ApiService {
  static const String baseUrl = 'http://skymedibook.runasp.net/api';

  static const Map<String, int> securityQuestionIds = {
    'pet':    1,
    'school': 2,
    'city':   3,
    'mother': 4,
    'food':   5,
  };

  // ── logged-in patient data (populated on login) ───────────────────────────
  /// Stores the full data map returned by LoginPatient so other screens can
  /// read patientId, profileId, firstName, lastName, etc.
  static Map<String, dynamic>? currentPatient;

  // ── current hospital (default: first in the list) ─────────────────────────
  static Hospital currentHospital = const Hospital(
    id: 'H001',
    name: 'Health Haven Medical Center',
    location: 'Main Campus, Kolkata',
  );

  /// The auth token returned as `tokenKey` in the login response.
  /// Injected as `Authorization: Bearer <token>` on every authenticated call.
  static String? _authToken;

  /// The refresh token returned by the login response.
  static String? _refreshToken;

  /// Whether the user is currently authenticated.
  static bool get isAuthenticated => _authToken != null;

  /// Clears the session (call on logout).
  static void clearSession() {
    currentPatient  = null;
    _authToken      = null;
    _refreshToken   = null;
    currentHospital = const Hospital(
      id: 'H001',
      name: 'Health Haven Medical Center',
      location: 'Main Campus, Kolkata',
    );
  }

  // ── Real: fetch organisation / hospital list ──────────────────────────────
  /// GET /api/v1/Organisation/GetOrganisationList
  static Future<List<Hospital>> fetchHospitals() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Organisation/GetOrganisationList'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        final data = body['data'] as List<dynamic>? ?? [];
        return data.map((item) {
          final map      = item as Map<String, dynamic>;
          final id       = (map['hospitalId'] ?? 0).toString();
          final name     = map['hospitalName'] as String? ?? '';
          final city     = map['cityName']    as String? ?? '';
          final state    = map['stateName']   as String? ?? '';
          final location = [city, state]
              .where((s) => s.isNotEmpty)
              .join(', ');
          final logoPath = map['logoPath'] as String? ?? '';
          // Build a full URL from logoPath if it starts with '/'
          final imageUrl = logoPath.isNotEmpty
              ? (logoPath.startsWith('http')
                  ? logoPath
                  : 'http://skymedibook.runasp.net$logoPath')
              : '';
          return Hospital(
            id:       id,
            name:     name,
            location: location,
            imageUrl: imageUrl,
            logoPath: logoPath,
          );
        }).toList();
      }
      debugPrint('fetchHospitals: non-200 status ${response.statusCode}');
    } catch (e) {
      debugPrint('fetchHospitals error: $e');
    }
    // Fallback: return empty list — the dialog will show "No hospitals found"
    return [];
  }

  // ── POST /api/v1/Patient/SwitchHospital ──────────────────────────────────
  /// Calls the real switch-hospital endpoint.
  /// On success: updates [_authToken] with the new JWT and sets [currentHospital].
  /// Returns:
  ///   {'success': true}                     – switched OK
  ///   {'success': false, 'notEnrolled': true} – patient not enrolled → offer enroll
  ///   {'success': false, 'message': '…'}    – other error
  static Future<Map<String, dynamic>> switchHospital(Hospital hospital) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Patient/SwitchHospital'),
            headers: _authJsonHeaders,
            body: jsonEncode({'hospitalId': int.tryParse(hospital.id) ?? 0}),
          )
          .timeout(const Duration(seconds: 20));

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;

      if (response.statusCode == 200 && decoded['result'] == 1) {
        // Update auth token so all subsequent calls use the new JWT
        final newToken = decoded['tokenKey'] as String?;
        if (newToken != null && newToken.isNotEmpty) {
          _authToken = newToken;
          _refreshToken = decoded['refreshToken'] as String?;
          // Re-parse expiry from new token
          _scheduleTokenExpiry(newToken);
        }
        currentHospital = hospital;
        debugPrint('switchHospital OK → ${hospital.name}');
        return {'success': true, 'message': 'Switched to ${hospital.name}'};
      }

      // 400 "Not enrolled in an active hospital."
      final msg = decoded['statusMessage'] as String? ?? '';
      if (response.statusCode == 400 &&
          msg.toLowerCase().contains('not enrolled')) {
        return {'success': false, 'notEnrolled': true, 'message': msg};
      }

      return {
        'success': false,
        'message': msg.isNotEmpty ? msg : 'Switch failed (${response.statusCode})',
      };
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // ── POST /api/v1/Patient/EnrollPatientInHospital ─────────────────────────
  /// Enrolls the patient in [hospital], then immediately switches to it.
  /// Returns {'success': true} or {'success': false, 'message': '…'}.
  static Future<Map<String, dynamic>> enrollAndSwitchHospital(
      Hospital hospital) async {
    try {
      // Step 1: enroll
      final enrollResp = await http
          .post(
            Uri.parse('$baseUrl/v1/Patient/EnrollPatientInHospital'),
            headers: _authJsonHeaders,
            body: jsonEncode({'hospitalId': int.tryParse(hospital.id) ?? 0}),
          )
          .timeout(const Duration(seconds: 20));

      final enrollDecoded =
          jsonDecode(enrollResp.body) as Map<String, dynamic>;

      if (enrollResp.statusCode != 200 &&
          enrollResp.statusCode != 201 &&
          enrollDecoded['result'] != 1) {
        final msg = enrollDecoded['statusMessage'] as String? ??
            'Enrollment failed (${enrollResp.statusCode})';
        return {'success': false, 'message': msg};
      }

      debugPrint('enrollPatient OK → ${hospital.name}');

      // Step 2: switch after successful enrollment
      return await switchHospital(hospital);
    } catch (e) {
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  // ── Token expiry auto-logout ───────────────────────────────────────────────
  /// Callback invoked when the JWT expires. Set this from the UI layer
  /// (e.g., HomeScreen) so the app can navigate to the login screen.
  static void Function()? onTokenExpired;

  static void _scheduleTokenExpiry(String token) {
    try {
      // JWT is three base64url parts separated by '.'
      final parts = token.split('.');
      if (parts.length != 3) return;
      // Pad the payload to a multiple of 4
      var payload = parts[1];
      payload += '=' * ((4 - payload.length % 4) % 4);
      final decoded = jsonDecode(
          utf8.decode(base64Url.decode(payload))) as Map<String, dynamic>;
      final exp = decoded['exp'];
      if (exp == null) return;
      final expiry = DateTime.fromMillisecondsSinceEpoch(
          (exp as int) * 1000, isUtc: true);
      final now = DateTime.now().toUtc();
      final diff = expiry.difference(now);
      if (diff.isNegative) {
        // Already expired – logout immediately
        onTokenExpired?.call();
        return;
      }
      debugPrint('Token expires in ${diff.inMinutes}m – scheduling auto-logout');
      Future.delayed(diff, () {
        debugPrint('Token expired – triggering auto-logout');
        onTokenExpired?.call();
      });
    } catch (e) {
      debugPrint('_scheduleTokenExpiry error: $e');
    }
  }

  /// Call this once after login with the received token to arm the auto-logout.
  static void armTokenExpiry(String token) => _scheduleTokenExpiry(token);



  /// Headers for authenticated GET requests.
  static Map<String, String> get _authHeaders => {
    'Accept': 'application/json',
    if (_authToken != null) 'Authorization': 'Bearer $_authToken',
  };

  /// Headers for authenticated POST/PUT/DELETE requests with a JSON body.
  static Map<String, String> get _authJsonHeaders => {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    if (_authToken != null) 'Authorization': 'Bearer $_authToken',
  };

  /// The profileId from the login response (used as profileId in booking).
  static int get currentProfileId =>
      currentPatient?['profileId'] as int? ?? 0;

  // ── self profile (falls back to mock if not logged in) ───────────────────
  static Map<String, String> get selfProfile {
    final p = currentPatient;
    if (p == null) {
      return {
        'firstName':     'Guest',
        'lastName':      '',
        'fullName':      'Guest',
        'dateOfBirth':   '',
        'age':           '',
        'ageUnit':       'years',
        'gender':        '',
        'address':       '',
        'contactNumber': '',
        'emailAddress':  '',
        'username':      '',
        'roleName':      '',
      };
    }
    // Convert ISO dateOfBirth to dd/MM/yyyy for display
    String dob = '';
    try {
      final raw = p['dateOfBirth'] as String? ?? '';
      if (raw.isNotEmpty) {
        final dt = DateTime.parse(raw);
        dob = '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')}/${dt.year}';
      }
    } catch (_) {}

    // firstName/lastName are normalised in login(); fullName also stored there.
    final firstName = p['firstName'] as String? ?? '';
    final lastName  = p['lastName']  as String? ?? '';
    final fullName  = p['fullName']  as String?
        ?? '$firstName $lastName'.trim();

    return {
      'firstName':     firstName,
      'lastName':      lastName,
      'fullName':      fullName,
      'dateOfBirth':   dob,
      'age':           '',
      'ageUnit':       'years',
      'gender':        p['gender']      as String? ?? '',
      'address':       '${p['addressLine1'] ?? ''} ${p['addressLine2'] ?? ''}'.trim(),
      'contactNumber': p['phoneNumber'] as String? ?? '',
      'emailAddress':  p['email']       as String? ?? '',
      'username':      p['username']    as String? ?? '',
      'roleName':      p['roleName']    as String? ?? '',
    };
  }

  // ── mock self profile (kept for backward compat, now delegates) ───────────
  static Map<String, String> get mockSelfProfile => selfProfile;


  // ── mock saved patients (kept for reference – replaced by fetchPatientProfiles) ──
  // static final List<SavedPatient> _savedPatients = [
  //   SavedPatient(
  //     id: 'PAT-001', firstName: 'Priya', lastName: 'Kumar',
  //     dateOfBirth: '20/03/1992', age: '33', ageUnit: 'years',
  //     gender: 'Female', address: '12, MG Road, Kochi, Kerala - 682001',
  //     contactNumber: '9876543211', emailAddress: 'priya.kumar@example.com',
  //     relation: 'Spouse',
  //   ),
  //   SavedPatient(
  //     id: 'PAT-002', firstName: 'Arjun', lastName: 'Kumar',
  //     dateOfBirth: '10/07/2015', age: '10', ageUnit: 'years',
  //     gender: 'Male', address: '12, MG Road, Kochi, Kerala - 682001',
  //     contactNumber: '9876543210', emailAddress: '', relation: 'Child',
  //   ),
  // ];


  // ── MOCK saved cards (kept for reference) ─────────────────────────────────
  // static final List<SavedCard> _savedCards = [
  //   SavedCard(
  //     id:         'CARD-001',
  //     holderName: 'Suresh Kumar',
  //     cardNumber: '4111111111113456',
  //     expiry:     '08/27',
  //     cvv:        '123',
  //     cardType:   'Visa',
  //   ),
  //   SavedCard(
  //     id:         'CARD-002',
  //     holderName: 'Suresh Kumar',
  //     cardNumber: '5200828282827890',
  //     expiry:     '12/26',
  //     cvv:        '456',
  //     cardType:   'Mastercard',
  //   ),
  // ];

  // ── MOCK saved insurances (kept for reference) ──────────────────────────
  // static final List<SavedInsurance> _savedInsurances = [
  //   SavedInsurance(
  //     id:                   'INS-001',
  //     providerName:         'Star Health Insurance',
  //     policyId:             'POL-SH-987654',
  //     groupId:              'GRP-001',
  //     primaryHolderName:    'Suresh Kumar',
  //     primaryHolderAddress: '12, MG Road, Kochi, Kerala - 682001',
  //   ),
  //   SavedInsurance(
  //     id:                   'INS-002',
  //     providerName:         'HDFC ERGO Health',
  //     policyId:             'POL-HE-112233',
  //     groupId:              'GRP-002',
  //     primaryHolderName:    'Suresh Kumar',
  //     primaryHolderAddress: '12, MG Road, Kochi, Kerala - 682001',
  //   ),
  // ];

  // ── patients CRUD ──────────────────────────────────────────────────────────

  /// GET /api/v1/Patient/GetPatientProfileListById/{patientId}
  ///
  /// Returns all saved profiles (Self + dependants) for the logged-in patient.
  /// For a NEW patient being booked for the first time, no profileId is needed.
  /// From the second booking onwards, the returned profileId is sent to the API.
  static Future<List<SavedPatient>> fetchPatientProfiles() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Patient/GetPatientProfileListById'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchPatientProfiles status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List raw = decoded['data'] ?? [];
        return raw
            .cast<Map<String, dynamic>>()
            .map(SavedPatient.fromApiJson)
            .toList();
      }
    } catch (e) {
      debugPrint('fetchPatientProfiles error: $e');
    }
    return [];
  }

  // ── GET /api/v1/Patient/GetPatientProfileByProfileId/{profileId} ───────────
  /// Returns the full profile detail including insuranceData and paymentData.
  static Future<Map<String, dynamic>?> fetchPatientProfileByProfileId(
      int profileId) async {
    try {
      final response = await http
          .get(
            Uri.parse(
                '$baseUrl/v1/Patient/GetPatientProfileByProfileId/$profileId'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 20));

      debugPrint('fetchPatientProfileByProfileId($profileId) status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (decoded['result'] == 1 || decoded['statusCode'] == 200) {
          return decoded['data'] as Map<String, dynamic>?;
        }
      }
    } catch (e) {
      debugPrint('fetchPatientProfileByProfileId error: $e');
    }
    return null;
  }

  // ── cards CRUD ─────────────────────────────────────────────────────────────

  /// Fetches saved cards by calling GetPatientProfileByProfileId for every
  /// profile returned by GetPatientProfileListById **in parallel**, then
  /// extracting paymentData blocks that have a non-empty cardNumber.
  /// One card entry is produced per unique profileId that has card data.
  // static Future<List<SavedCard>> fetchSavedCards() async {
  //   // ── MOCK (kept for reference) ────────────────────────────────────────────
  //   // await Future.delayed(const Duration(milliseconds: 400));
  //   // return List.unmodifiable(_savedCards);
  //   // ────────────────────────────────────────────────────────────────────────
  //   final profiles = await fetchPatientProfiles();
  //   if (profiles.isEmpty) return [];

  //   // Fetch all profile details in parallel for speed
  //   final validProfiles = profiles.where((p) => p.profileId != 0).toList();
  //   final details = await Future.wait(
  //     validProfiles.map((p) => fetchPatientProfileByProfileId(p.profileId)),
  //   );

  //   final cards   = <SavedCard>[];
  //   final seenIds = <int>{}; // deduplicate by profileId

  //   for (var i = 0; i < validProfiles.length; i++) {
  //     final detail = details[i];
  //     if (detail == null) continue;

  //     final pay = detail['paymentData'] as Map<String, dynamic>?;
  //     if (pay == null) continue;
  //     final cardNumber = pay['cardNumber'] as String?;
  //     if (cardNumber == null || cardNumber.isEmpty) continue;

  //     final profileId = validProfiles[i].profileId;
  //     if (!seenIds.contains(profileId)) {
  //       seenIds.add(profileId);
  //       cards.add(SavedCard.fromProfileApiJson(profileId, pay));
  //     }
  //   }
  //   debugPrint('fetchSavedCards: found ${cards.length} card(s) from profiles');
  //   return List.unmodifiable(cards);
  // }

  // ── MOCK saveNewCard (kept for reference) ─────────────────────────────
  // static Future<Map<String, dynamic>> saveNewCard(SavedCard card) async {
  //   await Future.delayed(const Duration(milliseconds: 500));
  //   _savedCards.add(card);
  //   return {'success': true, 'message': 'Card saved successfully.', 'id': card.id};
  // }

  /// Saves a new card (local-only for now; a real POST endpoint can be wired here later).
  static Future<Map<String, dynamic>> saveNewCard(SavedCard card) async {
    // TODO: wire to POST /api/v1/Payment/SaveCard when available
    return {'success': true, 'message': 'Card saved successfully.', 'id': card.id};
  }

  // ── MOCK deleteCard (kept for reference) ──────────────────────────────
  // static Future<Map<String, dynamic>> deleteCard(String cardId) async {
  //   await Future.delayed(const Duration(milliseconds: 400));
  //   _savedCards.removeWhere((c) => c.id == cardId);
  //   return {'success': true, 'message': 'Card removed successfully.'};
  // }

  /// Deletes a card (local-only for now; a real DELETE endpoint can be wired here later).
  static Future<Map<String, dynamic>> deleteCard(String cardId) async {
    // TODO: wire to DELETE /api/v1/Payment/DeleteCard/{cardId} when available
    return {'success': true, 'message': 'Card removed successfully.'};
  }

  // ── insurances CRUD ────────────────────────────────────────────────────────

  /// Fetches saved insurances by calling GetPatientProfileByProfileId for every
  /// profile returned by GetPatientProfileListById **in parallel**, then
  /// extracting insuranceData blocks where insurance == 1.
  /// One insurance entry is produced per unique profileId that has insurance data.
  ///
  /// Real endpoint used: GET /api/v1/Patient/GetPatientProfileByProfileId/{id}
  // static Future<List<SavedInsurance>> fetchSavedInsurances() async {
  //   // ── MOCK (kept for reference) ────────────────────────────────────────────
  //   // await Future.delayed(const Duration(milliseconds: 400));
  //   // return List.unmodifiable(_savedInsurances);
  //   // ────────────────────────────────────────────────────────────────────────
  //   final profiles = await fetchPatientProfiles();
  //   if (profiles.isEmpty) return [];

  //   // Fetch all profile details in parallel for speed
  //   final validProfiles = profiles.where((p) => p.profileId != 0).toList();
  //   final details = await Future.wait(
  //     validProfiles.map((p) => fetchPatientProfileByProfileId(p.profileId)),
  //   );

  //   final insurances = <SavedInsurance>[];
  //   final seenIds    = <int>{}; // deduplicate by profileId

  //   for (var i = 0; i < validProfiles.length; i++) {
  //     final detail = details[i];
  //     if (detail == null) continue;

  //     // insurance flag == 1 means this profile has insurance data
  //     final hasInsurance = (detail['insurance'] as int? ?? 0) == 1;
  //     if (!hasInsurance) continue;

  //     final ins = detail['insuranceData'] as Map<String, dynamic>?;
  //     if (ins == null) continue;
  //     final provider = ins['provider'] as String?;
  //     if (provider == null || provider.isEmpty) continue;

  //     final profileId = validProfiles[i].profileId;
  //     if (!seenIds.contains(profileId)) {
  //       seenIds.add(profileId);
  //       insurances.add(SavedInsurance.fromProfileApiJson(profileId, ins));
  //     }
  //   }
  //   debugPrint(
  //       'fetchSavedInsurances: found ${insurances.length} insurance(s) from profiles');
  //   return List.unmodifiable(insurances);
  // }

// ── Combined fetch: cards + insurance in ONE pass over all profiles ────────
//
// Calls GetPatientProfileListById once to get all profileIds for the
// logged-in patient, then GetPatientProfileByProfileId for each profile
// IN PARALLEL, and extracts unique cards + unique insurance records.


static Future<SavedFinancialData> fetchSavedCardsAndInsurance() async {
  final profiles = await fetchPatientProfiles();
  if (profiles.isEmpty) return const SavedFinancialData([], []);

  final validProfiles = profiles.where((p) => p.profileId != 0).toList();

  // Fetch every profile's full detail in parallel
  final details = await Future.wait(
    validProfiles.map((p) => fetchPatientProfileByProfileId(p.profileId)),
  );

  final cards = <SavedCard>[];
  final insurances = <SavedInsurance>[];

  // Dedup by CONTENT — the same card/policy can appear under multiple profiles.
  final seenCardKeys = <String>{};
  final seenInsuranceKeys = <String>{};

  for (var i = 0; i < validProfiles.length; i++) {
    final detail = details[i];
    if (detail == null) continue;
    final profileId = validProfiles[i].profileId;

    // ── cards (paymentData is now a List) ──────────────────────────────────
    final rawPayment = detail['paymentData'];
    final payList = rawPayment is List
        ? rawPayment.cast<Map<String, dynamic>>()
        : (rawPayment is Map<String, dynamic> ? [rawPayment] : <Map<String, dynamic>>[]);

    for (final pay in payList) {
      final cardNumber = pay['cardNumber'] as String? ?? '';
      if (cardNumber.isEmpty) continue;
      final expiry = pay['expiry'] as String? ?? '';
      final cardKey = '$cardNumber|$expiry';
      if (seenCardKeys.add(cardKey)) {
        cards.add(SavedCard.fromProfileApiJson(profileId, pay));
      }
    }

    // ── insurances (insuranceData is now a List) ───────────────────────────
    final rawInsurance = detail['insuranceData'];
    final insList = rawInsurance is List
        ? rawInsurance.cast<Map<String, dynamic>>()
        : (rawInsurance is Map<String, dynamic> ? [rawInsurance] : <Map<String, dynamic>>[]);

    for (final ins in insList) {
      final provider = ins['provider'] as String? ?? '';
      final policy   = ins['policy']   as String? ?? '';
      if (provider.isEmpty && policy.isEmpty) continue;
      final insKey = '$provider|$policy|${ins['groupId'] ?? ''}';
      if (seenInsuranceKeys.add(insKey)) {
        insurances.add(SavedInsurance.fromProfileApiJson(profileId, ins));
      }
    }
  }

  debugPrint(
      'fetchSavedCardsAndInsurance: ${cards.length} card(s), ${insurances.length} insurance(s) from ${validProfiles.length} profile(s)');

  return SavedFinancialData(
    List.unmodifiable(cards),
    List.unmodifiable(insurances),
  );
}

// ── Thin wrappers if you still want them called separately ─────────────────
static Future<List<SavedCard>> fetchSavedCards() async =>
    (await fetchSavedCardsAndInsurance()).cards;

static Future<List<SavedInsurance>> fetchSavedInsurances() async =>
    (await fetchSavedCardsAndInsurance()).insurances;






  // ── MOCK saveNewInsurance (kept for reference) ───────────────────────────
  // static Future<Map<String, dynamic>> saveNewInsurance(SavedInsurance insurance) async {
  //   await Future.delayed(const Duration(milliseconds: 500));
  //   _savedInsurances.add(insurance);
  //   return {'success': true, 'message': 'Insurance saved successfully.', 'id': insurance.id};
  // }

  /// Saves a new insurance (local-only for now; a real POST endpoint can be wired here later).
  static Future<Map<String, dynamic>> saveNewInsurance(
      SavedInsurance insurance) async {
    // TODO: wire to POST /api/v1/Insurance/SaveInsurance when available
    return {
      'success': true,
      'message': 'Insurance saved successfully.',
      'id': insurance.id,
    };
  }

  // ── MOCK deleteInsurance (kept for reference) ────────────────────────────
  // static Future<Map<String, dynamic>> deleteInsurance(String insuranceId) async {
  //   await Future.delayed(const Duration(milliseconds: 400));
  //   _savedInsurances.removeWhere((i) => i.id == insuranceId);
  //   return {'success': true, 'message': 'Insurance removed successfully.'};
  // }

  /// Deletes an insurance (local-only for now; a real DELETE endpoint can be wired here later).
  static Future<Map<String, dynamic>> deleteInsurance(
      String insuranceId) async {
    // TODO: wire to DELETE /api/v1/Insurance/DeleteInsurance/{id} when available
    return {'success': true, 'message': 'Insurance removed successfully.'};
  }

  // ── master data ──────────────────────────────────────────────────────────────

  /// GET /api/v1/Master/GetRelationTypeList
  static Future<List<Map<String, dynamic>>> fetchRelationTypeList() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Master/GetRelationTypeList'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    // fallback – mirrors the live API response exactly
    return [
      {'relationTypeId': 1,  'relationTypeName': 'Self'},
      {'relationTypeId': 3,  'relationTypeName': 'Child'},
      {'relationTypeId': 7,  'relationTypeName': 'Grandchild'},
      {'relationTypeId': 6,  'relationTypeName': 'Grandparent'},
      {'relationTypeId': 9,  'relationTypeName': 'Guardian'},
      {'relationTypeId': 8,  'relationTypeName': 'In-Law'},
      {'relationTypeId': 4,  'relationTypeName': 'Parent'},
      {'relationTypeId': 5,  'relationTypeName': 'Sibling'},
      {'relationTypeId': 2,  'relationTypeName': 'Spouse'},
      {'relationTypeId': 10, 'relationTypeName': 'Other'},
    ];
  }

  /// GET /api/v1/Master/GetAgeTypeList
  static Future<List<Map<String, dynamic>>> fetchAgeTypeList() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Master/GetAgeTypeList'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    // fallback
    return [
      {'ageTypeId': 1, 'ageTypeName': 'Days'},
      {'ageTypeId': 2, 'ageTypeName': 'Months'},
      {'ageTypeId': 3, 'ageTypeName': 'Years'},
    ];
  }

  /// GET /api/v1/Master/GetStatusKeyList
  static Future<List<Map<String, dynamic>>> fetchStatusKeyList() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Master/GetStatusKeyList'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (decoded['result'] == 1 || decoded['statusCode'] == 200) {
          final List data = decoded['data'] as List? ?? [];
          return data.cast<Map<String, dynamic>>();
        }
      }
    } catch (e) {
      debugPrint('fetchStatusKeyList error: $e');
    }
    return [];
  }

  /// Fetches statuses for category 'VisitPurpose' from GetStatusKeyList,
  /// with live-API fallback.
  static Future<List<Map<String, dynamic>>> fetchVisitPurposes() async {
    try {
      final list = await fetchStatusKeyList();
      final category = list.firstWhere(
        (c) => (c['category'] as String?)?.toLowerCase() == 'visitpurpose',
        orElse: () => <String, dynamic>{},
      );
      final rawStatuses = category['statuses'] as List?;
      if (rawStatuses != null && rawStatuses.isNotEmpty) {
        return rawStatuses.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    // Fallback matching GET /api/v1/Master/GetStatusKeyList
    return [
      {'statusId': 27, 'statusKey': 'Consultation', 'statusValue': 'Consultation'},
      {'statusId': 28, 'statusKey': 'Follow Up', 'statusValue': 'Follow Up'},
      {'statusId': 29, 'statusKey': 'Routine Check Up', 'statusValue': 'Routine Check Up'},
      {'statusId': 30, 'statusKey': 'Emergency', 'statusValue': 'Emergency'},
      {'statusId': 31, 'statusKey': 'Referral', 'statusValue': 'Referral'},
      {'statusId': 32, 'statusKey': 'Lab / Diagnostics', 'statusValue': 'Lab / Diagnostics'},
      {'statusId': 33, 'statusKey': 'Procedure', 'statusValue': 'Procedure'},
      {'statusId': 34, 'statusKey': 'Vaccination', 'statusValue': 'Vaccination'},
      {'statusId': 35, 'statusKey': 'Prescription Renewal', 'statusValue': 'Prescription Renewal'},
    ];
  }

  /// Fetches statuses for category 'VisitType' from GetStatusKeyList,
  /// with live-API fallback.
  static Future<List<Map<String, dynamic>>> fetchVisitTypes() async {
    try {
      final list = await fetchStatusKeyList();
      final category = list.firstWhere(
        (c) => (c['category'] as String?)?.toLowerCase() == 'visittype',
        orElse: () => <String, dynamic>{},
      );
      final rawStatuses = category['statuses'] as List?;
      if (rawStatuses != null && rawStatuses.isNotEmpty) {
        return rawStatuses.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    // Fallback matching GET /api/v1/Master/GetStatusKeyList
    return [
      {'statusId': 23, 'statusKey': 'In Person', 'statusValue': 'In Person'},
      {'statusId': 24, 'statusKey': 'Walk In', 'statusValue': 'Walk In'},
      {'statusId': 25, 'statusKey': 'Virtual', 'statusValue': 'Virtual'},
      {'statusId': 26, 'statusKey': 'Home Visit', 'statusValue': 'Home Visit'},
    ];
  }

  // ── location ───────────────────────────────────────────────────────────────

  /// GET /api/v1/Location/GetCountriesList
  static Future<List<Map<String, dynamic>>> fetchCountries() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/v1/Location/GetCountriesList'),
              headers: _authHeaders)
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    return [];
  }

  /// GET /api/v1/Location/GetStatesByCountryList/{countryId}
  static Future<List<Map<String, dynamic>>> fetchStates(int countryId) async {
    try {
      final response = await http
          .get(
              Uri.parse(
                  '$baseUrl/v1/Location/GetStatesByCountryList/$countryId'),
              headers: _authHeaders)
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    return [];
  }

  /// GET /api/v1/Location/GetCitiesByStateList/{stateId}
  static Future<List<Map<String, dynamic>>> fetchCities(int stateId) async {
    try {
      final response = await http
          .get(
              Uri.parse(
                  '$baseUrl/v1/Location/GetCitiesByStateList/$stateId'),
              headers: _authHeaders)
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    return [];
  }

  // ── auth ───────────────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    try {
      final body = jsonEncode({'username': username, 'password': password});
      debugPrint('========== LOGIN REQUEST ==========');
      debugPrint(body);
      debugPrint('===================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Auth/doLogin'),
            headers: {
              'Content-Type': 'application/json',
              'Accept':       'application/json',
            },
            body: body,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== LOGIN RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('====================================');

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          (decoded['result'] == 1 || decoded['statusCode'] == 200)) {

        final rawData = decoded['data'] as Map<String, dynamic>? ?? {};

        // refId from the login response is the numeric patientId
        final int refId = (rawData['refId'] as num?)?.toInt() ?? 0;

        // Store token immediately so the next authenticated call works
        _authToken    = decoded['tokenKey']    as String?;
        _refreshToken = decoded['refreshToken'] as String?;
        // Arm the auto-logout timer based on token expiry
        if (_authToken != null) _scheduleTokenExpiry(_authToken!);


        // ── Fetch full patient profile using patientId ─────────────────────
        // This call uses the auth token we just stored above.
        final fullProfile = await fetchPatientById(refId);

        if (fullProfile != null) {
          // GetPatientById returns real profileId, firstName, lastName, DOB,
          // gender, phoneNumber, email, addressLine1/2, etc.
          currentPatient = fullProfile;
        } else {
          // Fallback: normalise the login data if profile fetch fails
          currentPatient = Map<String, dynamic>.from(rawData)
            ..['patientId'] = refId
            ..['profileId'] = refId
            ..['firstName'] = _splitFirst(rawData['fullName'] as String? ?? '')
            ..['lastName']  = _splitLast(rawData['fullName']  as String? ?? '')
            ..['email']     = rawData['email']    ?? ''
            ..['username']  = rawData['username'] ?? username;
        }

        // ── Set active hospital from login response ────────────────────────
        // The login response contains the correct activeHospitalId and
        // activeEnrollmentId. Use these to prime currentHospital so that
        // all subsequent calls (doctor list, bookings) use the right context.
        final activeHospitalId =
            (rawData['activeHospitalId'] as num?)?.toInt() ?? 0;
        final activeEnrollmentId =
            (rawData['activeEnrollmentId'] as num?)?.toInt() ?? 0;
        final enrollments =
            rawData['enrollments'] as List<dynamic>? ?? [];

        // Find the active hospital name from the enrollments list
        String activeHospitalName = '';
        for (final e in enrollments) {
          final map = e as Map<String, dynamic>;
          if ((map['hospitalId'] as int?) == activeHospitalId) {
            activeHospitalName = map['hospitalName'] as String? ?? '';
            break;
          }
        }

        if (activeHospitalId > 0) {
          currentHospital = Hospital(
            id:       activeHospitalId.toString(),
            name:     activeHospitalName.isNotEmpty
                          ? activeHospitalName
                          : 'Hospital $activeHospitalId',
            location: '',
          );
        }

        // Store enrollment info on currentPatient for use during booking
        if (currentPatient != null) {
          currentPatient!['activeHospitalId']   = activeHospitalId;
          currentPatient!['activeEnrollmentId'] = activeEnrollmentId;
          currentPatient!['enrollments']        = enrollments;
        }

        debugPrint('=== SESSION: patientId=${currentPatient?['patientId']}  '
            'profileId=${currentPatient?['profileId']}  '
            'activeHospitalId=$activeHospitalId  '
            'activeEnrollmentId=$activeEnrollmentId  '
            'token=${_authToken != null ? "present" : "missing"} ===');


        return {
          'success': true,
          'message': decoded['statusMessage'] as String? ?? 'Login successful',
          'data':    currentPatient,
        };
      } else {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message']    as String? ??
            'Login failed (${response.statusCode})';
        return {'success': false, 'message': msg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: ${e.message}'};
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  // ── GET /api/v1/Patient/GetPatientById ───────────────────────────────────────
  /// Fetches the logged-in patient's own record (JWT-based, no path param).
  /// Returns null on failure.
  static Future<Map<String, dynamic>?> fetchPatientById([int? patientId]) async {
    try {
      // Endpoint takes no path param – the server reads patientId from the JWT.
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Patient/GetPatientById'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 20));

      debugPrint('fetchPatientById status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (decoded['result'] == 1 || decoded['statusCode'] == 200) {
          final data = decoded['data'] as Map<String, dynamic>?;
          if (data != null) {
            debugPrint('fetchPatientById OK: '
                'patientId=${data['patientId']}  '
                'profileId=${data['profileId']}  '
                'name=${data['firstName']} ${data['lastName']}');
            return data;
          }
        }
      }
    } catch (e) {
      debugPrint('fetchPatientById error: $e');
    }
    return null;
  }

  // ── Fetch self patient for booking auto-fill ──────────────────────────────
  /// Returns a normalised map suitable for pre-filling the booking form.
  /// Fields: firstName, lastName, dateOfBirth (dd/MM/yyyy), age,
  ///         gender, contactNumber, emailAddress, address.
  static Future<Map<String, String>> fetchSelfPatient() async {
    final data = await fetchPatientById();
    if (data == null) return mockSelfProfile; // graceful fallback

    // Update cached currentPatient so other screens stay in sync
    currentPatient = Map<String, dynamic>.from(currentPatient ?? {})..addAll(data);

    // Convert ISO dateOfBirth to dd/MM/yyyy
    String dob = '';
    try {
      final raw = data['dateOfBirth'] as String? ?? '';
      if (raw.isNotEmpty) {
        final dt = DateTime.parse(raw);
        dob = '${dt.day.toString().padLeft(2, '0')}/'
            '${dt.month.toString().padLeft(2, '0')}/${dt.year}';
      }
    } catch (_) {}

    // Compute age from DOB
    String age = '';
    try {
      final raw = data['dateOfBirth'] as String? ?? '';
      if (raw.isNotEmpty) {
        final dt  = DateTime.parse(raw);
        final now = DateTime.now();
        final diff = now.year - dt.year -
            ((now.month < dt.month ||
                    (now.month == dt.month && now.day < dt.day))
                ? 1
                : 0);
        age = diff.toString();
      }
    } catch (_) {}

    final addr = [
      data['addressLine1'] as String? ?? '',
      data['addressLine2'] as String? ?? '',
    ].where((s) => s.isNotEmpty).join(', ');

    return {
      'firstName':     data['firstName']   as String? ?? '',
      'lastName':      data['lastName']    as String? ?? '',
      'dateOfBirth':   dob,
      'age':           age,
      'ageUnit':       'years',
      'gender':        data['gender']      as String? ?? '',
      'contactNumber': data['phoneNumber'] as String? ?? '',
      'emailAddress':  data['email']       as String? ?? '',
      'address':       addr,
      'username':      data['username']    as String? ?? '',
    };
  }


  // ── helper: split fullName into first / last ──────────────────────────────
  static String _splitFirst(String fullName) {
    final parts = fullName.trim().split(' ');
    return parts.isNotEmpty ? parts.first : fullName;
  }

  static String _splitLast(String fullName) {
    final parts = fullName.trim().split(' ');
    return parts.length > 1 ? parts.sublist(1).join(' ') : '';
  }


  // static Future<Map<String, dynamic>> login({
  //   required String username,
  //   required String password,
  // }) async {
  //   await Future.delayed(const Duration(seconds: 1));
  //   return {
  //     'success': true,
  //     'message': 'OTP sent to your registered contact',
  //     'token': 'mock_token_123456',
  //     'data': {
  //       'userId': 1,
  //       'username': username,
  //       'name': 'Test User',
  //       'mobile': '9999999999',
  //       'email': 'test@example.com',
  //       'token': 'mock_token_123456',
  //     },
  //   };
  // }


  static Future<Map<String, dynamic>> verifyOtp(
      {required String otp}) async {
    await Future.delayed(const Duration(seconds: 1));
    if (otp == '1234') {
      return {
        'success': true,
        'token':   'mock_jwt_token_123',
        'message': 'Verified',
      };
    }
    return {'success': false, 'message': 'Invalid OTP. (Hint: use 1234)'};
  }

  static Future<Map<String, dynamic>> resendOtp() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return {'success': true, 'message': 'OTP resent successfully'};
  }

  // ── POST /api/v1/Auth/ForgotPassword ──────────────────────────────────────
  /// Sends an OTP to the given email for password reset.
  static Future<Map<String, dynamic>> sendForgotPasswordOtp({
    required String emailOrPhone,
  }) async {
    // ── MOCK (kept for reference) ──────────────────────────────────────────
    // await Future.delayed(const Duration(seconds: 1));
    // if (emailOrPhone.isNotEmpty) {
    //   return {'success': true, 'message': 'OTP sent to $emailOrPhone'};
    // }
    // return {'success': false, 'message': 'Please enter a valid email or phone'};
    // ──────────────────────────────────────────────────────────────────────
    try {
      final body = jsonEncode({'email': emailOrPhone});
      debugPrint('========== FORGOT PASSWORD REQUEST ==========');
      debugPrint(body);
      debugPrint('=============================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Auth/ForgotPassword'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: body,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== FORGOT PASSWORD RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('==============================================');

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200 &&
          (decoded['result'] == 1 || decoded['statusCode'] == 200)) {
        final data = decoded['data'] as Map<String, dynamic>? ?? {};
        final msg = data['responseMessage'] as String? ??
            decoded['statusMessage'] as String? ??
            'OTP sent to $emailOrPhone';
        return {'success': true, 'message': msg};
      } else {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message'] as String? ??
            'Failed to send OTP';
        return {'success': false, 'message': msg};
      }
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  // ── POST /api/v1/Auth/VerifyForgotPasswordOtp ──────────────────────────────
  /// Verifies the OTP and returns the reset [token] on success.
  static Future<Map<String, dynamic>> verifyForgotPasswordOtp({
    required String email,
    required String otp,
  }) async {
    // ── MOCK (kept for reference) ──────────────────────────────────────────
    // await Future.delayed(const Duration(seconds: 1));
    // if (otp == '1234') {
    //   return {
    //     'success':    true,
    //     'resetToken': 'mock_reset_token_abc',
    //     'message':    'OTP verified',
    //   };
    // }
    // return {'success': false, 'message': 'Invalid OTP. (Hint: use 1234)'};
    // ──────────────────────────────────────────────────────────────────────
    try {
      final body = jsonEncode({'email': email, 'otpCode': otp});
      debugPrint('========== VERIFY FORGOT OTP REQUEST ==========');
      debugPrint(body);
      debugPrint('================================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Auth/VerifyForgotPasswordOtp'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: body,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== VERIFY FORGOT OTP RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('=================================================');

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200 &&
          (decoded['result'] == 1 || decoded['statusCode'] == 200)) {
        final data = decoded['data'] as Map<String, dynamic>? ?? {};
        final resetToken = data['token'] as String? ?? '';
        final msg = data['responseMessage'] as String? ??
            decoded['statusMessage'] as String? ??
            'OTP verified successfully';
        return {'success': true, 'resetToken': resetToken, 'message': msg};
      } else {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message'] as String? ??
            'Invalid OTP';
        return {'success': false, 'message': msg};
      }
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  // ── Resend OTP (re-calls ForgotPassword endpoint) ─────────────────────────
  static Future<Map<String, dynamic>> resendForgotPasswordOtp({
    required String emailOrPhone,
  }) async {
    // ── MOCK (kept for reference) ──────────────────────────────────────────
    // await Future.delayed(const Duration(milliseconds: 800));
    // return {'success': true, 'message': 'OTP resent to $emailOrPhone'};
    // ──────────────────────────────────────────────────────────────────────
    return sendForgotPasswordOtp(emailOrPhone: emailOrPhone);
  }

  // ── POST /api/v1/Auth/ResetForgotPassword ─────────────────────────────────
  /// Resets the password using the [token] returned by VerifyForgotPasswordOtp.
  static Future<Map<String, dynamic>> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    // ── MOCK (kept for reference) ──────────────────────────────────────────
    // await Future.delayed(const Duration(seconds: 1));
    // return {'success': true, 'message': 'Password reset successfully'};
    // ──────────────────────────────────────────────────────────────────────
    try {
      final body = jsonEncode({'token': token, 'password': newPassword});
      debugPrint('========== RESET PASSWORD REQUEST ==========');
      debugPrint(body);
      debugPrint('============================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Auth/ResetForgotPassword'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: body,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== RESET PASSWORD RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('=============================================');

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      if (response.statusCode == 200 &&
          (decoded['result'] == 1 || decoded['statusCode'] == 200)) {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message'] as String? ??
            'Password reset successfully';
        return {'success': true, 'message': msg};
      } else {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message'] as String? ??
            'Failed to reset password';
        return {'success': false, 'message': msg};
      }
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  // ── registration ───────────────────────────────────────────────────────────

  static Future<Map<String, dynamic>> registerPatient({
    required Map<String, dynamic> patientData,
  }) async {
    try {
      final body = {
        'firstName':         patientData['firstName']         ?? '',
        'middleName':        patientData['middleName']        ?? '',
        'lastName':          patientData['lastName']          ?? '',
        'dateOfBirth':       patientData['dateOfBirth']       ?? DateTime.now().toIso8601String(),
        'phoneCountryCode':  patientData['phoneCountryCode']  ?? '+91',
        'phoneNumber':       patientData['phoneNumber']       ?? '',
        'email':             patientData['email']             ?? '',
        'gender':            patientData['gender']            ?? '',
        'addressLine1':      patientData['addressLine1']      ?? '',
        'addressLine2':      patientData['addressLine2']      ?? '',
        'cityId':            patientData['cityId']            ?? 0,
        'zipCode':           patientData['zipCode']           ?? '',
        'stateId':           patientData['stateId']           ?? 0,
        'countryId':         patientData['countryId']         ?? 0,
        'username':          patientData['username']          ?? '',
        'password':          patientData['password']          ?? '',
        'securityAnswer':    patientData['securityAnswer']    ?? '',
        'securityQuestionId': patientData['securityQuestionId'] ?? 0,
      };

      final encodedBody = jsonEncode(body);
      debugPrint('========== REGISTER PATIENT REQUEST ==========');
      debugPrint(encodedBody);
      debugPrint('===============================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Auth/CreatePatientAccount'),
            headers: {
              'Content-Type': 'application/json',
              'Accept':       'application/json',
            },
            body: encodedBody,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== REGISTER PATIENT RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('================================================');

      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          final decoded =
              jsonDecode(response.body) as Map<String, dynamic>;
          return {
            'success': true,
            'message': decoded['message'] ??
                'Registration successful! Please login.',
            'data': decoded,
          };
        } catch (_) {
          return {
            'success': true,
            'message': 'Registration successful! Please login.',
          };
        }
      } else {
        String errorMsg =
            'Registration failed (${response.statusCode})';
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map) {
            errorMsg = decoded['message'] as String? ??
                decoded['title'] as String? ??
                errorMsg;
          }
        } catch (_) {
          if (response.body.isNotEmpty) errorMsg = response.body;
        }
        return {'success': false, 'message': errorMsg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: ${e.message}'};
    } on TimeoutException {
      return {
        'success': false,
        'message': 'Request timed out. Please try again.',
      };
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  static Future<Map<String, dynamic>> signInWithGoogle() async {
    await Future.delayed(const Duration(seconds: 1));
    return {
      'success': true,
      'message': 'Google sign-in not yet configured',
    };
  }

  // ── appointments ───────────────────────────────────────────────────────────

  /// GET /api/v1/Appointment/GetMyAppointments/{patientId}
  ///
  /// Returns all appointments for the logged-in patient from the real API.
  static Future<List<Appointment>> fetchMyAppointments() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Appointment/Patient/GetMyAppointmentList'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchMyAppointments status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List raw = decoded['data'] ?? [];
        return raw
            .cast<Map<String, dynamic>>()
            .map(Appointment.fromApiJson)
            .toList();
      }
    } catch (e) {
      debugPrint('fetchMyAppointments error: $e');
    }
    return [];
  }

  // ── old mock fetchAppointments (replaced by fetchMyAppointments above) ──────
  // static Future<List<Appointment>> fetchAppointments() async { … }

  /// GET /api/v1/Appointment/GetAppointmentById/{appointmentId}
  ///
  /// Returns the full detail of a single appointment including doctorProfile.
  /// Returns null on error / not found.
  static Future<Map<String, dynamic>?> fetchAppointmentById(
      int appointmentId) async {
    try {
      final response = await http
          .get(
            Uri.parse(
                '$baseUrl/v1/Appointment/GetAppointmentById/$appointmentId'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchAppointmentById($appointmentId) status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        return decoded['data'] as Map<String, dynamic>?;
      }
    } catch (e) {
      debugPrint('fetchAppointmentById error: $e');
    }
    return null;
  }

  /// PUT /api/v1/Appointment/UpdateAppointmentDetail
  ///
  /// Updates slot, visitPurpose, visitType for an existing appointment.
  static Future<Map<String, dynamic>> updateAppointmentDetail({
    required int appointmentId,
    required int patientId,
    required int associateId,
    required int slotId,
    required String visitPurpose,
    required String visitType,
    required String rescheduleReason,
  }) async {
    final lastUpdatedBy = ApiService.currentPatient?['username'] as String? ?? '';
    try {
      final body = jsonEncode({
        'appointmentId':   appointmentId,
        'patientId':       patientId,
        'associateId':     associateId,
        'slotId':          slotId,
        'visitPurpose':    visitPurpose,
        'visitType':       visitType,
        'lastUpdatedBy':   lastUpdatedBy,
        'associateRole':   '',
        'rescheduleReason': rescheduleReason,
      });

      debugPrint('========== UPDATE APPOINTMENT REQUEST ==========');
      debugPrint(body);
      debugPrint('================================================');

      final response = await http
          .put(
            Uri.parse('$baseUrl/v1/Appointment/UpdateAppointmentSchedule'),
            headers: _authJsonHeaders,
            body: body,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== UPDATE APPOINTMENT RESPONSE ==========');
      debugPrint('Status: \${response.statusCode}');
      debugPrint('Body: \${response.body}');
      debugPrint('=================================================');

      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          final ok = decoded['result'] == 1 ||
              decoded['statusCode'] == 200 ||
              decoded['success'] == true;
          return {
            'success': ok,
            'message': decoded['statusMessage'] as String? ??
                decoded['message'] as String? ??
                (ok ? 'Appointment updated successfully.' : 'Update failed.'),
          };
        } catch (_) {
          return {'success': true, 'message': 'Appointment updated successfully.'};
        }
      } else {
        String msg = 'Update failed (\${response.statusCode})';
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map) {
            msg = decoded['statusMessage'] as String? ??
                  decoded['message']     as String? ?? msg;
          }
        } catch (_) {}
        return {'success': false, 'message': msg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: \${e.message}'};
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  /// DELETE /api/v1/Appointment/CancelAppointmentById
  ///
  /// Sends a JSON body: { appointmentId, patientId, cancelReason,
  /// lastUpdatedBy, associateRole: "Patient" }
  static Future<Map<String, dynamic>> cancelAppointmentById({
    required int appointmentId,
    required int patientId,
    String cancelReason = '',
  }) async {
    final lastUpdatedBy =
        ApiService.currentPatient?['username'] as String? ?? '';
    try {
      final body = jsonEncode({
        'appointmentId': appointmentId,
        'patientId':     patientId,
        'cancelReason':  cancelReason,
        'lastUpdatedBy': lastUpdatedBy,
        'associateRole': 'Patient',
      });

      debugPrint('========== CANCEL APPOINTMENT REQUEST ==========');
      debugPrint(body);
      debugPrint('================================================');

      final request = http.Request(
        'DELETE',
        Uri.parse('$baseUrl/v1/Appointment/CancelAppointmentById'),
      )
        ..headers.addAll(_authJsonHeaders)
        ..body = body;

      final streamedResponse =
          await request.send().timeout(const Duration(seconds: 30));
      final response = await http.Response.fromStream(streamedResponse);

      debugPrint('========== CANCEL APPOINTMENT RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('=================================================');

      if (response.statusCode == 200 || response.statusCode == 204) {
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          final ok = decoded['result'] == 1 ||
              decoded['statusCode'] == 200 ||
              decoded['success'] == true;
          return {
            'success': ok,
            'message': decoded['statusMessage'] as String? ??
                decoded['message'] as String? ??
                (ok ? 'Appointment cancelled.' : 'Cancellation failed.'),
          };
        } catch (_) {
          return {'success': true, 'message': 'Appointment cancelled.'};
        }
      } else {
        String msg = 'Cancellation failed (${response.statusCode})';
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map) {
            msg = decoded['statusMessage'] as String? ??
                  decoded['message']     as String? ?? msg;
          }
        } catch (_) {}
        return {'success': false, 'message': msg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: ${e.message}'};
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  // ── rx orders (medicine orders) ───────────────────────────────────────────

  /// GET /api/v1/RxOrder/GetRxOrderByPatientId/{patientId}
  ///
  /// Returns all prescription/medicine orders for the logged-in patient.
  // ── old GET endpoint (replaced by POST below) ──────────────────────────────
  // static Future<List<RxOrder>> fetchRxOrders() async { … GET /GetRxOrderByPatientId }

  /// POST /api/v1/RxOrder/GetRxOrderByPatientProfileId
  ///
  /// Returns all prescription orders for this patient across all profiles,
  /// with richer fields (profileId, drugName, pharmacyAddress, expiryDate, etc.).
  static Future<List<RxOrder>> fetchRxOrders() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/RxOrder/GetRxOrderByPatientProfileId'),
            headers: _authJsonHeaders,
            body: jsonEncode({'patientId': patientId}),
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchRxOrders (profile) status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List raw = decoded['data'] ?? [];
        return raw.cast<Map<String, dynamic>>().map(RxOrder.fromJson).toList();
      }
    } catch (e) {
      debugPrint('fetchRxOrders error: $e');
    }
    return [];
  }

  /// Returns a map of profileId → relationTypeName built from fetchPatientProfiles.
  /// e.g. { 21: 'Self', 46: 'Spouse' }
  static Future<Map<int, String>> fetchProfileRelationMap() async {
    final profiles = await fetchPatientProfiles();
    return { for (final p in profiles) p.profileId: p.relation };
  }


  // ── doctors ────────────────────────────────────────────────────────────────

  /// GET /api/v1/Doctor/GetDoctorList
  static Future<Map<String, List<Doctor>>> fetchDoctorsBySpecialty() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/v1/Doctor/GetDoctorList'),
              headers: _authHeaders)
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final decoded =
            jsonDecode(response.body) as Map<String, dynamic>;
        final List categories = decoded['data'] ?? [];

        final Map<String, List<Doctor>> grouped = {};
        for (final category in categories) {
          final String specialty = category['category'] as String;
          final List doctorList  = category['doctors'] ?? [];
          grouped[specialty] = doctorList.map((d) {
            final String hours =
                '${d['fromTime']} – ${d['toTime']}';
            return Doctor.fromJson({
              'name':         'Dr. ${(d['name'] as String).replaceFirst('Dr. ', '')}',
              'qualification': d['degree']     ?? '',
              'department':    d['department'] ?? '',
              'visitingHours': hours,
              'specialty':     specialty,
              // API returns associateId – pass it through so Doctor.associateId is set correctly
              'associateId':   d['associateId'],
              'image':         d['image'],
            });
          }).toList();
        }
        return grouped;
      }
    } catch (_) {}
    return {};
  }

  // ── cached raw slots from GetDoctorTimeSlotById ────────────────────────────
  // Keyed by associateId so multiple doctors don't collide.
  static final Map<int, List<Map<String, dynamic>>> _slotCache = {};

  /// POST /api/v1/Doctor/GetDoctorTimeSlotById
  /// Body: { "associateId": <id> }
  ///
  /// Returns ALL slots for the coming week, grouped by slotDate.
  /// Result is cached in _slotCache so fetchTimeSlotsForDate can reuse it.
  static Future<List<DoctorAvailability>> fetchDoctorAvailability({
    required String doctorName,
    int? associateId,
  }) async {
    if (associateId == null) return _mockAvailability();

    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Doctor/GetDoctorTimeSlotById'),
            headers: _authJsonHeaders,
            body: jsonEncode({'associateId': associateId}),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List rawSlots = decoded['data'] ?? [];

        // Cache the raw slot list for this doctor
        _slotCache[associateId] = rawSlots.cast<Map<String, dynamic>>();

        // Group by slotDate → build one DoctorAvailability row per date
        final Map<String, List<Map<String, dynamic>>> byDate = {};
        for (final s in rawSlots) {
          final date = _parseSlotDate(s['slotDate'] as String? ?? '');
          byDate.putIfAbsent(date, () => []).add(s as Map<String, dynamic>);
        }

        // Build availability list (sorted by date, today and future only)
        final List<DoctorAvailability> result = [];
        final now      = DateTime.now();
        final todayMidnight = DateTime(now.year, now.month, now.day);

        final sortedDates = byDate.keys.toList()
          ..sort((a, b) => _slotDateToDateTime(a).compareTo(_slotDateToDateTime(b)));

        for (final dateStr in sortedDates) {
          // Skip any date that is before today
          final dateVal = _slotDateToDateTime(dateStr);
          if (dateVal.isBefore(todayMidnight)) continue;

          final daySlots = byDate[dateStr]!;
          final total    = daySlots.length;
          final booked   = daySlots.where((s) => s['isBooked'] == true).length;
          final avail    = total - booked;

          String status;
          if (avail == 0)               status = 'unavailable';
          else if (avail <= total ~/ 3) status = 'limited';
          else                          status = 'available';

          // timeSlot: show the range from first to last slot of the day
          final first   = daySlots.first['startTime'] as String? ?? '';
          final last    = daySlots.last['endTime']    as String? ?? '';
          final dayName = (daySlots.first['workingDays'] as String? ?? '').toUpperCase();

          result.add(DoctorAvailability.fromJson({
            'date':     dateStr,
            'dayName':  dayName,
            'timeSlot': '$first – $last',
            'status':   status,
          }));
        }
        return result;
      }
    } catch (e) {
      debugPrint('fetchDoctorAvailability error: $e');
    }
    return _mockAvailability();
  }

  /// Returns the individual time slots for a specific date string (as returned
  /// by fetchDoctorAvailability, e.g. "Jun 22, 2026").
  /// Uses the cached data from the last fetchDoctorAvailability call.
  static Future<List<TimeSlot>> fetchTimeSlotsForDate({
    required int associateId,
    required String dateStr,   // same string as DoctorAvailability.date
  }) async {
    // Try cache first
    final cached = _slotCache[associateId];
    if (cached != null) {
      final daySlots = cached
          .where((s) => _parseSlotDate(s['slotDate'] as String? ?? '') == dateStr)
          .toList();
      if (daySlots.isNotEmpty) {
        return daySlots.map((s) => TimeSlot(
          slotId:   s['slotId'] as int? ?? s['slotNumber'] as int? ?? 0,
          time:     s['startTime'] as String? ?? '',
          endTime:  s['endTime']   as String? ?? '',
          isBooked: s['isBooked'] == true || s['isAvailable'] == false,
        )).toList();
      }
    }

    // Fallback: re-fetch and filter
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Doctor/GetDoctorTimeSlotById'),
            headers: _authJsonHeaders,
            body: jsonEncode({'associateId': associateId}),
          )
          .timeout(const Duration(seconds: 30));


      if (response.statusCode == 200) {
        final decoded  = jsonDecode(response.body) as Map<String, dynamic>;
        final rawSlots = (decoded['data'] as List? ?? []).cast<Map<String, dynamic>>();
        _slotCache[associateId] = rawSlots;

        return rawSlots
            .where((s) => _parseSlotDate(s['slotDate'] as String? ?? '') == dateStr)
            .map((s) => TimeSlot(
                  slotId:   s['slotId'] as int? ?? s['slotNumber'] as int? ?? 0,
                  time:     s['startTime'] as String? ?? '',
                  endTime:  s['endTime']   as String? ?? '',
                  isBooked: s['isBooked'] == true || s['isAvailable'] == false,
                ))
            .toList();
      }
    } catch (e) {
      debugPrint('fetchTimeSlotsForDate error: $e');
    }
    return _mockTimeSlots();
  }

  /// Parses API slotDate "06/22/2026 00:00:00" → "Jun 22, 2026"
  static String _parseSlotDate(String raw) {
    try {
      final datePart = raw.split(' ').first;          // "06/22/2026"
      final parts    = datePart.split('/');            // ["06","22","2026"]
      if (parts.length == 3) {
        final month = int.parse(parts[0]);
        final day   = int.parse(parts[1]);
        final year  = int.parse(parts[2]);
        const months = [
          '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        return '${months[month]} $day, $year';
      }
    } catch (_) {}
    return raw;
  }

  static DateTime _slotDateToDateTime(String parsed) {
    // "Jun 22, 2026" → DateTime
    try {
      const months = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4,  'May': 5,  'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
      };
      final parts = parsed.replaceAll(',', '').split(' ');
      if (parts.length == 3) {
        final m = months[parts[0]] ?? 1;
        final d = int.parse(parts[1]);
        final y = int.parse(parts[2]);
        return DateTime(y, m, d);
      }
    } catch (_) {}
    return DateTime.now();
  }

  static Future<List<DoctorAvailability>> _mockAvailability() async {
    await Future.delayed(const Duration(milliseconds: 600));
    final raw = [
      {'date': 'Apr 15, 2026', 'dayName': 'MONDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
      {'date': 'Apr 16, 2026', 'dayName': 'TUESDAY',   'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
      {'date': 'Apr 17, 2026', 'dayName': 'WEDNESDAY', 'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
      {'date': 'Apr 18, 2026', 'dayName': 'THURSDAY',  'timeSlot': '09:00 AM – 05:30 PM', 'status': 'limited'},
      {'date': 'Apr 19, 2026', 'dayName': 'FRIDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'unavailable'},
      {'date': 'Apr 20, 2026', 'dayName': 'SATURDAY',  'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
      {'date': 'Apr 21, 2026', 'dayName': 'SUNDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
    ];
    return raw.map(DoctorAvailability.fromJson).toList();
  }

  static List<TimeSlot> _mockTimeSlots() {
    final allTimes = [
      ('09:00 AM', '09:30 AM'), ('09:30 AM', '10:00 AM'),
      ('10:00 AM', '10:30 AM'), ('10:30 AM', '11:00 AM'),
      ('11:00 AM', '11:30 AM'), ('11:30 AM', '12:00 PM'),
      ('12:00 PM', '12:30 PM'), ('12:30 PM', '01:00 PM'),
      ('02:00 PM', '02:30 PM'), ('02:30 PM', '03:00 PM'),
      ('03:00 PM', '03:30 PM'), ('03:30 PM', '04:00 PM'),
      ('04:00 PM', '04:30 PM'), ('04:30 PM', '05:00 PM'),
    ];
    return List.generate(
      allTimes.length,
      (i) => TimeSlot(
        slotId:   i + 1,
        time:     allTimes[i].$1,
        endTime:  allTimes[i].$2,
        isBooked: {3, 7}.contains(i),
      ),
    );
  }


  // ── booking ────────────────────────────────────────────────────────────────

  /// POST /api/v1/Appointment/CreateAppointment
  ///
  /// Maps the internal bookingData map to the API contract.
  /// associateId = doctor's id (previously named doctorId).
  /// relationType is sent blank for self/saved patients, populated for new.
  /// Insurance and card are mutually exclusive (insurance = true → no card).
  static Future<Map<String, dynamic>> bookAppointment({
    required Map<String, dynamic> bookingData,
  }) async {
    final firstName = bookingData['firstName']     as String? ?? '';
    final lastName  = bookingData['lastName']      as String? ?? '';
    final contact   = bookingData['contactNumber'] as String? ?? '';

    if (firstName.isEmpty || lastName.isEmpty || contact.isEmpty) {
      return {
        'success': false,
        'message': 'Please fill all required fields.',
      };
    }

    // ── parse age ────────────────────────────────────────────────────────────
    final ageStr    = bookingData['age'] as String? ?? '';
    final ageVal    = int.tryParse(ageStr) ?? 0;
    final ageTypeId = bookingData['ageTypeId'] as int? ?? 3; // default: Years (id=3)

    // ── parse date of birth (dd/MM/yyyy → ISO) ───────────────────────────────
    String dobIso = DateTime.now().toIso8601String();
    try {
      final parts = (bookingData['dateOfBirth'] as String? ?? '').split('/');
      if (parts.length == 3) {
        dobIso = DateTime(
          int.parse(parts[2]), int.parse(parts[1]), int.parse(parts[0]),
        ).toIso8601String();
      }
    } catch (_) {}

    // ── appointment date (ISO from slot date string) ──────────────────────────
    final apptDateIso = DateTime.now().toIso8601String(); // slot date is a day-name string from API

    // ── patient / associate IDs from stored session ───────────────────────────
    final patientId   = currentPatient?['patientId']  as int? ?? 0;
    final associateId = bookingData['associateId'] as int? ?? 0;
    final slotId      = bookingData['slotId']          as int? ?? 0;

    // profileId resolution:
    // - New patient    → caller passes profileId = 0; backend creates the profile.
    // - Existing profile → caller passes the profileId from fetchPatientProfiles().
    // - Self           → caller passes profileId = 0; fall back to currentProfileId.
    final explicitProfileId = bookingData['profileId'] as int? ?? 0;
    final profileId = explicitProfileId != 0 ? explicitProfileId : currentProfileId;

    // ── insurance/payment ────────────────────────────────────────────────────
    // Both keys are ALWAYS sent. The inactive one uses null values.
    final hasInsurance = bookingData['hasInsurance'] as bool? ?? false;

    final Map<String, dynamic> insuranceData = hasInsurance
        ? {
            'provider':   bookingData['insuranceProviderName']         ?? '',
            'policy':     bookingData['insurancePolicyId']             ?? '',
            'groupId':    bookingData['insuranceGroupId']?.toString()  ?? '', // string per API schema
            'holderName': bookingData['insurancePrimaryHolderName']    ?? '',
            'address':    bookingData['insurancePrimaryHolderAddress'] ?? '',
          }
        : {
            // insurance not used – send empty values
            'provider':   null,
            'policy':     null,
            'groupId':    '',   // string field – send empty string
            'holderName': null,
            'address':    null,
          };


    final Map<String, dynamic> paymentData = hasInsurance
        ? {
            'paymentType': null,
            'cardHolder':  null,
            'cardNumber':  null,
            'expiry':      null,
            'cvv':         null,
          }
        : {
            'paymentType': 'Card',
            'cardHolder':  bookingData['cardHolderName'],               // name
            'cardNumber':  bookingData['cardRawNumber'],                 // raw digits or null (saved card)
            'expiry':      bookingData['cardExpiry'],
            'cvv':         bookingData['cardCvv'],                       // real digits or null (saved card)
          };

    // ── relationTypeId: 1(Self) for self, saved patient's type, or selected for new ──
    // Never send 0 — the backend rejects it with a FK constraint error.
    // Default to 1 (Self) as a safe fallback.
    final rawRelatonTypeId = bookingData['relatonTypeId'] as int? ?? 0;
    final relatonTypeId = rawRelatonTypeId > 0 ? rawRelatonTypeId : 1;

    // ── visitPurpose & visitType: statusId integers from GetStatusKeyList ─────
    final rawVisitPurpose = bookingData['visitPurpose'];
    final parsedVisitPurpose = rawVisitPurpose is int
        ? rawVisitPurpose
        : (int.tryParse(rawVisitPurpose?.toString() ?? '') ?? 0);
    final int visitPurpose = parsedVisitPurpose > 0 ? parsedVisitPurpose : 27; // Default: Consultation (27)

    final rawVisitType = bookingData['visitType'];
    final parsedVisitType = rawVisitType is int
        ? rawVisitType
        : (int.tryParse(rawVisitType?.toString() ?? '') ?? 0);
    final int visitType = parsedVisitType > 0 ? parsedVisitType : 23; // Default: In Person (23)

    final requestBody = <String, dynamic>{
      'patientId':       patientId,
      'profileId':       profileId,
      'associateId':     associateId,
      'associateRole':   '',
      'slotId':          slotId,
      'firstName':       firstName,
      'lastName':        lastName,
      'age':             ageVal,
      'ageTypeId':       ageTypeId,
      'dateOfBirth':     dobIso,
      'email':           bookingData['emailAddress']  ?? '',
      'gender':          bookingData['gender']        ?? '',
      'phone':           contact,
      'relationTypeId':   relatonTypeId,
      'appointmentDate': apptDateIso,
      'timeSlot':        bookingData['time']          ?? '',
      'visitPurposeId':    visitPurpose,
      'visitTypeId':       visitType,
      'otpMethod':       bookingData['otpChannel']    ?? 'mobile',
      'insurance':       hasInsurance,
      'insuranceData':   insuranceData,
      'paymentData':     paymentData,
      'createdBy':       currentPatient?['username']  as String? ?? '',
    };


    try {
      final encoded = jsonEncode(requestBody);
      debugPrint('========== CREATE APPOINTMENT REQUEST ==========');
      debugPrint(encoded);
      debugPrint('================================================');

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Appointment/CreateAppointment'),
            headers: _authJsonHeaders,
            body: encoded,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('========== CREATE APPOINTMENT RESPONSE ==========');
      debugPrint('Status: ${response.statusCode}');
      debugPrint('Body: ${response.body}');
      debugPrint('=================================================');

      final decoded = jsonDecode(response.body) as Map<String, dynamic>;

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          (decoded['result'] == 1 || decoded['statusCode'] == 200)) {
        final masked = contact.length >= 4
            ? '+91 ••••• ${contact.substring(contact.length - 4)}'
            : '+91 •••• ••••';

        final apptId = (decoded['data']?['appointmentId'] ??
                        decoded['data']?['id'] ??
                        'APT-${DateTime.now().millisecondsSinceEpoch}')
            .toString();

        return {
          'success':       true,
          'appointmentId': apptId,
          'message': decoded['statusMessage'] as String? ??
              decoded['data']?['responseMessage'] as String? ??
              decoded['message'] as String? ??
              'Your appointment has been booked successfully.',
        };
      } else {
        final msg = decoded['statusMessage'] as String? ??
            decoded['message']    as String? ??
            'Booking failed (\${response.statusCode})';
        return {'success': false, 'message': msg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: \${e.message}'};
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }

  /// POST /api/v1/Appointment/SendOtp
  /// Sends an OTP to the patient's contact before appointment creation.
  static Future<Map<String, dynamic>> sendBookingOtp({
    required String contact,
    required String channel,
  }) async {
    // There is no dedicated send-OTP endpoint yet;
    // we return success immediately so the flow can proceed to OTP entry.
    debugPrint('========== SEND BOOKING OTP ==========');
    debugPrint('contact=$contact  channel=$channel');
    debugPrint('======================================');
    await Future.delayed(const Duration(milliseconds: 500));
    return {'success': true, 'message': 'OTP sent to your registered $channel.'};
  }

  /// POST /api/v1/Appointment/VerifyOtp
  /// Verifies the OTP entered by the patient.
  /// Appointment creation happens separately after this succeeds.
  static Future<Map<String, dynamic>> verifyBookingOtp({
    required String otp,
  }) async {
    // Placeholder: accept any 4-digit OTP so testers can proceed.
    // Replace the body below with a real HTTP call once the backend
    // exposes a dedicated verify-OTP endpoint.
    await Future.delayed(const Duration(milliseconds: 800));
    if (otp.length == 4) {
      return {
        'success': true,
        'message': 'OTP verified successfully.',
      };
    }
    return {'success': false, 'message': 'Invalid OTP. Please try again.'};
  }

  /// POST /api/v1/Appointment/ResendOtp
  static Future<Map<String, dynamic>> resendBookingOtp({
    required String contact,
    required String channel,
  }) async {
    debugPrint('========== RESEND BOOKING OTP ==========');
    debugPrint('contact=$contact  channel=$channel');
    debugPrint('========================================');
    await Future.delayed(const Duration(milliseconds: 800));
    return {'success': true, 'message': 'OTP resent successfully'};
  }

  // ── lab results ────────────────────────────────────────────────────────────

  /// GET /api/v1/Lab/GetLabResultsByPatientId/{patientId}
  ///
  /// Returns all lab results for the given patient across all profiles.
  static Future<List<Map<String, dynamic>>> fetchLabResultsByPatientId(
      int patientId) async {
    debugPrint('===== GET Lab Results By PatientId ($patientId) =====');
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/v1/Lab/GetLabResultsByPatientId'),
        headers: _authHeaders,
      );
      debugPrint('Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (body['result'] == 1 && body['data'] != null) {
          return List<Map<String, dynamic>>.from(
              body['data'] as List<dynamic>);
        }
      }
    } catch (e) {
      debugPrint('fetchLabResultsByPatientId error: $e');
    }
    return [];
  }

  /// GET /api/v1/Lab/GetLabResultsByProfileId{profileId}
  ///
  /// Returns all lab results for a specific patient profile.
  static Future<List<Map<String, dynamic>>> fetchLabResultsByProfileId(
      int profileId) async {
    debugPrint('===== GET Lab Results By ProfileId ($profileId) =====');
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/v1/Lab/GetLabResultsByProfileId$profileId'),
        headers: _authHeaders,
      );
      debugPrint('Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (body['result'] == 1 && body['data'] != null) {
          return List<Map<String, dynamic>>.from(
              body['data'] as List<dynamic>);
        }
      }
    } catch (e) {
      debugPrint('fetchLabResultsByProfileId error: $e');
    }
    return [];
  }

  /// GET /api/v1/Lab/GetLabResultDetailById{id}
  ///
  /// Returns detailed information for a specific lab result by its ID.
  static Future<Map<String, dynamic>?> fetchLabResultDetailById(
      int resultId) async {
    debugPrint('===== GET Lab Result Detail By Id ($resultId) =====');
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/v1/Lab/GetLabResultDetailById$resultId'),
        headers: _authHeaders,
      );
      debugPrint('Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (body['result'] == 1 && body['data'] != null) {
          return Map<String, dynamic>.from(
              body['data'] as Map<String, dynamic>);
        }
      }
    } catch (e) {
      debugPrint('fetchLabResultDetailById error: $e');
    }
    return null;
  }

  /// Convenience wrapper: fetches all lab results for the currently logged-in
  /// patient using [fetchLabResultsByPatientId].
  static Future<List<Map<String, dynamic>>> fetchLabResults() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    return fetchLabResultsByPatientId(patientId);
  }

  /// Convenience wrapper: fetches a single lab result detail for the currently
  /// logged-in patient using [fetchLabResultDetailById].
  static Future<Map<String, dynamic>?> fetchLabResultDetail(
      int resultId) async {
    return fetchLabResultDetailById(resultId);
  }

  // ── Messages ──────────────────────────────────────────────────────────────

  /// GET /api/v1/Message/MessageListById/{id}
  ///
  /// Returns all messages/notifications for the logged-in patient.
  /// Uses the patient's numeric patientId (refId) from the login response.
  static Future<List<Map<String, dynamic>>> fetchMessages() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Message/MessageListById/$patientId'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchMessages status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final List raw = decoded['data'] ?? [];
        return raw.cast<Map<String, dynamic>>();
      }
    } catch (e) {
      debugPrint('fetchMessages error: $e');
    }
    return [];
  }

  /// PUT /api/v1/Message/UpdateMessageToRead
  ///
  /// Marks a specific message as read.
  /// Body: { "messageId": <id>, "isRead": true }
  static Future<Map<String, dynamic>> markMessageAsRead(int messageId) async {
    try {
      final body = jsonEncode({'messageId': messageId, 'isRead': true});
      final response = await http
          .put(
            Uri.parse('$baseUrl/v1/Message/UpdateMessageToRead'),
            headers: _authJsonHeaders,
            body: body,
          )
          .timeout(const Duration(seconds: 15));

      debugPrint('markMessageAsRead($messageId) status: ${response.statusCode}');

      if (response.statusCode == 200) {
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          final ok = decoded['result'] == 1 || decoded['statusCode'] == 200;
          return {
            'success': ok,
            'message': decoded['statusMessage'] as String? ?? (ok ? 'Marked as read.' : 'Failed.'),
          };
        } catch (_) {
          return {'success': true, 'message': 'Marked as read.'};
        }
      }
    } catch (e) {
      debugPrint('markMessageAsRead error: $e');
    }
    return {'success': false, 'message': 'Could not mark message as read.'};
  }

  /// PUT /api/v1/Message/Archive/{messageId}  (kept for UI archive feature)
  static Future<Map<String, dynamic>> archiveMessage(int messageId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return {'success': true, 'message': 'Message archived successfully.'};
  }

  /// PUT /api/v1/Message/Unarchive/{messageId}
  static Future<Map<String, dynamic>> unarchiveMessage(int messageId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return {'success': true, 'message': 'Message unarchived successfully.'};
  }

  /// DELETE /api/v1/Message/Delete/{messageId}
  static Future<Map<String, dynamic>> deleteMessage(int messageId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return {'success': true, 'message': 'Message deleted permanently.'};
  }

  // ── Billing ───────────────────────────────────────────────────────────────

  // ── MOCK fetchBills (kept for reference) ─────────────────────────────────
  // static Future<List<Map<String, dynamic>>> fetchBills() async {
  //   await Future.delayed(const Duration(milliseconds: 600));
  //   return [
  //     {
  //       'billId':               1,
  //       'patientName':          'Ramesh',
  //       'doctorName':           'Dr. Arun',
  //       'clinicName':           'ABC Health Centre',
  //       'visitDate':            '10 May 2026',
  //       'orderDate':            '01 May 2026',
  //       'paymentDate':          '05 May 2026',
  //       'totalCharge':          500.0,
  //       'insuranceCovered':     300.0,
  //       'adjustments':          50.0,
  //       'patientResponsibility':150.0,
  //       'remainingBalance':     0.0,
  //       'status':               'Paid',
  //     },
  //     {
  //       'billId':               2,
  //       'patientName':          'Ramesh',
  //       'doctorName':           'Dr. Tarun',
  //       'clinicName':           'City Centre Clinic',
  //       'visitDate':            '08 May 2026',
  //       'orderDate':            '08 May 2026',
  //       'paymentDate':          '05 May 2026',
  //       'totalCharge':          1200.0,
  //       'insuranceCovered':     800.0,
  //       'adjustments':          100.0,
  //       'patientResponsibility':300.0,
  //       'remainingBalance':     100.0,
  //       'status':               'Pending',
  //     },
  //     {
  //       'billId':               3,
  //       'patientName':          'Priya',
  //       'doctorName':           'Dr. Meena',
  //       'clinicName':           'City Centre Clinic',
  //       'visitDate':            '02 May 2026',
  //       'orderDate':            '02 May 2026',
  //       'paymentDate':          '10 May 2026',
  //       'totalCharge':          800.0,
  //       'insuranceCovered':     500.0,
  //       'adjustments':          0.0,
  //       'patientResponsibility':300.0,
  //       'remainingBalance':     300.0,
  //       'status':               'Overdue',
  //     },
  //     {
  //       'billId':               4,
  //       'patientName':          'Anita',
  //       'doctorName':           'Dr. Arun',
  //       'clinicName':           'ABC Health Centre',
  //       'visitDate':            '15 May 2026',
  //       'orderDate':            '15 May 2026',
  //       'paymentDate':          '20 May 2026',
  //       'totalCharge':          650.0,
  //       'insuranceCovered':     400.0,
  //       'adjustments':          50.0,
  //       'patientResponsibility':200.0,
  //       'remainingBalance':     0.0,
  //       'status':               'Paid',
  //     },
  //   ];
  // }

  /// GET /api/v1/Billing/GetBillingListByPatientId/{patientId}
  ///
  /// Returns the raw `data[]` array from the API. Each element contains
  /// claims[], lineItems[], insurancePayments[], adjustments[], and
  /// patientResponsibility[].  Pass each element to Bill.fromApiJson().
  static Future<List<Map<String, dynamic>>> fetchBills() async {
    final patientId = currentPatient?['patientId'] as int?;
    if (patientId == null) return [];
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Billing/GetBillingListByPatientId'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 30));

      debugPrint('fetchBills status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (decoded['result'] == 1 || decoded['statusCode'] == 200) {
          final List raw = decoded['data'] ?? [];
          return raw.cast<Map<String, dynamic>>();
        }
      }
    } catch (e) {
      debugPrint('fetchBills error: $e');
    }
    return [];
  }

  /// GET /api/v1/Billing/GetBillByClaimId/{id}
  ///
  /// Returns the raw detail map for a single claim. Pass to Bill.fromApiJson().
  static Future<Map<String, dynamic>?> fetchBillByClaimId(int claimId) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Billing/GetBillByClaimId/$claimId'),
            headers: _authHeaders,
          )
          .timeout(const Duration(seconds: 20));

      debugPrint('fetchBillByClaimId($claimId) status: ${response.statusCode}');

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (decoded['result'] == 1 || decoded['statusCode'] == 200) {
          // API may wrap single record in data[] or data directly
          final data = decoded['data'];
          if (data is List && data.isNotEmpty) {
            return data.first as Map<String, dynamic>;
          } else if (data is Map<String, dynamic>) {
            return data;
          }
        }
      }
    } catch (e) {
      debugPrint('fetchBillByClaimId error: $e');
    }
    return null;
  }
}

