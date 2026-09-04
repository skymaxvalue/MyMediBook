// lib/models/saved_insurance.dart

class SavedInsurance {
  final String id;
  final String providerName;
  final String policyId;
  final String groupId;
  final String primaryHolderName;
  final String primaryHolderAddress;

  const SavedInsurance({
    required this.id,
    required this.providerName,
    required this.policyId,
    required this.groupId,
    required this.primaryHolderName,
    required this.primaryHolderAddress,
  });

  /// A short display label, e.g. "Star Health  •  POL-12345"
  String get displayLabel => '$providerName  •  $policyId';

  factory SavedInsurance.fromJson(Map<String, dynamic> json) => SavedInsurance(
        id:                   json['id']                   as String,
        providerName:         json['providerName']         as String,
        policyId:             json['policyId']             as String,
        groupId:              json['groupId']              as String,
        primaryHolderName:    json['primaryHolderName']    as String,
        primaryHolderAddress: json['primaryHolderAddress'] as String,
      );

  /// Build from the `insuranceData` block inside GetPatientProfileByProfileId.
  /// [profileId] is used as the stable unique id for deduplication.
  factory SavedInsurance.fromProfileApiJson(
      int profileId, Map<String, dynamic> ins) =>
      SavedInsurance(
        id:                   'PROFILE-INS-$profileId',
        providerName:         ins['provider']   as String? ?? '',
        policyId:             ins['policy']     as String? ?? '',
        groupId:              ins['groupId']    as String? ?? '',
        primaryHolderName:    ins['holderName'] as String? ?? '',
        primaryHolderAddress: ins['address']    as String? ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id':                   id,
        'providerName':         providerName,
        'policyId':             policyId,
        'groupId':              groupId,
        'primaryHolderName':    primaryHolderName,
        'primaryHolderAddress': primaryHolderAddress,
      };
}
