

class Doctor {
  final int associateId;
  final String name;
  final String qualification;
  final String department;
  final String visitingHours;
  final String specialty;
  final String associateRole;   // e.g. 'Doctor', 'Nurse', etc.

  Doctor({
    required this.associateId,
    required this.name,
    required this.qualification,
    required this.department,
    required this.visitingHours,
    required this.specialty,
    this.associateRole = '',
  });

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      // API field is 'associateId'; fall back to legacy 'doctorId' key just in case
      associateId:   (json['associateId'] ?? json['doctorId']) as int? ?? 0,
      name:          json['name']          as String,
      qualification: json['qualification'] as String,
      department:    json['department']    as String,
      visitingHours: json['visitingHours'] as String,
      specialty:     json['specialty']     as String,
      associateRole: json['associateRole'] as String? ?? json['roleName'] as String? ?? '',
    );
  }
}