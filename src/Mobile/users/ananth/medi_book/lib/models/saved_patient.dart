class SavedPatient {
  /// profileId from the API (0 means not yet persisted / new patient).
  final int profileId;
  /// relationTypeId from the API (1 = Self, 2 = Spouse, 3 = Child, …).
  final int relationTypeId;
  final String id;
  final String firstName;
  final String lastName;
  final String dateOfBirth;
  final String age;
  final String ageUnit;
  final String gender;
  final String address;
  final String contactNumber;
  final String emailAddress;
  final String relation; // e.g. "Self", "Spouse", "Child", "Parent", "Other"

  const SavedPatient({
    this.profileId = 0,
    this.relationTypeId = 0,
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.dateOfBirth,
    required this.age,
    required this.ageUnit,
    required this.gender,
    required this.address,
    required this.contactNumber,
    required this.emailAddress,
    required this.relation,
  });

  String get fullName => '$firstName $lastName'.trim();

  Map<String, dynamic> toJson() => {
        'profileId': profileId,
        'relationTypeId': relationTypeId,
        'id': id,
        'firstName': firstName,
        'lastName': lastName,
        'dateOfBirth': dateOfBirth,
        'age': age,
        'ageUnit': ageUnit,
        'gender': gender,
        'address': address,
        'contactNumber': contactNumber,
        'emailAddress': emailAddress,
        'relation': relation,
      };

  /// Build from the API shape returned by GetPatientProfileListById.
  factory SavedPatient.fromApiJson(Map<String, dynamic> json) {
    // Convert dateOfBirth "MM/dd/yyyy HH:mm:ss" → "dd/MM/yyyy"
    String dob = '';
    try {
      final raw = json['dateOfBirth'] as String? ?? '';
      if (raw.isNotEmpty) {
        final datePart = raw.split(' ').first; // e.g. "01/24/2000"
        final parts = datePart.split('/');
        if (parts.length == 3) {
          dob = '${parts[1]}/${parts[0]}/${parts[2]}'; // dd/MM/yyyy
        }
      }
    } catch (_) {}

    return SavedPatient(
      profileId:      json['profileId']      as int? ?? 0,
      relationTypeId: json['relationTypeId'] as int? ?? 0,
      id:             (json['profileId'] ?? 0).toString(),
      firstName:      json['firstName']     as String? ?? '',
      lastName:       json['lastName']      as String? ?? '',
      dateOfBirth:    dob,
      age:            (json['age'] ?? 0).toString(),
      ageUnit:        json['ageTypeName']   as String? ?? 'Years',
      gender:         json['gender']        as String? ?? '',
      address:        '',
      contactNumber:  json['phoneNumber']   as String? ?? '',
      emailAddress:   json['email']         as String? ?? '',
      relation:       json['relationTypeName'] as String? ?? '',
    );
  }

  /// Legacy fromJson — still used by old commented-out mock data.
  factory SavedPatient.fromJson(Map<String, dynamic> json) => SavedPatient(
        id:            json['id']            as String? ?? '',
        firstName:     json['firstName']     as String? ?? '',
        lastName:      json['lastName']      as String? ?? '',
        dateOfBirth:   json['dateOfBirth']   as String? ?? '',
        age:           json['age']           as String? ?? '',
        ageUnit:       json['ageUnit']       as String? ?? 'Years',
        gender:        json['gender']        as String? ?? '',
        address:       json['address']       as String? ?? '',
        contactNumber: json['contactNumber'] as String? ?? '',
        emailAddress:  json['emailAddress']  as String? ?? '',
        relation:      json['relation']      as String? ?? '',
      );
}