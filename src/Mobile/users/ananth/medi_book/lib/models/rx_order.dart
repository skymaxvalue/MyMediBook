// lib/models/rx_order.dart

class RxOrder {
  final int    orderId;
  final int    patientId;
  final int    profileId;       // used to look up relation (Self/Spouse/…)
  final String patientName;
  final String dateOfBirth;
  final String gender;
  final int    associateId;
  final String doctorName;
  final int    pharmacyId;
  final String pharmacyName;
  final String pharmacistName;
  final String pharmacyMobile;
  final String pharmacyAddress;
  final String drugName;        // was rxName in the old API
  final String dosage;
  final String frequency;
  final int    durationDays;
  final String instructions;
  final String expiryDate;
  final String orderStatus;     // "Active" | "Completed" | "Cancelled" …
  final String cancelReason;
  final String cancelledDate;
  final String createdDate;     // real creation date (replaces the broken orderDate)
  final String updatedDate;

  // kept for backwards compatibility with old code paths
  String get rxName => drugName;

  const RxOrder({
    required this.orderId,
    required this.patientId,
    this.profileId = 0,
    required this.patientName,
    this.dateOfBirth    = '',
    this.gender         = '',
    required this.associateId,
    required this.doctorName,
    required this.pharmacyId,
    required this.pharmacyName,
    this.pharmacistName  = '',
    this.pharmacyMobile  = '',
    this.pharmacyAddress = '',
    required this.drugName,
    required this.dosage,
    required this.frequency,
    required this.durationDays,
    required this.instructions,
    this.expiryDate    = '',
    required this.orderStatus,
    required this.cancelReason,
    this.cancelledDate = '',
    required this.createdDate,
    this.updatedDate   = '',
  });

  factory RxOrder.fromJson(Map<String, dynamic> json) => RxOrder(
        orderId:         json['orderId']         as int?    ?? 0,
        patientId:       json['patientId']        as int?    ?? 0,
        profileId:       json['profileId']        as int?    ?? 0,
        patientName:     json['patientName']      as String? ?? '',
        dateOfBirth:     json['dateOfBirth']      as String? ?? '',
        gender:          json['gender']           as String? ?? '',
        associateId:     json['associateId']      as int?    ?? 0,
        doctorName:      json['doctorName']       as String? ?? '',
        pharmacyId:      json['pharmacyId']       as int?    ?? 0,
        pharmacyName:    json['pharmacyName']     as String? ?? '',
        pharmacistName:  json['pharmacistName']   as String? ?? '',
        pharmacyMobile:  json['pharmacyMobile']   as String? ?? '',
        pharmacyAddress: json['pharmacyAddress']  as String? ?? '',
        // new API uses "drugName"; old used "rxName" — fall back gracefully
        drugName: (json['drugName']  as String?)?.isNotEmpty == true
            ? json['drugName']  as String
            : (json['rxName']   as String?) ?? '',
        dosage:       json['dosage']       as String? ?? '',
        frequency:    json['frequency']    as String? ?? '',
        durationDays: json['durationDays'] as int?    ?? 0,
        instructions: json['instructions'] as String? ?? '',
        expiryDate:   json['expiryDate']   as String? ?? '',
        orderStatus:  json['orderStatus']  as String? ?? '',
        cancelReason: json['cancelReason'] as String? ?? '',
        cancelledDate: json['cancelledDate'] as String? ?? '',
        // prefer createdDate; fall back to old orderDate field
        createdDate: (json['createdDate']  as String?)?.isNotEmpty == true
            ? json['createdDate']  as String
            : (json['orderDate']   as String?) ?? '',
        updatedDate: json['updatedDate'] as String? ?? '',
      );
}
