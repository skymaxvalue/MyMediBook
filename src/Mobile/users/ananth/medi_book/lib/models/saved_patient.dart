class SavedPatient {
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
 
  factory SavedPatient.fromJson(Map<String, dynamic> json) => SavedPatient(
        id: json['id'] as String,
        firstName: json['firstName'] as String,
        lastName: json['lastName'] as String,
        dateOfBirth: json['dateOfBirth'] as String,
        age: json['age'] as String,
        ageUnit: json['ageUnit'] as String,
        gender: json['gender'] as String,
        address: json['address'] as String,
        contactNumber: json['contactNumber'] as String,
        emailAddress: json['emailAddress'] as String,
        relation: json['relation'] as String,
      );
}