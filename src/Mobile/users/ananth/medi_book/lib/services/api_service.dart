


import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/appointment.dart';
import '../models/doctor.dart';
import '../models/availability.dart';
import '../models/time_slot.dart';
import '../models/saved_patient.dart';

// import '../screens/specialities_tab.dart' show SavedPatient;

class ApiService {
  static const String baseUrl = '';


  static const Map<String, int> securityQuestionIds = {
    'pet': 1,
    'school': 2,
    'city': 3,
    'mother': 4,
    'food': 5,
  };

 
  static const Map<String, String> mockSelfProfile = {
    'firstName':     'Suresh',
    'lastName':      'Kumar',
    'dateOfBirth':   '15/06/1990',
    'age':           '35',
    'ageUnit':       'years',
    'gender':        'Male',
    'address':       '12, MG Road, Kochi, Kerala - 682001',
    'contactNumber': '9876543210',
    'emailAddress':  'suresh.kumar@example.com',
  };


  static final List<SavedPatient> _savedPatients = [
    SavedPatient(
      id: 'PAT-001',
      firstName: 'Priya',
      lastName: 'Kumar',
      dateOfBirth: '20/03/1992',
      age: '33',
      ageUnit: 'years',
      gender: 'Female',
      address: '12, MG Road, Kochi, Kerala - 682001',
      contactNumber: '9876543211',
      emailAddress: 'priya.kumar@example.com',
      relation: 'Spouse',
    ),
    SavedPatient(
      id: 'PAT-002',
      firstName: 'Arjun',
      lastName: 'Kumar',
      dateOfBirth: '10/07/2015',
      age: '10',
      ageUnit: 'years',
      gender: 'Male',
      address: '12, MG Road, Kochi, Kerala - 682001',
      contactNumber: '9876543210',
      emailAddress: '',
      relation: 'Child',
    ),
  ];

  /// GET saved patients for the logged-in user.
  static Future<List<SavedPatient>> fetchSavedPatients() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 400));
  
    // GET /api/v1/Patient/GetSavedPatients?userId=<userId>
    return List.unmodifiable(_savedPatients);
  }

  
  static Future<Map<String, dynamic>> saveNewPatient(SavedPatient patient) async {
    await Future.delayed(const Duration(milliseconds: 500));
  
    // POST /api/v1/Patient/SavePatient  body: patient.toJson()
    _savedPatients.add(patient);
    return {'success': true, 'message': 'Patient saved successfully.', 'id': patient.id};
  }

  /// GET /api/v1/Location/GetCountriesList
  static Future<List<Map<String, dynamic>>> fetchCountries() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/v1/Location/GetCountriesList'),
            headers: {'Accept': 'application/json'},
          )
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
            Uri.parse('$baseUrl/v1/Location/GetStatesByCountryList/$countryId'),
            headers: {'Accept': 'application/json'},
          )
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
            Uri.parse('$baseUrl/v1/Location/GetCitiesByStateList/$stateId'),
            headers: {'Accept': 'application/json'},
          )
          .timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final List data = decoded['data'] ?? [];
        return data.cast<Map<String, dynamic>>();
      }
    } catch (_) {}
    return [];
  }

 
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    await Future.delayed(const Duration(seconds: 1));
    return {
      'success': true,
      'message': 'OTP sent to your registered contact',
      'token': 'mock_token_123456',
      'data': {
        'userId': 1,
        'username': username,
        'name': 'Test User',
        'mobile': '9999999999',
        'email': 'test@example.com',
        'token': 'mock_token_123456',
      },
    };
  }

  
  static Future<Map<String, dynamic>> verifyOtp({required String otp}) async {
    await Future.delayed(const Duration(seconds: 1));
    if (otp == '1234') {
      return {'success': true, 'token': 'mock_jwt_token_123', 'message': 'Verified'};
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
    return {'success': false, 'message': 'Please enter a valid email or phone'};
  }

  static Future<Map<String, dynamic>> verifyForgotPasswordOtp({required String otp}) async {
    await Future.delayed(const Duration(seconds: 1));
    if (otp == '1234') {
      return {'success': true, 'resetToken': 'mock_reset_token_abc', 'message': 'OTP verified'};
    }
    return {'success': false, 'message': 'Invalid OTP. (Hint: use 1234)'};
  }

  static Future<Map<String, dynamic>> resendForgotPasswordOtp({required String emailOrPhone}) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return {'success': true, 'message': 'OTP resent to $emailOrPhone'};
  }

  static Future<Map<String, dynamic>> resetPassword({required String newPassword}) async {
    await Future.delayed(const Duration(seconds: 1));
    return {'success': true, 'message': 'Password reset successfully'};
  }

 

  /// POST /v1/Patient/CreatePatientDetails
  static Future<Map<String, dynamic>> registerPatient({
    required Map<String, dynamic> patientData,
  }) async {
    try {
      final body = {
        'firstName':          patientData['firstName']      ?? '',
        'middleName':         patientData['middleName']     ?? '',
        'lastName':           patientData['lastName']       ?? '',
        'dateOfBirth':        patientData['dob']            ?? DateTime.now().toIso8601String(),
        'phoneNumber':        patientData['phone']          ?? '',
        'email':              patientData['email']          ?? '',
        'gender':             patientData['gender']         ?? '',
        'addressLine1':       patientData['address1']       ?? '',
        'addressLine2':       patientData['address2']       ?? '',
        'cityId':             patientData['cityId']         ?? 0,
        'zipCode':            patientData['zip']            ?? '',
        'stateId':            patientData['stateId']        ?? 0,
        'countryId':          patientData['countryId']      ?? 0,
        'username':           patientData['userId']         ?? '',
        'password':           patientData['password']       ?? '',
        'securityAnswer':     patientData['securityAnswer'] ?? '',
        'securityQuestionId': patientData['securityQuestionId'] ?? 0,
        'isActive':           true,
        'createdBy':          'self',
        'createdDate':        DateTime.now().toIso8601String(),
        'updatedBy':          'self',
        'updatedDate':        DateTime.now().toIso8601String(),
      };

      final response = await http
          .post(
            Uri.parse('$baseUrl/v1/Patient/CreatePatientDetails'),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          return {
            'success': true,
            'message': decoded['message'] ?? 'Registration successful! Please login.',
            'data': decoded,
          };
        } catch (_) {
          return {'success': true, 'message': 'Registration successful! Please login.'};
        }
      } else {
        String errorMsg = 'Registration failed (${response.statusCode})';
        try {
          final decoded = jsonDecode(response.body);
          if (decoded is Map) {
            errorMsg = decoded['message'] as String? ?? decoded['title'] as String? ?? errorMsg;
          }
        } catch (_) {
          if (response.body.isNotEmpty) errorMsg = response.body;
        }
        return {'success': false, 'message': errorMsg};
      }
    } on http.ClientException catch (e) {
      return {'success': false, 'message': 'Network error: ${e.message}'};
    } on TimeoutException {
      return {'success': false, 'message': 'Request timed out. Please try again.'};
    } catch (e) {
      return {'success': false, 'message': 'Unexpected error: $e'};
    }
  }


  static Future<Map<String, dynamic>> signInWithGoogle() async {
    await Future.delayed(const Duration(seconds: 1));
    return {'success': true, 'message': 'Google sign-in not yet configured'};
  }

  
  static Future<List<Appointment>> fetchAppointments() async {
    await Future.delayed(const Duration(milliseconds: 800));
    final raw = [
      {
        'visitPurpose': 'ENT', 'patientName': 'Ramesh',
        'date': 'Apr 25, 2026', 'time': '11:00AM - 11:30AM',
        'doctorName': 'Dr. Vaishali', 'status': 'completed',
      },
      {
        'visitPurpose': 'General', 'patientName': 'Suresh',
        'date': 'May 21, 2026', 'time': '11:00AM - 11:30AM',
        'doctorName': 'Dr. Rajan', 'status': 'upcoming',
      },
      {
        'visitPurpose': 'Cardiology', 'patientName': 'Priya',
        'date': 'Jun 3, 2026', 'time': '09:00AM - 09:30AM',
        'doctorName': 'Dr. Raman', 'status': 'upcoming',
      },
    ];
    return raw.map(Appointment.fromJson).toList();
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  SPECIALITIES / DOCTORS
  // // ══════════════════════════════════════════════════════════════════════════

  // static Future<Map<String, List<Doctor>>> fetchDoctorsBySpecialty() async {
  //   await Future.delayed(const Duration(milliseconds: 800));
  //   final raw = [
  //     {'name': 'Dr. Kumar',   'qualification': 'MBBS',             'department': 'GENERAL', 'visitingHours': '11:00AM - 04:30PM', 'specialty': 'General Physician'},
  //     {'name': 'Dr. Bose',    'qualification': 'INTERNAL MEDICINE', 'department': 'GENERAL', 'visitingHours': '11:00AM - 04:30PM', 'specialty': 'General Physician'},
  //     {'name': 'Dr. Raman',   'qualification': 'Cardiologist',      'department': 'GENERAL', 'visitingHours': '11:00AM - 04:30PM', 'specialty': 'Cardiology'},
  //     {'name': 'Dr. Vaishali','qualification': 'ENT Specialist',    'department': 'ENT',     'visitingHours': '10:00AM - 03:00PM', 'specialty': 'ENT'},
  //     {'name': 'Dr. Menon',   'qualification': 'MS Ortho',          'department': 'ORTHO',   'visitingHours': '09:00AM - 01:00PM', 'specialty': 'Orthopaedics'},
  //   ];
  //   final doctors = raw.map(Doctor.fromJson).toList();
  //   final Map<String, List<Doctor>> grouped = {};
  //   for (final doc in doctors) {
  //     grouped.putIfAbsent(doc.specialty, () => []).add(doc);
  //   }
  //   return grouped;
  // }

  // static Future<List<DoctorAvailability>> fetchDoctorAvailability({required String doctorName}) async {
  //   await Future.delayed(const Duration(milliseconds: 600));
  //   final raw = [
  //     {'date': 'Apr 15, 2026', 'dayName': 'MONDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
  //     {'date': 'Apr 16, 2026', 'dayName': 'TUESDAY',   'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
  //     {'date': 'Apr 17, 2026', 'dayName': 'WEDNESDAY', 'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
  //     {'date': 'Apr 18, 2026', 'dayName': 'THURSDAY',  'timeSlot': '09:00 AM – 05:30 PM', 'status': 'limited'},
  //     {'date': 'Apr 19, 2026', 'dayName': 'FRIDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'unavailable'},
  //     {'date': 'Apr 20, 2026', 'dayName': 'SATURDAY',  'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
  //     {'date': 'Apr 21, 2026', 'dayName': 'SUNDAY',    'timeSlot': '09:00 AM – 05:30 PM', 'status': 'available'},
  //   ];
  //   return raw.map(DoctorAvailability.fromJson).toList();
  // }


  static Future<List<TimeSlot>> fetchTimeSlots({required String doctorName, required String date}) async {
    await Future.delayed(const Duration(milliseconds: 500));
    final bookedIndices = doctorName.contains('Raman')
        ? <int>{0, 3, 7}
        : doctorName.contains('Vaishali')
            ? <int>{2, 5, 9}
            : <int>{3, 6, 10};
    final allTimes = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
      '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    ];
    return List.generate(allTimes.length, (i) => TimeSlot(time: allTimes[i], isBooked: bookedIndices.contains(i)));
  }

/// GET /api/v1/Doctor/GetDoctorList
/// Returns doctors grouped by specialty, matching the existing Map<String, List<Doctor>> shape.
static Future<Map<String, List<Doctor>>> fetchDoctorsBySpecialty() async {
  try {
    final response = await http
        .get(
          Uri.parse('$baseUrl/v1/Doctor/GetDoctorList'),
          headers: {'Accept': 'application/json'},
        )
        .timeout(const Duration(seconds: 15));

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      final List categories = decoded['data'] ?? [];

      final Map<String, List<Doctor>> grouped = {};
      for (final category in categories) {
        final String specialty = category['category'] as String;
        final List doctorList = category['doctors'] ?? [];
        grouped[specialty] = doctorList.map((d) {
          // Combine availableFrom / availableTo into the visitingHours format
          // the rest of the app expects.
          final String hours =
              '${d['availableFrom']} – ${d['availableTo']}';
          return Doctor.fromJson({
            'name':          'Dr. ${(d['name'] as String).replaceFirst('Dr. ', '')}',
            'qualification': d['degree'] ?? '',
            'department':    d['department'] ?? '',
            'visitingHours': hours,
            'specialty':     specialty,
            // Pass through raw fields in case Doctor.fromJson is extended later.
            'doctorId':      d['doctorId'],
            'image':         d['image'],
          });
        }).toList();
      }
      return grouped;
    }
  } catch (e) {
    // Fall through to empty map on any error.
  }
  return {};
}


static Future<List<DoctorAvailability>> fetchDoctorAvailability({
  required String doctorName,
  int? doctorId, // add this param; wire it up from your doctor selection UI
}) async {
  // Fallback to mock if no doctorId is available yet.
  if (doctorId == null) {
    return _mockAvailability();
  }

  try {
    final response = await http
        .get(
          Uri.parse('$baseUrl/v1/Doctor/GetDoctorAvailabilities/$doctorId'),
          headers: {'Accept': 'application/json'},
        )
        .timeout(const Duration(seconds: 15));

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      final List slots = decoded['data'] ?? [];

      // The API returns day-of-week entries (not specific dates).
      // Map them onto the next 7 upcoming dates that match each day name.
      final now = DateTime.now();
      final Map<String, DateTime> nextDate = _nextOccurrences(now);

    //   return slots
    //       .where((s) => s['isAvailable'] == true)
    //       .map((s) {
    //         final String day = (s['dayOfWeek'] as String).toUpperCase();
    //         final DateTime date = nextDate[day] ?? now;
    //         return DoctorAvailability.fromJson({
    //           'date':      _formatDate(date),          // e.g. "Jun 16, 2026"
    //           'dayName':   day,
    //           'timeSlot':  '${_trimSec(s['startTime'])} – ${_trimSec(s['endTime'])}',
    //           'status':    'available',
    //         });
    //       })
    //       .toList();
    // }
    return slots
    .where((s) => s['isAvailable'] == true)
    .map((s) {
      final String day = (s['dayOfWeek'] as String).toUpperCase();
      return DoctorAvailability.fromJson({
        'date':      day,           // use dayOfWeek as-is from API
        'dayName':   day,
        'timeSlot':  '${_trimSec(s['startTime'])} – ${_trimSec(s['endTime'])}',
        'status':    'available',
      });
    })
    .toList();
    }

  } catch (e) {
    // Fall through to mock on error.
  }
  return _mockAvailability();
}


static String _trimSec(String t) =>
    t.length >= 5 ? t.substring(0, 5) : t;


static String _formatDate(DateTime d) {
  const months = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return '${months[d.month]} ${d.day}, ${d.year}';
}


static Map<String, DateTime> _nextOccurrences(DateTime from) {
  const dayNames = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
    'FRIDAY', 'SATURDAY', 'SUNDAY',
  ];
  final map = <String, DateTime>{};
  for (int i = 0; i < 7; i++) {
    final d = from.add(Duration(days: i));
    final name = dayNames[d.weekday - 1]; // DateTime.weekday: 1=Mon … 7=Sun
    map.putIfAbsent(name, () => d);
  }
  return map;
}

/// Keeps the old mock as a fallback (unchanged from before).
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

  /// POST /api/v1/Appointment/BookAppointment  (mock)
  static Future<Map<String, dynamic>> bookAppointment({required Map<String, dynamic> bookingData}) async {
    await Future.delayed(const Duration(seconds: 1));
    final firstName = bookingData['firstName'] as String? ?? '';
    final lastName  = bookingData['lastName']  as String? ?? '';
    final contact   = bookingData['contactNumber'] as String? ?? '';
    if (firstName.isEmpty || lastName.isEmpty || contact.isEmpty) {
      return {'success': false, 'message': 'Please fill all required fields.'};
    }
    final masked = contact.length >= 4
        ? '+91 ••••• ${contact.substring(contact.length - 4)}'
        : '+91 •••• ••••';
    return {
      'success': true,
      'appointmentId': 'APT-${DateTime.now().millisecondsSinceEpoch}',
      'maskedContact': masked,
      'otpChannel': bookingData['otpChannel'] ?? 'mobile',
      'message': 'OTP sent to your registered contact. Please verify to confirm your appointment.',
    };
  }

  /// POST /api/v1/Appointment/VerifyOtp  (mock)
  static Future<Map<String, dynamic>> verifyBookingOtp({required String appointmentId, required String otp}) async {
    await Future.delayed(const Duration(seconds: 1));
    if (otp == '1234') {
      return {'success': true, 'message': 'Appointment verified and confirmed successfully.'};
    }
    return {'success': false, 'message': 'Invalid OTP. Please try again.'};
  }

  /// POST /api/v1/Appointment/ResendOtp  (mock)
  static Future<Map<String, dynamic>> resendBookingOtp({required String appointmentId}) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return {'success': true, 'message': 'OTP resent successfully'};
  }
}

