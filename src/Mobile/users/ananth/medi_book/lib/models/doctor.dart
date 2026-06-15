

class Doctor {
  final int doctorId;
  final String name;
  final String qualification;
  final String department;
  final String visitingHours;
  final String specialty;

  Doctor({
    required this.doctorId,
    required this.name,
    required this.qualification,
    required this.department,
    required this.visitingHours,
    required this.specialty,
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      doctorId: json['doctorId'] as int? ?? 0,
      name:          json['name']          as String,
      qualification: json['qualification'] as String,
      department:    json['department']    as String,
      visitingHours: json['visitingHours'] as String,
      specialty:     json['specialty']     as String,
    );
  }
}