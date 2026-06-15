// TODO Implement this library.
// lib/models/appointment.dart

enum AppointmentStatus { completed, upcoming, cancelled }

class Appointment {
  final String visitPurpose;
  final String patientName;
  final String date;
  final String time;
  final String doctorName;
  final AppointmentStatus status;

  Appointment({
    required this.visitPurpose,
    required this.patientName,
    required this.date,
    required this.time,
    required this.doctorName,
    required this.status,
  });

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
      visitPurpose: json['visitPurpose'] as String,
      patientName:  json['patientName']  as String,
      date:         json['date']          as String,
      time:         json['time']          as String,
      doctorName:   json['doctorName']   as String,
      status: _parseStatus(json['status'] as String),
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