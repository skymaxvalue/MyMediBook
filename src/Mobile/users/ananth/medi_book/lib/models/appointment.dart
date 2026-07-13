// lib/models/appointment.dart

enum AppointmentStatus { completed, upcoming, cancelled }

class Appointment {
  // ── original fields ────────────────────────────────────────────────────────
  final String visitPurpose;
  final String patientName;
  final String date;
  final String time;
  final String doctorName;
  final AppointmentStatus status;

  // ── real API fields (nullable / defaulted for backward compat) ─────────────
  final int    appointmentId;
  final int    profileId;
  final int    associateId;
  final String speciality;
  final String slotStartTime;
  final String slotEndTime;
  final String visitType;
  final String relationTypeName;
  final String createdDate;
  final String appointmentStatus; // raw string from API e.g. "Scheduled"

  Appointment({
    required this.visitPurpose,
    required this.patientName,
    required this.date,
    required this.time,
    required this.doctorName,
    required this.status,
    this.appointmentId   = 0,
    this.profileId       = 0,
    this.associateId     = 0,
    this.speciality      = '',
    this.slotStartTime   = '',
    this.slotEndTime     = '',
    this.visitType       = '',
    this.relationTypeName = '',
    this.createdDate     = '',
    this.appointmentStatus = '',
  });

  /// Parse a date string in MM/dd/yyyy HH:mm:ss format to "Mon dd, yyyy".
  static String _formatApiDate(String raw) {
    try {
      final datePart = raw.split(' ').first;   // "06/26/2026"
      final parts    = datePart.split('/');     // ["06","26","2026"]
      if (parts.length == 3) {
        const months = [
          '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];
        final m = int.parse(parts[0]);
        final d = int.parse(parts[1]);
        final y = parts[2];
        return '${months[m]} $d, $y';
      }
    } catch (_) {}
    return raw;
  }

  /// Build from the real API response of GetMyAppointments.
  factory Appointment.fromApiJson(Map<String, dynamic> json) {
    final start  = json['slotStartTime'] as String? ?? '';
    final end    = json['slotEndTime']   as String? ?? '';
    final time   = (start.isNotEmpty && end.isNotEmpty) ? '$start - $end' : start;
    final status = _parseApiStatus(json['appointmentStatus'] as String? ?? '');

    return Appointment(
      appointmentId:    json['appointmentId']    as int?    ?? 0,
      profileId:        json['profileId']        as int?    ?? 0,
      associateId:      json['associateId']      as int?    ?? 0,
      patientName:      json['patientName']      as String? ?? '',
      doctorName:       json['doctorName']       as String? ?? '',
      speciality:       json['speciality']       as String? ?? '',
      date:             _formatApiDate(json['appointmentDate'] as String? ?? ''),
      slotStartTime:    start,
      slotEndTime:      end,
      time:             time,
      appointmentStatus: json['appointmentStatus'] as String? ?? '',
      status:           status,
      visitPurpose:     json['visitPurpose']     as String? ?? '',
      visitType:        json['visitType']         as String? ?? '',
      relationTypeName: json['relationTypeName'] as String? ?? '',
      createdDate:      json['createdDate']       as String? ?? '',
    );
  }

  static AppointmentStatus _parseApiStatus(String s) {
    switch (s.toLowerCase()) {
      case 'completed':  return AppointmentStatus.completed;
      case 'cancelled':  return AppointmentStatus.cancelled;
      default:           return AppointmentStatus.upcoming;  // "Scheduled" etc.
    }
  }

  // ── legacy fromJson (kept for backward compat with mock data) ──────────────
  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      visitPurpose: json['visitPurpose'] as String? ?? '',
      patientName:  json['patientName']  as String? ?? '',
      date:         json['date']          as String? ?? '',
      time:         json['time']          as String? ?? '',
      doctorName:   json['doctorName']   as String? ?? '',
      status: _parseStatus(json['status'] as String? ?? ''),
    );
  }

  static AppointmentStatus _parseStatus(String s) {
    switch (s) {
      case 'completed':  return AppointmentStatus.completed;
      case 'cancelled':  return AppointmentStatus.cancelled;
      default:           return AppointmentStatus.upcoming;
    }
  }
}
