// lib/models/lab_result.dart

/// Represents a single lab-test result record.
class LabResult {
  final int    resultId;
  final int    profileId;       // used to look up relation (Self/Spouse/…)
  final String patientName;
  final String testName;        // e.g. "Blood Test", "Urine Test"
  final String testCode;        // e.g. "B209", "T401"
  final String labName;         // e.g. "Lab Corp"
  final String reportDate;      // e.g. "01 May 2026"
  final String resultValue;     // e.g. "Insufficient", "Hemolyzed", "Pending"
  final String referenceRange;  // e.g. "90-110", "5-12", "Awaiting"
  final String resultStatus;    // "Normal" | "Critical" | "Pending" | "Out of Range"
  final String notes;

  const LabResult({
    required this.resultId,
    this.profileId      = 0,
    required this.patientName,
    required this.testName,
    this.testCode       = '',
    required this.labName,
    required this.reportDate,
    required this.resultValue,
    required this.referenceRange,
    required this.resultStatus,
    this.notes          = '',
  });

  factory LabResult.fromJson(Map<String, dynamic> json) => LabResult(
        resultId:       json['resultId']       as int?    ?? 0,
        profileId:      json['profileId']      as int?    ?? 0,
        patientName:    json['patientName']    as String? ?? '',
        testName:       json['testName']       as String? ?? '',
        testCode:       json['testCode']       as String? ?? '',
        labName:        json['labName']        as String? ?? '',
        reportDate:     json['reportDate']     as String? ?? '',
        resultValue:    json['resultValue']    as String? ?? '',
        referenceRange: json['referenceRange'] as String? ?? '',
        resultStatus:   json['resultStatus']   as String? ?? '',
        notes:          json['notes']          as String? ?? '',
      );
}
