// lib/models/bill.dart
//
// Matches the shape returned by:
//   GET /api/v1/Billing/GetBillingListByPatientId/{patientId}
//   GET /api/v1/Billing/GetBillByClaimId/{id}
//
// The API returns a list of billing-record objects, each containing:
//   claims[], lineItems[], insurancePayments[], adjustments[], patientResponsibility[]
// We flatten / aggregate this into a single Bill for list-view display, while
// preserving all raw arrays for the detail view.

// ─────────────────────────────────────────────────────────────────────────────
// Sub-models
// ─────────────────────────────────────────────────────────────────────────────

class BillClaim {
  final int    claimId;
  final int    appointmentId;
  final int    profileId;
  final String currencyCode;
  final String dateOfService;
  final String claimDate;
  final double totalChargeAmount;
  final double totalAllowedAmount;
  final double totalPaidAmount;
  final double totalAdjustmentAmount;
  final double totalPatientResponsibility;
  final double remainingBalance;
  final String claimStatus; // "Submitted" | "Paid" | "Denied" | "Closed"

  const BillClaim({
    required this.claimId,
    required this.appointmentId,
    required this.profileId,
    required this.currencyCode,
    required this.dateOfService,
    required this.claimDate,
    required this.totalChargeAmount,
    required this.totalAllowedAmount,
    required this.totalPaidAmount,
    required this.totalAdjustmentAmount,
    required this.totalPatientResponsibility,
    required this.remainingBalance,
    required this.claimStatus,
  });

  factory BillClaim.fromJson(Map<String, dynamic> j) => BillClaim(
        claimId:                    (j['claimId']                    as num?)?.toInt()    ?? 0,
        appointmentId:              (j['appointmentId']              as num?)?.toInt()    ?? 0,
        profileId:                  (j['profileId']                  as num?)?.toInt()    ?? 0,
        currencyCode:               j['currencyCode']                as String? ?? 'INR',
        dateOfService:              j['dateOfService']               as String? ?? '',
        claimDate:                  j['claimDate']                   as String? ?? '',
        totalChargeAmount:          (j['totalChargeAmount']          as num?)?.toDouble() ?? 0,
        totalAllowedAmount:         (j['totalAllowedAmount']         as num?)?.toDouble() ?? 0,
        totalPaidAmount:            (j['totalPaidAmount']            as num?)?.toDouble() ?? 0,
        totalAdjustmentAmount:      (j['totalAdjustmentAmount']      as num?)?.toDouble() ?? 0,
        totalPatientResponsibility: (j['totalPatientResponsibility'] as num?)?.toDouble() ?? 0,
        remainingBalance:           (j['remainingBalance']           as num?)?.toDouble() ?? 0,
        claimStatus:                j['claimStatus']                 as String? ?? '',
      );
}

class BillLineItem {
  final int    lineItemId;
  final int    claimId;
  final String serviceCategory;
  final String cptCode;
  final String serviceDescription;
  final int    units;
  final double chargeAmount;
  final double allowedAmount;
  final double paidAmount;

  const BillLineItem({
    required this.lineItemId,
    required this.claimId,
    required this.serviceCategory,
    required this.cptCode,
    required this.serviceDescription,
    required this.units,
    required this.chargeAmount,
    required this.allowedAmount,
    required this.paidAmount,
  });

  factory BillLineItem.fromJson(Map<String, dynamic> j) => BillLineItem(
        lineItemId:          (j['lineItemId']          as num?)?.toInt()    ?? 0,
        claimId:             (j['claimId']             as num?)?.toInt()    ?? 0,
        serviceCategory:     j['serviceCategory']      as String? ?? '',
        cptCode:             j['cptCode']              as String? ?? '',
        serviceDescription:  j['serviceDescription']   as String? ?? '',
        units:               (j['units']               as num?)?.toInt()    ?? 1,
        chargeAmount:        (j['chargeAmount']        as num?)?.toDouble() ?? 0,
        allowedAmount:       (j['allowedAmount']       as num?)?.toDouble() ?? 0,
        paidAmount:          (j['paidAmount']          as num?)?.toDouble() ?? 0,
      );
}

class InsurancePayment {
  final int    paymentId;
  final int    claimId;
  final String paymentReference;
  final double paidAmount;
  final String paymentDate;

  const InsurancePayment({
    required this.paymentId,
    required this.claimId,
    required this.paymentReference,
    required this.paidAmount,
    required this.paymentDate,
  });

  factory InsurancePayment.fromJson(Map<String, dynamic> j) => InsurancePayment(
        paymentId:        (j['paymentId']        as num?)?.toInt()    ?? 0,
        claimId:          (j['claimId']          as num?)?.toInt()    ?? 0,
        paymentReference: j['paymentReference']  as String? ?? '',
        paidAmount:       (j['paidAmount']       as num?)?.toDouble() ?? 0,
        paymentDate:      j['paymentDate']       as String? ?? '',
      );
}

class BillAdjustment {
  final int    adjustmentId;
  final int    claimId;
  final String adjustmentCode;
  final String adjustmentDescription;
  final double adjustmentAmount;

  const BillAdjustment({
    required this.adjustmentId,
    required this.claimId,
    required this.adjustmentCode,
    required this.adjustmentDescription,
    required this.adjustmentAmount,
  });

  factory BillAdjustment.fromJson(Map<String, dynamic> j) => BillAdjustment(
        adjustmentId:          (j['adjustmentId']          as num?)?.toInt()    ?? 0,
        claimId:               (j['claimId']               as num?)?.toInt()    ?? 0,
        adjustmentCode:        j['adjustmentCode']         as String? ?? '',
        adjustmentDescription: j['adjustmentDescription']  as String? ?? '',
        adjustmentAmount:      (j['adjustmentAmount']      as num?)?.toDouble() ?? 0,
      );
}

class PatientResponsibility {
  final int    responsibilityId;
  final int    claimId;
  final String type;  // "Copay" | "Deductible" | "Coinsurance" | "Self Pay"
  final double amount;

  const PatientResponsibility({
    required this.responsibilityId,
    required this.claimId,
    required this.type,
    required this.amount,
  });

  factory PatientResponsibility.fromJson(Map<String, dynamic> j) =>
      PatientResponsibility(
        responsibilityId: (j['responsibilityId'] as num?)?.toInt()    ?? 0,
        claimId:          (j['claimId']          as num?)?.toInt()    ?? 0,
        type:             j['type']              as String? ?? '',
        amount:           (j['amount']           as num?)?.toDouble() ?? 0,
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bill — top-level model
// ─────────────────────────────────────────────────────────────────────────────

class Bill {
  // ── aggregated / display fields (derived from first claim in the list) ──────
  final int    billId;         // claimId of the primary claim
  final String patientName;    // resolved from profile name where available
  final String doctorName;     // not in API, kept blank for compatibility
  final String clinicName;     // not in API, kept blank for compatibility
  final String visitDate;      // dateOfService (formatted)
  final String orderDate;      // claimDate (formatted)
  final String paymentDate;    // first insurancePayment date, if any
  final double totalCharge;
  final double insuranceCovered;
  final double adjustments;
  final double patientResponsibility;
  final double remainingBalance;
  final String status;         // claimStatus mapped to 'Paid' | 'Pending' | 'Denied' | 'Closed'
  final String currencyCode;

  // ── raw detail arrays (used in the detail view) ───────────────────────────
  final List<BillClaim>             claims;
  final List<BillLineItem>          lineItems;
  final List<InsurancePayment>      insurancePayments;
  final List<BillAdjustment>        adjustmentList;
  final List<PatientResponsibility> responsibilityList;

  const Bill({
    required this.billId,
    required this.patientName,
    required this.doctorName,
    required this.clinicName,
    required this.visitDate,
    required this.orderDate,
    required this.paymentDate,
    required this.totalCharge,
    required this.insuranceCovered,
    required this.adjustments,
    required this.patientResponsibility,
    required this.remainingBalance,
    required this.status,
    this.currencyCode = 'INR',
    this.claims             = const [],
    this.lineItems          = const [],
    this.insurancePayments  = const [],
    this.adjustmentList     = const [],
    this.responsibilityList = const [],
  });

  // ── Parses one element of the `data[]` array from GetBillingListByPatientId ─
  factory Bill.fromApiJson(Map<String, dynamic> j) {
    final rawClaims  = (j['claims']  as List? ?? []).cast<Map<String, dynamic>>();
    final rawItems   = (j['lineItems'] as List? ?? []).cast<Map<String, dynamic>>();
    final rawPays    = (j['insurancePayments'] as List? ?? []).cast<Map<String, dynamic>>();
    final rawAdjs    = (j['adjustments'] as List? ?? []).cast<Map<String, dynamic>>();
    final rawResps   = (j['patientResponsibility'] as List? ?? []).cast<Map<String, dynamic>>();

    final claims  = rawClaims.map(BillClaim.fromJson).toList();
    final items   = rawItems.map(BillLineItem.fromJson).toList();
    final pays    = rawPays.map(InsurancePayment.fromJson).toList();
    final adjs    = rawAdjs.map(BillAdjustment.fromJson).toList();
    final resps   = rawResps.map(PatientResponsibility.fromJson).toList();

    final primary = claims.isNotEmpty ? claims.first : null;

    // Status mapping: API → display
    final rawStatus = primary?.claimStatus ?? '';
    String status;
    switch (rawStatus.toLowerCase()) {
      case 'paid':
        status = 'Paid';
        break;
      case 'denied':
        status = 'Denied';
        break;
      case 'closed':
        status = 'Closed';
        break;
      default:
        // "Submitted" → Pending if balance > 0, else treat as Paid
        status = (primary?.remainingBalance ?? 0) > 0 ? 'Overdue' : 'Pending';
    }

    // Format ISO date to "dd MMM yyyy"
    String _fmt(String? iso) {
      if (iso == null || iso.isEmpty) return '';
      try {
        final dt = DateTime.parse(iso);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return '${dt.day.toString().padLeft(2,'0')} ${months[dt.month-1]} ${dt.year}';
      } catch (_) { return iso; }
    }

    final firstPayDate = pays.isNotEmpty ? pays.first.paymentDate : '';

    return Bill(
      billId:                (primary?.claimId ?? 0),
      patientName:           '',   // not provided by API; resolved in UI if needed
      doctorName:            '',   // not provided by API
      clinicName:            '',   // not provided by API
      visitDate:             _fmt(primary?.dateOfService),
      orderDate:             _fmt(primary?.claimDate),
      paymentDate:           _fmt(firstPayDate),
      totalCharge:           primary?.totalChargeAmount          ?? 0,
      insuranceCovered:      primary?.totalPaidAmount            ?? 0,
      adjustments:           primary?.totalAdjustmentAmount      ?? 0,
      patientResponsibility: primary?.totalPatientResponsibility ?? 0,
      remainingBalance:      primary?.remainingBalance           ?? 0,
      status:                status,
      currencyCode:          primary?.currencyCode ?? 'INR',
      claims:                claims,
      lineItems:             items,
      insurancePayments:     pays,
      adjustmentList:        adjs,
      responsibilityList:    resps,
    );
  }

  // ── Legacy fromJson — MOCK only, kept commented for reference ─────────────
  // factory Bill.fromJson(Map<String, dynamic> j) => Bill(
  //       billId:               (j['billId']               as num?)?.toInt()    ?? 0,
  //       patientName:          j['patientName']            as String? ?? '',
  //       doctorName:           j['doctorName']             as String? ?? '',
  //       clinicName:           j['clinicName']             as String? ?? '',
  //       visitDate:            j['visitDate']              as String? ?? '',
  //       orderDate:            j['orderDate']              as String? ?? '',
  //       paymentDate:          j['paymentDate']            as String? ?? '',
  //       totalCharge:          (j['totalCharge']           as num?)?.toDouble() ?? 0,
  //       insuranceCovered:     (j['insuranceCovered']      as num?)?.toDouble() ?? 0,
  //       adjustments:          (j['adjustments']           as num?)?.toDouble() ?? 0,
  //       patientResponsibility:(j['patientResponsibility'] as num?)?.toDouble() ?? 0,
  //       remainingBalance:     (j['remainingBalance']      as num?)?.toDouble() ?? 0,
  //       status:               j['status']                 as String? ?? 'Pending',
  //     );
}
