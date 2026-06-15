// TODO Implement this library.
class DoctorAvailability {
  final String date;
  final String dayName;
  final String timeSlot;
  final String status; // 'available' | 'limited' | 'unavailable'

  const DoctorAvailability({
    required this.date,
    required this.dayName,
    required this.timeSlot,
    required this.status,
  });

  factory DoctorAvailability.fromJson(Map<String, dynamic> json) {
    return DoctorAvailability(
      date:     json['date']     as String,
      dayName:  json['dayName']  as String,
      timeSlot: json['timeSlot'] as String,
      status:   json['status']   as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'date':     date,
    'dayName':  dayName,
    'timeSlot': timeSlot,
    'status':   status,
  };
}