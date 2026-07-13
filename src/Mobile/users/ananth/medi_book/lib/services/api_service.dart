
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

  /// The auth token returned as `tokenKey` in the login response.
  /// Injected as `Authorization: Bearer <token>` on every authenticated call.
  static String? _authToken;

  /// Whether the user is currently authenticated.
  static bool get isAuthenticated => _authToken != null;

  /// Clears the session (call on logout).
  static void clearSession() {
    currentPatient = null;
    _authToken = null;
  }

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
        'dateOfBirth':   '',
        'age':           '',
        'ageUnit':       'years',
        'gender':        '',
        'address':       '',
        'contactNumber': p?['phoneNumber']?.toString() ?? '',
        'emailAddress':  '',
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
    return {
      'firstName':     p['firstName']   as String? ?? '',
      'lastName':      p['lastName']    as String? ?? '',
      'dateOfBirth':   dob,
      'age':           '',
      'ageUnit':       'years',
      'gender':        p['gender']      as String? ?? '',
      'address':       '${p['addressLine1'] ?? ''} ${p['addressLine2'] ?? ''}'.trim(),
      'contactNumber': p['phoneNumber'] as String? ?? '',
      'emailAddress':  p['email']       as String? ?? '',
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


  // ── mock saved cards ───────────────────────────────────────────────────────
  static final List<SavedCard> _savedCards = [
    SavedCard(
      id:         'CARD-001',
      holderName: 'Suresh Kumar',
      cardNumber: '4111111111113456',
      expiry:     '08/27',
      cvv:        '123',
      cardType:   'Visa',
    ),
    SavedCard(
      id:         'CARD-002',
      holderName: 'Suresh Kumar',
      cardNumber: '5200828282827890',
      expiry:     '12/26',
      cvv:        '456',
      cardType:   'Mastercard',
    ),
  ];

  // ── mock saved insurances ──────────────────────────────────────────────────
  static final List<SavedInsurance> _savedInsurances = [
    SavedInsurance(
      id:                   'INS-001',
      providerName:         'Star Health Insurance',
      policyId:             'POL-SH-987654',
      groupId:              'GRP-001',
      primaryHolderName:    'Suresh Kumar',
      primaryHolderAddress: '12, MG Road, Kochi, Kerala - 682001',
    ),
    SavedInsurance(
      id:                   'INS-002',
      providerName:         'HDFC ERGO Health',
      policyId:             'POL-HE-112233',
      groupId:              'GRP-002',
      primaryHolderName:    'Suresh Kumar',
      primaryHolderAddress: '12, MG Road, Kochi, Kerala - 682001',
    ),
  ];

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
            Uri.parse('$baseUrl/v1/Patient/GetPatientProfileListById/$patientId'),
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

  // ── old mock fetchSavedPatients (replaced by fetchPatientProfiles above) ────
  // static Future<List<SavedPatient>> fetchSavedPatients() async {
  //   await Future.delayed(const Duration(milliseconds: 400));
  //   return List.unmodifiable(_savedPatients);
  // }

  // ── old mock saveNewPatient (new patients are booked without a profileId) ──
  // static Future<Map<String, dynamic>> saveNewPatient(
  //     SavedPatient patient) async {
  //   await Future.delayed(const Duration(milliseconds: 500));
  //   _savedPatients.add(patient);
  //   return {'success': true, 'message': 'Patient saved.', 'id': patient.id};
  // }


  // ── cards CRUD ─────────────────────────────────────────────────────────────

  /// GET saved cards for the logged-in user.
  /// Real endpoint: GET /api/v1/Payment/GetSavedCards?userId=<userId>
  static Future<List<SavedCard>> fetchSavedCards() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.unmodifiable(_savedCards);
  }

  /// POST /api/v1/Payment/SaveCard
  static Future<Map<String, dynamic>> saveNewCard(SavedCard card) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _savedCards.add(card);
    return {
      'success': true,
      'message': 'Card saved successfully.',
      'id': card.id,
    };
  }

  /// DELETE /api/v1/Payment/DeleteCard/{cardId}
  static Future<Map<String, dynamic>> deleteCard(String cardId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _savedCards.removeWhere((c) => c.id == cardId);
    return {'success': true, 'message': 'Card removed successfully.'};
  }

  // ── insurances CRUD ────────────────────────────────────────────────────────

  /// GET saved insurances for the logged-in user.
  /// Real endpoint: GET /api/v1/Insurance/GetSavedInsurances?userId=<userId>
  static Future<List<SavedInsurance>> fetchSavedInsurances() async {
    await Future.delayed(const Duration(milliseconds: 400));
    return List.unmodifiable(_savedInsurances);
  }

  /// POST /api/v1/Insurance/SaveInsurance
  static Future<Map<String, dynamic>> saveNewInsurance(
      SavedInsurance insurance) async {
    await Future.delayed(const Duration(milliseconds: 500));
    _savedInsurances.add(insurance);
    return {
      'success': true,
      'message': 'Insurance saved successfully.',
      'id': insurance.id,
    };
  }

  /// DELETE /api/v1/Insurance/DeleteInsurance/{insuranceId}
  static Future<Map<String, dynamic>> deleteInsurance(
      String insuranceId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _savedInsurances.removeWhere((i) => i.id == insuranceId);
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
    // fallback
    return [
      {'relationTypeId': 1, 'relationTypeName': 'Self'},
      {'relationTypeId': 2, 'relationTypeName': 'Spouse'},
      {'relationTypeId': 3, 'relationTypeName': 'Child'},
      {'relationTypeId': 4, 'relationTypeName': 'Parent'},
      {'relationTypeId': 5, 'relationTypeName': 'Sibling'},
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
            Uri.parse('$baseUrl/v1/Auth/LoginPatient'),
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
        // Store patient data and auth token globally
        currentPatient = decoded['data'] as Map<String, dynamic>?;
        _authToken = decoded['tokenKey'] as String?;
        debugPrint('=== SESSION: patientId=${currentPatient?['patientId']}  profileId=${currentPatient?['profileId']}  token=${_authToken != null ? "present" : "missing"} ===');
        return {
          'success': true,
          'message': decoded['statusMessage'] as String? ?? 'Login successful',
          'data':    decoded['data'],
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

  static Future<Map<String, dynamic>> sendForgotPasswordOtp({
    required String emailOrPhone,
  }) async {
    await Future.delayed(const Duration(seconds: 1));
    if (emailOrPhone.isNotEmpty) {
      return {'success': true, 'message': 'OTP sent to $emailOrPhone'};
    }
    return {
      'success': false,
      'message': 'Please enter a valid email or phone'
    };
  }

  static Future<Map<String, dynamic>> verifyForgotPasswordOtp(
      {required String otp}) async {
    await Future.delayed(const Duration(seconds: 1));
    if (otp == '1234') {
      return {
        'success':    true,
        'resetToken': 'mock_reset_token_abc',
        'message':    'OTP verified',
      };
    }
    return {'success': false, 'message': 'Invalid OTP. (Hint: use 1234)'};
  }

  static Future<Map<String, dynamic>> resendForgotPasswordOtp(
      {required String emailOrPhone}) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return {'success': true, 'message': 'OTP resent to $emailOrPhone'};
  }

  static Future<Map<String, dynamic>> resetPassword(
      {required String newPassword}) async {
    await Future.delayed(const Duration(seconds: 1));
    return {'success': true, 'message': 'Password reset successfully'};
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
            Uri.parse('$baseUrl/v1/Patient/CreatePatientDetails'),
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
            Uri.parse('$baseUrl/api/v1/Appointment/Patient/GetMyAppointmentList/$patientId'),
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

  /// DELETE /api/v1/Appointment/CancelAppointmentById?appointmentId=&patientId=
  static Future<Map<String, dynamic>> cancelAppointmentById({
    required int appointmentId,
    required int patientId,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl/v1/Appointment/CancelAppointmentById')
          .replace(queryParameters: {
        'appointmentId': appointmentId.toString(),
        'patientId':     patientId.toString(),
      });

      debugPrint('========== CANCEL APPOINTMENT REQUEST ==========');
      debugPrint(uri.toString());
      debugPrint('================================================');

      final response = await http
          .delete(uri, headers: _authHeaders)
          .timeout(const Duration(seconds: 30));

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
            'groupId':    int.tryParse(bookingData['insuranceGroupId']?.toString() ?? '') ?? 0,
            'holderName': bookingData['insurancePrimaryHolderName']    ?? '',
            'address':    bookingData['insurancePrimaryHolderAddress'] ?? '',
          }
        : {
            // insurance not used – send empty/zero values so backend int fields don't fail
            'provider':   null,
            'policy':     null,
            'groupId':    0,     // int field – cannot be null in C# (System.Int32)
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
    // The booking form sends the correct value; 0 is a safe fallback.
    final relatonTypeId = bookingData['relatonTypeId'] as int? ?? 0;

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
      'relatonTypeId':   relatonTypeId,
      'appointmentDate': apptDateIso,
      'timeSlot':        bookingData['time']          ?? '',
      'visitPurpose':    bookingData['visitPurpose']  ?? '',
      'visitType':       bookingData['visitType']     ?? '',
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

  /// POST /api/v1/LabResult/GetLabResultsByPatientProfileId
  ///
  /// Returns all lab results for the logged-in patient across all profiles.
  /// Currently returns mock data; replace body with real HTTP call when ready.
  static Future<List<Map<String, dynamic>>> fetchLabResults() async {
    // Simulate network latency
    await Future.delayed(const Duration(milliseconds: 900));

    // ── Mock data ── mirrors the screenshot exactly ─────────────────────────
    return [
      {
        'resultId':       1,
        'profileId':      1,
        'patientName':    'Ramesh',
        'testName':       'Blood Test',
        'testCode':       'B101',
        'labName':        'Lab Corp',
        'reportDate':     '01 May 2026',
        'resultValue':    'Insufficient',
        'referenceRange': '90-110',
        'resultStatus':   'Normal',
        'notes':          'Fasting sample required.',
      },
      {
        'resultId':       2,
        'profileId':      0,
        'patientName':    'Self',
        'testName':       'Urine Test',
        'testCode':       'B209',
        'labName':        'Lab Corp',
        'reportDate':     '06 May 2026',
        'resultValue':    'Hemolyzed',
        'referenceRange': '5-12',
        'resultStatus':   'Critical',
        'notes':          'Sample may have been compromised.',
      },
      {
        'resultId':       3,
        'profileId':      2,
        'patientName':    'Anita',
        'testName':       'Urine Test',
        'testCode':       'T401',
        'labName':        'Lab Corp',
        'reportDate':     '11 May 2026',
        'resultValue':    'Pending',
        'referenceRange': 'Awaiting',
        'resultStatus':   'Pending',
        'notes':          'Results expected within 24 hours.',
      },
      {
        'resultId':       4,
        'profileId':      1,
        'patientName':    'Ramesh',
        'testName':       'Lipid Panel',
        'testCode':       'L305',
        'labName':        'Quest Diagnostics',
        'reportDate':     '15 May 2026',
        'resultValue':    '185 mg/dL',
        'referenceRange': '<200 mg/dL',
        'resultStatus':   'Normal',
        'notes':          'Total cholesterol within acceptable range.',
      },
      {
        'resultId':       5,
        'profileId':      0,
        'patientName':    'Self',
        'testName':       'HbA1c Test',
        'testCode':       'H508',
        'labName':        'Lab Corp',
        'reportDate':     '18 May 2026',
        'resultValue':    '7.8%',
        'referenceRange': '<5.7%',
        'resultStatus':   'Out of Range',
        'notes':          'Consult physician for diabetes management.',
      },
      {
        'resultId':       6,
        'profileId':      2,
        'patientName':    'Anita',
        'testName':       'Complete Blood Count',
        'testCode':       'C210',
        'labName':        'Quest Diagnostics',
        'reportDate':     '20 May 2026',
        'resultValue':    'Normal',
        'referenceRange': 'See report',
        'resultStatus':   'Normal',
        'notes':          'All parameters within normal limits.',
      },
      {
        'resultId':       7,
        'profileId':      1,
        'patientName':    'Ramesh',
        'testName':       'Thyroid Profile',
        'testCode':       'T702',
        'labName':        'Lab Corp',
        'reportDate':     '22 May 2026',
        'resultValue':    '6.2 mIU/L',
        'referenceRange': '0.5-4.5 mIU/L',
        'resultStatus':   'Critical',
        'notes':          'TSH elevated; follow-up required.',
      },
      {
        'resultId':       8,
        'profileId':      0,
        'patientName':    'Self',
        'testName':       'Liver Function Test',
        'testCode':       'L901',
        'labName':        'SRL Diagnostics',
        'reportDate':     '25 May 2026',
        'resultValue':    'Pending',
        'referenceRange': 'Awaiting',
        'resultStatus':   'Pending',
        'notes':          '',
      },
    ];
  }

  /// GET /api/v1/LabResult/GetLabResultDetailById/{resultId}
  ///
  /// Returns detailed information for a specific lab result.
  /// Currently returns mock data; replace with real HTTP call when ready.
  static Future<Map<String, dynamic>?> fetchLabResultDetail(int resultId) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final all = await fetchLabResults();
    try {
      return all.firstWhere((r) => r['resultId'] == resultId);
    } catch (_) {
      return null;
    }
  }
}
