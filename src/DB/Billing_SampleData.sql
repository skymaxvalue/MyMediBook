/* ============================================================
   BILLING MODULE - ADDITIONAL REALISTIC SAMPLE DATA
   Purpose:
   Add realistic billing scenarios for frontend/UI testing.

   Existing AppointmentMaster records used:
   2192, 2191, 2190, 2189, 2188,
   2187, 2186, 2185, 2184, 2183

   Note:
   ClaimStatus uses 'Submitted' because this value is already
   confirmed to exist in the current database.
   ============================================================ */


/* ============================================================
   SCENARIO 1
   OP Consultation + Lab
   Insurance covers majority of the amount.
   Patient has a small copay.
   ============================================================ */

DECLARE @ClaimId1 INT;
DECLARE @LineItemId1 INT;
DECLARE @LineItemId2 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2192,
    37,
    1104,
    1,
    'Star Health Insurance',
    'INR',
    DATEADD(DAY, -10, GETDATE()),
    DATEADD(DAY, -9, GETDATE()),
    2500.00,
    2200.00,
    1800.00,
    300.00,
    400.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId1 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    2192,
    'Consultation',
    'CONS011',
    'General Physician Consultation',
    1,
    1000.00,
    900.00,
    750.00,
    GETDATE()
);

SET @LineItemId1 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId1,
    2192,
    1,
    'New Visit',
    'General consultation and initial clinical assessment'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    2192,
    'Lab',
    'LAB011',
    'Complete Blood Count',
    1,
    1500.00,
    1300.00,
    1050.00,
    GETDATE()
);

SET @LineItemId2 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId2,
    2192,
    'LAB011',
    'Complete Blood Count',
    'Within Normal Limits',
    'mg/dL',
    'Normal Range',
    DATEADD(DAY, -10, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    2192,
    @LineItemId1,
    'ADJ011',
    'Contractual adjustment',
    100.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    @LineItemId1,
    'Copay',
    200.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    2192,
    'PAY-20001',
    1800.00,
    DATEADD(DAY, -3, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId,
    PatientId,
    CopayAmount,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    2192,
    37,
    200.00,
    'UPI',
    DATEADD(DAY, -3, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId1,
    2192,
    37,
    200.00,
    'UPI',
    DATEADD(DAY, -3, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 2
   Consultation + Pharmacy
   ============================================================ */

DECLARE @ClaimId2 INT;
DECLARE @LineItemId3 INT;
DECLARE @LineItemId4 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2191,
    26,
    1083,
    1,
    'HDFC ERGO Health Insurance',
    'INR',
    DATEADD(DAY, -8, GETDATE()),
    DATEADD(DAY, -7, GETDATE()),
    4200.00,
    3700.00,
    2800.00,
    500.00,
    900.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId2 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId2,
    2191,
    'Consultation',
    'CONS012',
    'Specialist Consultation',
    1,
    1500.00,
    1300.00,
    1000.00,
    GETDATE()
);

SET @LineItemId3 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId3,
    2191,
    1,
    'Follow-up',
    'Follow-up consultation and medication review'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId2,
    2191,
    'Pharmacy',
    'MED011',
    'Antibiotics and prescribed medicines',
    5,
    2700.00,
    2400.00,
    1800.00,
    GETDATE()
);

SET @LineItemId4 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId4,
    2191,
    'Amoxicillin 500mg',
    15,
    '1 capsule three times daily'
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId2,
    @LineItemId4,
    'Deductible',
    500.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId2,
    2191,
    'PAY-20002',
    2800.00,
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId2,
    2191,
    26,
    500.00,
    'Card',
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 3
   Emergency Consultation + Scan
   Higher-value emergency service.
   ============================================================ */

DECLARE @ClaimId3 INT;
DECLARE @LineItemId5 INT;
DECLARE @LineItemId6 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2190,
    29,
    1086,
    1,
    'Bajaj Allianz Health Insurance',
    'INR',
    DATEADD(DAY, -6, GETDATE()),
    DATEADD(DAY, -5, GETDATE()),
    7500.00,
    6700.00,
    5200.00,
    800.00,
    1500.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId3 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId3,
    2190,
    'Consultation',
    'CONS013',
    'Emergency Physician Consultation',
    1,
    2000.00,
    1800.00,
    1400.00,
    GETDATE()
);

SET @LineItemId5 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId5,
    2190,
    1,
    'Emergency',
    'Emergency assessment for acute symptoms'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId3,
    2190,
    'Scan',
    'SCAN011',
    'CT Scan - Abdomen',
    1,
    5500.00,
    4900.00,
    3800.00,
    GETDATE()
);

SET @LineItemId6 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId,
    AppointmentId,
    ScanType,
    BodyPart,
    ScanResultSummary,
    PerformedDate
)
VALUES
(
    @LineItemId6,
    2190,
    'CT Scan',
    'Abdomen',
    'No acute abnormality identified',
    DATEADD(DAY, -6, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId3,
    2190,
    @LineItemId6,
    'ADJ012',
    'Insurance negotiated rate adjustment',
    600.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId3,
    @LineItemId6,
    'Copay',
    1000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId3,
    2190,
    'PAY-20003',
    5200.00,
    DATEADD(DAY, -1, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId,
    PatientId,
    CopayAmount,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    2190,
    29,
    1000.00,
    'Cash',
    DATEADD(DAY, -1, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 4
   Surgery + ICU
   High-value inpatient claim.
   ============================================================ */

DECLARE @ClaimId4 INT;
DECLARE @LineItemId7 INT;
DECLARE @LineItemId8 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2189,
    29,
    1099,
    1,
    'Care Health Insurance',
    'INR',
    DATEADD(DAY, -20, GETDATE()),
    DATEADD(DAY, -18, GETDATE()),
    45000.00,
    40000.00,
    32000.00,
    5000.00,
    8000.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId4 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    2189,
    'Surgery',
    'SURG011',
    'Laparoscopic Surgical Procedure',
    1,
    35000.00,
    31000.00,
    25000.00,
    GETDATE()
);

SET @LineItemId7 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId,
    AppointmentId,
    SurgeonId,
    SurgeryType,
    DurationMinutes,
    SurgeryDate
)
VALUES
(
    @LineItemId7,
    2189,
    1,
    'Laparoscopic Surgery',
    150,
    DATEADD(DAY, -20, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    2189,
    'ICU',
    'ICU011',
    'Post-operative ICU Care',
    4,
    10000.00,
    9000.00,
    7000.00,
    GETDATE()
);

SET @LineItemId8 = SCOPE_IDENTITY();

INSERT INTO dbo.ICUDetail
(
    LineItemId,
    AppointmentId,
    ICUType,
    Hours,
    StartTime,
    EndTime
)
VALUES
(
    @LineItemId8,
    2189,
    'Surgical ICU',
    24,
    DATEADD(HOUR, -48, GETDATE()),
    DATEADD(HOUR, -24, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    2189,
    @LineItemId7,
    'ADJ013',
    'Surgical package adjustment',
    4000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    @LineItemId7,
    'Deductible',
    5000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    2189,
    'PAY-20004',
    32000.00,
    DATEADD(DAY, -5, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId4,
    2189,
    29,
    5000.00,
    'Bank Transfer',
    DATEADD(DAY, -5, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 5
   Inpatient Nursing + Bed Charge
   ============================================================ */

DECLARE @ClaimId5 INT;
DECLARE @LineItemId9 INT;
DECLARE @LineItemId10 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2188,
    26,
    1098,
    1,
    'Niva Bupa Health Insurance',
    'INR',
    DATEADD(DAY, -15, GETDATE()),
    DATEADD(DAY, -13, GETDATE()),
    12000.00,
    10500.00,
    8000.00,
    1500.00,
    2500.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId5 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId5,
    2188,
    'Nursing',
    'NURS011',
    'Inpatient Nursing Care',
    12,
    6000.00,
    5200.00,
    4000.00,
    GETDATE()
);

SET @LineItemId9 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId,
    AppointmentId,
    Hours,
    NurseId
)
VALUES
(
    @LineItemId9,
    2188,
    12,
    1
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId5,
    2188,
    'Bed',
    'BED011',
    'General Ward Bed Charge',
    3,
    6000.00,
    5300.00,
    4000.00,
    GETDATE()
);

SET @LineItemId10 = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId,
    AppointmentId,
    RoomType,
    Days,
    StartDate,
    EndDate
)
VALUES
(
    @LineItemId10,
    2188,
    'General Ward',
    3,
    DATEADD(DAY, -15, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -12, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId5,
    2188,
    @LineItemId10,
    'ADJ014',
    'Room rate adjustment',
    700.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId5,
    @LineItemId10,
    'Copay',
    1500.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId5,
    2188,
    'PAY-20005',
    8000.00,
    DATEADD(DAY, -4, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId,
    PatientId,
    CopayAmount,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    2188,
    26,
    1500.00,
    'Card',
    DATEADD(DAY, -4, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 6
   Lab + Pharmacy
   Multiple units of medicines.
   ============================================================ */

DECLARE @ClaimId6 INT;
DECLARE @LineItemId11 INT;
DECLARE @LineItemId12 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2187,
    26,
    1097,
    1,
    'ICICI Lombard Health Insurance',
    'INR',
    DATEADD(DAY, -5, GETDATE()),
    DATEADD(DAY, -4, GETDATE()),
    4800.00,
    4200.00,
    3300.00,
    600.00,
    900.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId6 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    2187,
    'Lab',
    'LAB012',
    'Liver Function Test',
    1,
    1800.00,
    1600.00,
    1300.00,
    GETDATE()
);

SET @LineItemId11 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId11,
    2187,
    'LAB012',
    'Liver Function Test',
    'Normal',
    'U/L',
    '10-40 U/L',
    DATEADD(DAY, -5, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    2187,
    'Pharmacy',
    'MED012',
    'Pain Relief Medication',
    10,
    3000.00,
    2600.00,
    2000.00,
    GETDATE()
);

SET @LineItemId12 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId12,
    2187,
    'Ibuprofen 400mg',
    20,
    '1 tablet after food twice daily'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    2187,
    @LineItemId12,
    'ADJ015',
    'Pharmacy contractual adjustment',
    400.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    @LineItemId12,
    'Copay',
    900.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    2187,
    'PAY-20006',
    3300.00,
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId6,
    2187,
    26,
    900.00,
    'UPI',
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 7
   Orthopedic Consultation + X-Ray + Consumables
   ============================================================ */

DECLARE @ClaimId7 INT;
DECLARE @LineItemId13 INT;
DECLARE @LineItemId14 INT;
DECLARE @LineItemId15 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2186,
    26,
    1096,
    1,
    'Aditya Birla Health Insurance',
    'INR',
    DATEADD(DAY, -7, GETDATE()),
    DATEADD(DAY, -6, GETDATE()),
    6200.00,
    5500.00,
    4200.00,
    700.00,
    1300.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId7 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    2186,
    'Consultation',
    'CONS014',
    'Orthopedic Consultation',
    1,
    1800.00,
    1600.00,
    1200.00,
    GETDATE()
);

SET @LineItemId13 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId13,
    2186,
    1,
    'New Visit',
    'Orthopedic assessment for joint pain'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    2186,
    'Scan',
    'SCAN012',
    'X-Ray Examination',
    2,
    3200.00,
    2800.00,
    2200.00,
    GETDATE()
);

SET @LineItemId14 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId,
    AppointmentId,
    ScanType,
    BodyPart,
    ScanResultSummary,
    PerformedDate
)
VALUES
(
    @LineItemId14,
    2186,
    'X-Ray',
    'Knee',
    'No fracture identified',
    DATEADD(DAY, -7, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    2186,
    'Consumable',
    'CON011',
    'Medical Dressing Materials',
    4,
    1200.00,
    1100.00,
    800.00,
    GETDATE()
);

SET @LineItemId15 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsumableDetail
(
    LineItemId,
    AppointmentId,
    ItemName,
    Quantity
)
VALUES
(
    @LineItemId15,
    2186,
    'Sterile Dressing Kit',
    4
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    2186,
    @LineItemId14,
    'ADJ016',
    'Radiology negotiated adjustment',
    400.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    @LineItemId13,
    'Copay',
    1300.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId7,
    2186,
    'PAY-20007',
    4200.00,
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId,
    PatientId,
    CopayAmount,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    2186,
    26,
    1300.00,
    'Cash',
    DATEADD(DAY, -2, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 8
   Surgery + Nursing + Pharmacy
   ============================================================ */

DECLARE @ClaimId8 INT;
DECLARE @LineItemId16 INT;
DECLARE @LineItemId17 INT;
DECLARE @LineItemId18 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2185,
    26,
    1095,
    1,
    'United India Insurance',
    'INR',
    DATEADD(DAY, -25, GETDATE()),
    DATEADD(DAY, -23, GETDATE()),
    28500.00,
    25000.00,
    19000.00,
    3500.00,
    6000.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId8 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    'Surgery',
    'SURG012',
    'Minor Surgical Procedure',
    1,
    18000.00,
    16000.00,
    12500.00,
    GETDATE()
);

SET @LineItemId16 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId,
    AppointmentId,
    SurgeonId,
    SurgeryType,
    DurationMinutes,
    SurgeryDate
)
VALUES
(
    @LineItemId16,
    2185,
    1,
    'Minor Surgical Procedure',
    90,
    DATEADD(DAY, -25, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    'Nursing',
    'NURS012',
    'Post-operative Nursing Care',
    8,
    4500.00,
    4000.00,
    3000.00,
    GETDATE()
);

SET @LineItemId17 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId,
    AppointmentId,
    Hours,
    NurseId
)
VALUES
(
    @LineItemId17,
    2185,
    8,
    1
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    'Pharmacy',
    'MED013',
    'Post-operative Medicines',
    6,
    6000.00,
    5000.00,
    3500.00,
    GETDATE()
);

SET @LineItemId18 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId18,
    2185,
    'Post-operative Medication Pack',
    12,
    'As prescribed by surgeon'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    @LineItemId16,
    'ADJ017',
    'Surgical package discount',
    2000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    @LineItemId18,
    'Deductible',
    6000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    'PAY-20008',
    19000.00,
    DATEADD(DAY, -8, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId8,
    2185,
    26,
    6000.00,
    'Card',
    DATEADD(DAY, -8, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 9
   Consultation + Lab + Pharmacy
   Lower-value outpatient claim.
   ============================================================ */

DECLARE @ClaimId9 INT;
DECLARE @LineItemId19 INT;
DECLARE @LineItemId20 INT;
DECLARE @LineItemId21 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2184,
    26,
    1094,
    1,
    'ManipalCigna Health Insurance',
    'INR',
    DATEADD(DAY, -4, GETDATE()),
    DATEADD(DAY, -3, GETDATE()),
    5600.00,
    5000.00,
    3900.00,
    600.00,
    1100.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId9 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId9,
    2184,
    'Consultation',
    'CONS015',
    'General Medical Consultation',
    1,
    1000.00,
    900.00,
    700.00,
    GETDATE()
);

SET @LineItemId19 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId19,
    2184,
    1,
    'Follow-up',
    'Follow-up consultation for ongoing treatment'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId9,
    2184,
    'Lab',
    'LAB013',
    'Blood Glucose Test',
    2,
    1200.00,
    1000.00,
    800.00,
    GETDATE()
);

SET @LineItemId20 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId20,
    2184,
    'LAB013',
    'Blood Glucose Test',
    '98',
    'mg/dL',
    '70-110 mg/dL',
    DATEADD(DAY, -4, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId9,
    2184,
    'Pharmacy',
    'MED014',
    'Diabetes Maintenance Medicines',
    2,
    3400.00,
    3100.00,
    2400.00,
    GETDATE()
);

SET @LineItemId21 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId21,
    2184,
    'Metformin 500mg',
    30,
    '1 tablet twice daily'
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId9,
    @LineItemId21,
    'Copay',
    1100.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId9,
    2184,
    'PAY-20009',
    3900.00,
    DATEADD(DAY, -1, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId,
    PatientId,
    CopayAmount,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    2184,
    26,
    1100.00,
    'UPI',
    DATEADD(DAY, -1, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 10
   Consultation + ICU
   High-value critical-care scenario.
   ============================================================ */

DECLARE @ClaimId10 INT;
DECLARE @LineItemId22 INT;
DECLARE @LineItemId23 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2183,
    26,
    1093,
    1,
    'Tata AIG Health Insurance',
    'INR',
    DATEADD(DAY, -30, GETDATE()),
    DATEADD(DAY, -28, GETDATE()),
    52000.00,
    46000.00,
    36000.00,
    6000.00,
    10000.00,
    'Submitted',
    GETDATE()
);

SET @ClaimId10 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    2183,
    'Consultation',
    'CONS016',
    'Critical Care Specialist Consultation',
    2,
    4000.00,
    3600.00,
    2800.00,
    GETDATE()
);

SET @LineItemId22 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId22,
    2183,
    1,
    'Emergency',
    'Critical care assessment and treatment planning'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    2183,
    'ICU',
    'ICU012',
    'Critical Care ICU Stay',
    48,
    48000.00,
    42400.00,
    33200.00,
    GETDATE()
);

SET @LineItemId23 = SCOPE_IDENTITY();

INSERT INTO dbo.ICUDetail
(
    LineItemId,
    AppointmentId,
    ICUType,
    Hours,
    StartTime,
    EndTime
)
VALUES
(
    @LineItemId23,
    2183,
    'Critical Care ICU',
    48,
    DATEADD(HOUR, -72, GETDATE()),
    DATEADD(HOUR, -24, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    2183,
    @LineItemId23,
    'ADJ018',
    'ICU package and contractual adjustment',
    5600.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    @LineItemId23,
    'Deductible',
    10000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    2183,
    'PAY-20010',
    36000.00,
    DATEADD(DAY, -10, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId10,
    2183,
    26,
    10000.00,
    'Bank Transfer',
    DATEADD(DAY, -10, GETDATE()),
    GETDATE()
);

/* ============================================================
   END OF SAMPLE DATA
   ============================================================ */


/* ============================================================
   ADDITIONAL REALISTIC BILLING SAMPLE DATA
   Scenarios 11-20
   Purpose:
   Expand the existing Billing sample data for frontend/UI testing.
   ============================================================ */

/* ============================================================
   SCENARIO 11
   Consultation + Scan
   Fully resolved balance.
   ============================================================ */
DECLARE @ClaimId11 INT;
DECLARE @LineItemId24 INT;
DECLARE @LineItemId25 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2192, 37, 1104, 1,
    'Star Health Insurance', 'INR',
    DATEADD(DAY, -40, GETDATE()), DATEADD(DAY, -38, GETDATE()),
    5000.00, 4400.00, 3000.00, 400.00, 1000.00,
    'Submitted', GETDATE()
);

SET @ClaimId11 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId11, 2192, 'Consultation', 'CONS017',
    'Internal Medicine Consultation', 1,
    2000.00, 1800.00, 1200.00, GETDATE()
);

SET @LineItemId24 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @LineItemId24, 2192, 1, 'New Visit',
    'Detailed medical consultation and treatment planning'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId11, 2192, 'Scan', 'SCAN013',
    'Chest X-Ray', 1,
    3000.00, 2600.00, 1800.00, GETDATE()
);

SET @LineItemId25 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId, AppointmentId, ScanType, BodyPart,
    ScanResultSummary, PerformedDate
)
VALUES
(
    @LineItemId25, 2192, 'X-Ray', 'Chest',
    'No significant abnormality detected',
    DATEADD(DAY, -40, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId11, 2192, @LineItemId25, 'ADJ019',
    'Radiology contractual adjustment', 400.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId11, @LineItemId24, 'Copay', 1000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId11, 2192, 'PAY-20011',
    3000.00, DATEADD(DAY, -30, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2192, 37, 1000.00,
    'UPI', DATEADD(DAY, -30, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId11, 2192, 37, 1000.00,
    'UPI', DATEADD(DAY, -30, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 12
   Lab + Pharmacy
   Outstanding balance remains for frontend balance testing.
   ============================================================ */
DECLARE @ClaimId12 INT;
DECLARE @LineItemId26 INT;
DECLARE @LineItemId27 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2191, 26, 1083, 1,
    'HDFC ERGO Health Insurance', 'INR',
    DATEADD(DAY, -35, GETDATE()), DATEADD(DAY, -33, GETDATE()),
    4200.00, 3700.00, 2200.00, 300.00, 800.00,
    'Submitted', GETDATE()
);

SET @ClaimId12 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId12, 2191, 'Lab', 'LAB014',
    'Kidney Function Test', 1,
    1700.00, 1500.00, 900.00, GETDATE()
);

SET @LineItemId26 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId, AppointmentId, LabTestCode, LabTestName,
    ResultValue, ResultUnit, NormalRange, PerformedDate
)
VALUES
(
    @LineItemId26, 2191, 'LAB014', 'Kidney Function Test',
    'Normal', 'mg/dL', '0.6-1.2 mg/dL',
    DATEADD(DAY, -35, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId12, 2191, 'Pharmacy', 'MED015',
    'Gastrointestinal Medicines', 5,
    2500.00, 2200.00, 1300.00, GETDATE()
);

SET @LineItemId27 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId, AppointmentId, MedicineName, Quantity, Dosage
)
VALUES
(
    @LineItemId27, 2191, 'Pantoprazole 40mg', 30,
    '1 tablet once daily before breakfast'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId12, 2191, @LineItemId26, 'ADJ020',
    'Laboratory negotiated adjustment', 300.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId12, @LineItemId27, 'Copay', 800.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId12, 2191, 'PAY-20012',
    2200.00, DATEADD(DAY, -25, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId12, 2191, 26, 500.00,
    'Card', DATEADD(DAY, -25, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 13
   Surgery + Bed Charge
   Inpatient claim with remaining balance.
   ============================================================ */
DECLARE @ClaimId13 INT;
DECLARE @LineItemId28 INT;
DECLARE @LineItemId29 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2190, 29, 1086, 1,
    'Bajaj Allianz Health Insurance', 'INR',
    DATEADD(DAY, -45, GETDATE()), DATEADD(DAY, -42, GETDATE()),
    26000.00, 23000.00, 15000.00, 3000.00, 4000.00,
    'Submitted', GETDATE()
);

SET @ClaimId13 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId13, 2190, 'Surgery', 'SURG013',
    'Hernia Repair Procedure', 1,
    20000.00, 17500.00, 11500.00, GETDATE()
);

SET @LineItemId28 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId, AppointmentId, SurgeonId, SurgeryType,
    DurationMinutes, SurgeryDate
)
VALUES
(
    @LineItemId28, 2190, 1, 'Hernia Repair',
    120, DATEADD(DAY, -45, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId13, 2190, 'Bed', 'BED012',
    'Private Room Stay', 3,
    6000.00, 5500.00, 3500.00, GETDATE()
);

SET @LineItemId29 = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId, AppointmentId, RoomType, Days, StartDate, EndDate
)
VALUES
(
    @LineItemId29, 2190, 'Private Room', 3,
    DATEADD(DAY, -45, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -42, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId13, 2190, @LineItemId28, 'ADJ021',
    'Surgical package adjustment', 3000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId13, @LineItemId29, 'Deductible', 4000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId13, 2190, 'PAY-20013',
    15000.00, DATEADD(DAY, -35, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId13, 2190, 29, 4000.00,
    'Bank Transfer', DATEADD(DAY, -35, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 14
   ICU + Nursing
   Critical-care inpatient scenario.
   ============================================================ */
DECLARE @ClaimId14 INT;
DECLARE @LineItemId30 INT;
DECLARE @LineItemId31 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2189, 29, 1099, 1,
    'Care Health Insurance', 'INR',
    DATEADD(DAY, -50, GETDATE()), DATEADD(DAY, -47, GETDATE()),
    18000.00, 16000.00, 8000.00, 2000.00, 3000.00,
    'Submitted', GETDATE()
);

SET @ClaimId14 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId14, 2189, 'ICU', 'ICU013',
    'Medical ICU Monitoring', 12,
    12000.00, 10500.00, 5500.00, GETDATE()
);

SET @LineItemId30 = SCOPE_IDENTITY();

INSERT INTO dbo.ICUDetail
(
    LineItemId, AppointmentId, ICUType, Hours, StartTime, EndTime
)
VALUES
(
    @LineItemId30, 2189, 'Medical ICU', 24,
    DATEADD(HOUR, -36, GETDATE()),
    DATEADD(HOUR, -12, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId14, 2189, 'Nursing', 'NURS013',
    'Critical Care Nursing', 6,
    6000.00, 5500.00, 2500.00, GETDATE()
);

SET @LineItemId31 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId, AppointmentId, Hours, NurseId
)
VALUES
(
    @LineItemId31, 2189, 6, 1
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId14, 2189, @LineItemId30, 'ADJ022',
    'Critical care contractual adjustment', 2000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId14, @LineItemId31, 'Coinsurance', 3000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId14, 2189, 'PAY-20014',
    8000.00, DATEADD(DAY, -40, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId14, 2189, 29, 3000.00,
    'Card', DATEADD(DAY, -40, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 15
   Consultation + Consumable
   Small outpatient balance.
   ============================================================ */
DECLARE @ClaimId15 INT;
DECLARE @LineItemId32 INT;
DECLARE @LineItemId33 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2188, 26, 1098, 1,
    'Niva Bupa Health Insurance', 'INR',
    DATEADD(DAY, -18, GETDATE()), DATEADD(DAY, -16, GETDATE()),
    3300.00, 2900.00, 2000.00, 300.00, 500.00,
    'Submitted', GETDATE()
);

SET @ClaimId15 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId15, 2188, 'Consultation', 'CONS018',
    'Dermatology Consultation', 1,
    1800.00, 1600.00, 1100.00, GETDATE()
);

SET @LineItemId32 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @LineItemId32, 2188, 1, 'New Visit',
    'Skin condition evaluation and treatment recommendation'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId15, 2188, 'Consumable', 'CON012',
    'Minor Procedure Consumables', 3,
    1500.00, 1300.00, 900.00, GETDATE()
);

SET @LineItemId33 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsumableDetail
(
    LineItemId, AppointmentId, ItemName, Quantity
)
VALUES
(
    @LineItemId33, 2188, 'Sterile Procedure Kit', 3
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId15, 2188, @LineItemId33, 'ADJ023',
    'Consumable package adjustment', 300.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId15, @LineItemId32, 'Copay', 500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId15, 2188, 'PAY-20015',
    2000.00, DATEADD(DAY, -12, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2188, 26, 500.00,
    'Cash', DATEADD(DAY, -12, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 16
   Scan + Lab
   Diagnostic claim with outstanding amount.
   ============================================================ */
DECLARE @ClaimId16 INT;
DECLARE @LineItemId34 INT;
DECLARE @LineItemId35 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2187, 26, 1097, 1,
    'ICICI Lombard Health Insurance', 'INR',
    DATEADD(DAY, -55, GETDATE()), DATEADD(DAY, -53, GETDATE()),
    8500.00, 7500.00, 5000.00, 1000.00, 1000.00,
    'Submitted', GETDATE()
);

SET @ClaimId16 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId16, 2187, 'Scan', 'SCAN014',
    'MRI Brain Scan', 1,
    6000.00, 5300.00, 3500.00, GETDATE()
);

SET @LineItemId34 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId, AppointmentId, ScanType, BodyPart,
    ScanResultSummary, PerformedDate
)
VALUES
(
    @LineItemId34, 2187, 'MRI', 'Brain',
    'No significant abnormality detected',
    DATEADD(DAY, -55, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId16, 2187, 'Lab', 'LAB015',
    'Thyroid Profile', 1,
    2500.00, 2200.00, 1500.00, GETDATE()
);

SET @LineItemId35 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId, AppointmentId, LabTestCode, LabTestName,
    ResultValue, ResultUnit, NormalRange, PerformedDate
)
VALUES
(
    @LineItemId35, 2187, 'LAB015', 'Thyroid Profile',
    'Within Normal Limits', 'mIU/L', '0.4-4.0 mIU/L',
    DATEADD(DAY, -55, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId16, 2187, @LineItemId34, 'ADJ024',
    'Diagnostic service adjustment', 1000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId16, @LineItemId34, 'Copay', 1000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId16, 2187, 'PAY-20016',
    5000.00, DATEADD(DAY, -48, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId16, 2187, 26, 1000.00,
    'UPI', DATEADD(DAY, -48, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 17
   Pharmacy-only claim
   Patient payment handled separately.
   ============================================================ */
DECLARE @ClaimId17 INT;
DECLARE @LineItemId36 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2186, 26, 1096, 1,
    'Aditya Birla Health Insurance', 'INR',
    DATEADD(DAY, -22, GETDATE()), DATEADD(DAY, -20, GETDATE()),
    3600.00, 3200.00, 1500.00, 400.00, 800.00,
    'Submitted', GETDATE()
);

SET @ClaimId17 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId17, 2186, 'Pharmacy', 'MED016',
    'Chronic Care Medicines', 4,
    3600.00, 3200.00, 1500.00, GETDATE()
);

SET @LineItemId36 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId, AppointmentId, MedicineName, Quantity, Dosage
)
VALUES
(
    @LineItemId36, 2186, 'Atorvastatin 20mg', 30,
    '1 tablet once daily at night'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId17, 2186, @LineItemId36, 'ADJ025',
    'Pharmacy network adjustment', 400.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId17, @LineItemId36, 'Copay', 800.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId17, 2186, 'PAY-20017',
    1500.00, DATEADD(DAY, -18, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2186, 26, 800.00,
    'Card', DATEADD(DAY, -18, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId17, 2186, 26, 800.00,
    'Card', DATEADD(DAY, -18, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 18
   Surgery + Nursing + ICU
   Large inpatient claim.
   ============================================================ */
DECLARE @ClaimId18 INT;
DECLARE @LineItemId37 INT;
DECLARE @LineItemId38 INT;
DECLARE @LineItemId39 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2185, 26, 1095, 1,
    'United India Insurance', 'INR',
    DATEADD(DAY, -65, GETDATE()), DATEADD(DAY, -62, GETDATE()),
    50000.00, 44000.00, 30000.00, 5000.00, 6000.00,
    'Submitted', GETDATE()
);

SET @ClaimId18 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, 'Surgery', 'SURG014',
    'Orthopedic Surgical Procedure', 1,
    30000.00, 26500.00, 19000.00, GETDATE()
);

SET @LineItemId37 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId, AppointmentId, SurgeonId, SurgeryType,
    DurationMinutes, SurgeryDate
)
VALUES
(
    @LineItemId37, 2185, 1, 'Orthopedic Surgery',
    180, DATEADD(DAY, -65, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, 'Nursing', 'NURS014',
    'Post-surgical Nursing Care', 12,
    6000.00, 5500.00, 3500.00, GETDATE()
);

SET @LineItemId38 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId, AppointmentId, Hours, NurseId
)
VALUES
(
    @LineItemId38, 2185, 12, 1
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, 'ICU', 'ICU014',
    'Post-operative ICU Monitoring', 14,
    14000.00, 12000.00, 7500.00, GETDATE()
);

SET @LineItemId39 = SCOPE_IDENTITY();

INSERT INTO dbo.ICUDetail
(
    LineItemId, AppointmentId, ICUType, Hours, StartTime, EndTime
)
VALUES
(
    @LineItemId39, 2185, 'Surgical ICU', 14,
    DATEADD(HOUR, -40, GETDATE()),
    DATEADD(HOUR, -26, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, @LineItemId37, 'ADJ026',
    'Orthopedic surgery package adjustment', 5000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId18, @LineItemId37, 'Deductible', 6000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, 'PAY-20018',
    30000.00, DATEADD(DAY, -55, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId18, 2185, 26, 6000.00,
    'Bank Transfer', DATEADD(DAY, -55, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 19
   Consultation + Lab + Pharmacy
   Balanced outpatient claim.
   ============================================================ */
DECLARE @ClaimId19 INT;
DECLARE @LineItemId40 INT;
DECLARE @LineItemId41 INT;
DECLARE @LineItemId42 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2184, 26, 1094, 1,
    'ManipalCigna Health Insurance', 'INR',
    DATEADD(DAY, -75, GETDATE()), DATEADD(DAY, -73, GETDATE()),
    7000.00, 6200.00, 5000.00, 500.00, 700.00,
    'Submitted', GETDATE()
);

SET @ClaimId19 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId19, 2184, 'Consultation', 'CONS019',
    'Endocrinology Consultation', 1,
    1500.00, 1300.00, 1000.00, GETDATE()
);

SET @LineItemId40 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @LineItemId40, 2184, 1, 'Follow-up',
    'Chronic disease follow-up and medication review'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId19, 2184, 'Lab', 'LAB016',
    'HbA1c Test', 1,
    1500.00, 1300.00, 1000.00, GETDATE()
);

SET @LineItemId41 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId, AppointmentId, LabTestCode, LabTestName,
    ResultValue, ResultUnit, NormalRange, PerformedDate
)
VALUES
(
    @LineItemId41, 2184, 'LAB016', 'HbA1c Test',
    '6.2', '%', '4.0-6.5%', DATEADD(DAY, -75, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId19, 2184, 'Pharmacy', 'MED017',
    'Diabetes Medication Supply', 2,
    4000.00, 3600.00, 3000.00, GETDATE()
);

SET @LineItemId42 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId, AppointmentId, MedicineName, Quantity, Dosage
)
VALUES
(
    @LineItemId42, 2184, 'Glimepiride 1mg', 30,
    '1 tablet once daily with breakfast'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId19, 2184, @LineItemId42, 'ADJ027',
    'Outpatient package adjustment', 500.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId19, @LineItemId40, 'Copay', 700.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId19, 2184, 'PAY-20019',
    5000.00, DATEADD(DAY, -65, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2184, 26, 700.00,
    'UPI', DATEADD(DAY, -65, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 20
   Bed + Nursing
   Inpatient ward scenario with outstanding balance.
   ============================================================ */
DECLARE @ClaimId20 INT;
DECLARE @LineItemId43 INT;
DECLARE @LineItemId44 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2183, 26, 1093, 1,
    'Tata AIG Health Insurance', 'INR',
    DATEADD(DAY, -85, GETDATE()), DATEADD(DAY, -82, GETDATE()),
    11000.00, 9800.00, 6000.00, 800.00, 1500.00,
    'Submitted', GETDATE()
);

SET @ClaimId20 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId20, 2183, 'Bed', 'BED013',
    'Semi-Private Ward Bed Charge', 3,
    6000.00, 5300.00, 3500.00, GETDATE()
);

SET @LineItemId43 = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId, AppointmentId, RoomType, Days, StartDate, EndDate
)
VALUES
(
    @LineItemId43, 2183, 'Semi-Private Ward', 3,
    DATEADD(DAY, -85, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -82, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount, PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId20, 2183, 'Nursing', 'NURS015',
    'Ward Nursing Care', 5,
    5000.00, 4500.00, 2500.00, GETDATE()
);

SET @LineItemId44 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId, AppointmentId, Hours, NurseId
)
VALUES
(
    @LineItemId44, 2183, 5, 1
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId, AdjustmentCode,
    AdjustmentDescription, AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId20, 2183, @LineItemId43, 'ADJ028',
    'Ward accommodation adjustment', 800.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId20, @LineItemId43, 'Copay', 1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId20, 2183, 'PAY-20020',
    6000.00, DATEADD(DAY, -72, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2183, 26, 1500.00,
    'Card', DATEADD(DAY, -72, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId, AmountPaid,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId20, 2183, 26, 1500.00,
    'Card', DATEADD(DAY, -72, GETDATE()), GETDATE()
);

/* ============================================================
   SCENARIO 21
   Self-pay consultation with consumable
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2183,
    26,
    1098,
    1,
    'Self Pay',
    'INR',
    DATEADD(DAY, -70, GETDATE()),
    DATEADD(DAY, -69, GETDATE()),
    3200.00,
    3000.00,
    0.00,
    200.00,
    3000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId21 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId21,
    2183,
    'Consultation',
    'CONS021',
    'General Physician Consultation',
    1,
    2000.00,
    1800.00,
    0.00,
    GETDATE()
);

DECLARE @LineItemId21 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId21,
    2183,
    1,
    'New Visit',
    'Self-pay general physician consultation'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId21,
    2183,
    'Consumable',
    'CON021',
    'Disposable Examination Supplies',
    1,
    1200.00,
    1200.00,
    0.00,
    GETDATE()
);

DECLARE @LineItemId22 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsumableDetail
(
    LineItemId,
    AppointmentId,
    ItemName,
    Quantity
)
VALUES
(
    @LineItemId22,
    2183,
    'Disposable Examination Kit',
    1
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId21,
    2183,
    @LineItemId21,
    'ADJ021',
    'Self-pay courtesy adjustment',
    200.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId21,
    @LineItemId21,
    'Self Pay',
    1800.00,
    GETDATE()
),
(
    @ClaimId21,
    @LineItemId22,
    'Self Pay',
    1200.00,
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId21,
    2183,
    26,
    3000.00,
    'UPI',
    DATEADD(DAY, -65, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 22
   Lab + Scan with multiple insurance payments
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2184,
    26,
    1098,
    1,
    'Niva Bupa Health Insurance',
    'INR',
    DATEADD(DAY, -68, GETDATE()),
    DATEADD(DAY, -67, GETDATE()),
    9800.00,
    9000.00,
    7000.00,
    800.00,
    2000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId22 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId22,
    2184,
    'Lab',
    'LAB021',
    'Comprehensive Metabolic Panel',
    1,
    3800.00,
    3500.00,
    2700.00,
    GETDATE()
);

DECLARE @LineItemId23 INT = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId23,
    2184,
    'LAB021',
    'Comprehensive Metabolic Panel',
    'Within Normal Limits',
    'mg/dL',
    'Normal Range',
    DATEADD(DAY, -68, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId22,
    2184,
    'Scan',
    'SCAN021',
    'Ultrasound Abdomen',
    1,
    6000.00,
    5500.00,
    4300.00,
    GETDATE()
);

DECLARE @LineItemId24 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId,
    AppointmentId,
    ScanType,
    BodyPart,
    ScanResultSummary,
    PerformedDate
)
VALUES
(
    @LineItemId24,
    2184,
    'Ultrasound',
    'Abdomen',
    'No significant abnormality identified',
    DATEADD(DAY, -68, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId22,
    2184,
    @LineItemId24,
    'ADJ022',
    'Diagnostic package adjustment',
    800.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId22,
    2184,
    'PAY-21022-A',
    4200.00,
    DATEADD(DAY, -60, GETDATE()),
    GETDATE()
),
(
    @ClaimId22,
    2184,
    'PAY-21022-B',
    2800.00,
    DATEADD(DAY, -55, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId22,
    @LineItemId24,
    'Coinsurance',
    2000.00,
    GETDATE()
);


/* ============================================================
   SCENARIO 23
   Fully paid outpatient consultation
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2185,
    26,
    1098,
    1,
    'ICICI Lombard Health Insurance',
    'INR',
    DATEADD(DAY, -62, GETDATE()),
    DATEADD(DAY, -61, GETDATE()),
    5000.00,
    4500.00,
    4500.00,
    500.00,
    0.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId23 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId23,
    2185,
    'Consultation',
    'CONS023',
    'Specialist Follow-up Consultation',
    1,
    5000.00,
    4500.00,
    4500.00,
    GETDATE()
);

DECLARE @LineItemId25 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId25,
    2185,
    1,
    'Follow-up',
    'Fully insurance-covered follow-up consultation'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId23,
    2185,
    @LineItemId25,
    'ADJ023',
    'Contractual write-off',
    500.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId23,
    2185,
    'PAY-21023',
    4500.00,
    DATEADD(DAY, -55, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 24
   Surgery + Pharmacy + Consumables
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2186,
    26,
    1098,
    1,
    'Aditya Birla Health Insurance',
    'INR',
    DATEADD(DAY, -58, GETDATE()),
    DATEADD(DAY, -56, GETDATE()),
    36000.00,
    32000.00,
    25000.00,
    3000.00,
    4000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId24 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    2186,
    'Surgery',
    'SURG021',
    'Minor Surgical Procedure',
    1,
    25000.00,
    22000.00,
    17500.00,
    GETDATE()
);

DECLARE @LineItemId26 INT = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId,
    AppointmentId,
    SurgeonId,
    SurgeryType,
    DurationMinutes,
    SurgeryDate
)
VALUES
(
    @LineItemId26,
    2186,
    1,
    'Minor General Surgery',
    90,
    DATEADD(DAY, -58, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    2186,
    'Pharmacy',
    'MED021',
    'Post-operative Medicines',
    6,
    7000.00,
    6500.00,
    5000.00,
    GETDATE()
);

DECLARE @LineItemId27 INT = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId27,
    2186,
    'Post-operative Medication Pack',
    12,
    'As prescribed'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    2186,
    'Consumable',
    'CON024',
    'Surgical Consumable Supplies',
    1,
    4000.00,
    3500.00,
    2500.00,
    GETDATE()
);

DECLARE @LineItemId28 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsumableDetail
(
    LineItemId,
    AppointmentId,
    ItemName,
    Quantity
)
VALUES
(
    @LineItemId28,
    2186,
    'Sterile Surgical Consumable Pack',
    2
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    2186,
    @LineItemId26,
    'ADJ024',
    'Surgical package adjustment',
    3000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    @LineItemId26,
    'Deductible',
    4000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId24,
    2186,
    'PAY-21024',
    25000.00,
    DATEADD(DAY, -45, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 25
   Multi-day inpatient bed + nursing + consumables
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2187,
    26,
    1098,
    1,
    'United India Insurance',
    'INR',
    DATEADD(DAY, -52, GETDATE()),
    DATEADD(DAY, -48, GETDATE()),
    28500.00,
    25000.00,
    19000.00,
    3500.00,
    6000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId25 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    2187,
    'Bed',
    'BED021',
    'Private Room Charges',
    5,
    12500.00,
    11000.00,
    8500.00,
    GETDATE()
);

DECLARE @LineItemId29 INT = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId,
    AppointmentId,
    RoomType,
    Days,
    StartDate,
    EndDate
)
VALUES
(
    @LineItemId29,
    2187,
    'Private Room',
    5,
    DATEADD(DAY, -52, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -47, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    2187,
    'Nursing',
    'NURS021',
    'Inpatient Nursing Care',
    40,
    10000.00,
    9000.00,
    7000.00,
    GETDATE()
);

DECLARE @LineItemId30 INT = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId,
    AppointmentId,
    Hours,
    NurseId
)
VALUES
(
    @LineItemId30,
    2187,
    40,
    1
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    2187,
    'Consumable',
    'CON025',
    'Inpatient Consumable Supplies',
    6,
    6000.00,
    5000.00,
    3500.00,
    GETDATE()
);

DECLARE @LineItemId31 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsumableDetail
(
    LineItemId,
    AppointmentId,
    ItemName,
    Quantity
)
VALUES
(
    @LineItemId31,
    2187,
    'IV and Dressing Supplies',
    6
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    2187,
    @LineItemId29,
    'ADJ025',
    'Room package adjustment',
    3500.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    @LineItemId29,
    'Deductible',
    6000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId25,
    2187,
    'PAY-21025',
    19000.00,
    DATEADD(DAY, -40, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 26
   Multiple laboratory tests + imaging
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2188,
    26,
    1098,
    1,
    'ManipalCigna Health Insurance',
    'INR',
    DATEADD(DAY, -45, GETDATE()),
    DATEADD(DAY, -44, GETDATE()),
    15600.00,
    14000.00,
    10500.00,
    1600.00,
    2400.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId26 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    2188,
    'Lab',
    'LAB026A',
    'Lipid Profile',
    1,
    3000.00,
    2700.00,
    2100.00,
    GETDATE()
);

DECLARE @LineItemId32 INT = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId32,
    2188,
    'LAB026A',
    'Lipid Profile',
    'Borderline High',
    'mg/dL',
    'Within Reference Range',
    DATEADD(DAY, -45, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    2188,
    'Lab',
    'LAB026B',
    'HbA1c Test',
    1,
    2600.00,
    2400.00,
    1800.00,
    GETDATE()
);

DECLARE @LineItemId33 INT = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId33,
    2188,
    'LAB026B',
    'HbA1c Test',
    '5.8',
    '%',
    '4.0 - 5.6',
    DATEADD(DAY, -45, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    2188,
    'Scan',
    'SCAN026',
    'Chest X-Ray',
    1,
    10000.00,
    8900.00,
    6600.00,
    GETDATE()
);

DECLARE @LineItemId34 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId,
    AppointmentId,
    ScanType,
    BodyPart,
    ScanResultSummary,
    PerformedDate
)
VALUES
(
    @LineItemId34,
    2188,
    'X-Ray',
    'Chest',
    'No acute cardiopulmonary abnormality',
    DATEADD(DAY, -45, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    2188,
    @LineItemId34,
    'ADJ026',
    'Imaging negotiated adjustment',
    1600.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    @LineItemId34,
    'Coinsurance',
    2400.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId26,
    2188,
    'PAY-21026',
    10500.00,
    DATEADD(DAY, -35, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 27
   Consultation + pharmacy with patient balance
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2189,
    29,
    1099,
    1,
    'Tata AIG Health Insurance',
    'INR',
    DATEADD(DAY, -40, GETDATE()),
    DATEADD(DAY, -39, GETDATE()),
    7200.00,
    6500.00,
    4500.00,
    700.00,
    2000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId27 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId27,
    2189,
    'Consultation',
    'CONS027',
    'Specialist Consultation',
    1,
    3000.00,
    2700.00,
    2000.00,
    GETDATE()
);

DECLARE @LineItemId35 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId35,
    2189,
    1,
    'Follow-up',
    'Specialist follow-up consultation'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId27,
    2189,
    'Pharmacy',
    'MED027',
    'Chronic Medication Refill',
    1,
    4200.00,
    3800.00,
    2500.00,
    GETDATE()
);

DECLARE @LineItemId36 INT = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId,
    AppointmentId,
    MedicineName,
    Quantity,
    Dosage
)
VALUES
(
    @LineItemId36,
    2189,
    'Chronic Medication Refill Pack',
    30,
    'As prescribed'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId27,
    2189,
    @LineItemId36,
    'ADJ027',
    'Pharmacy negotiated adjustment',
    700.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId27,
    @LineItemId36,
    'Copay',
    2000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId27,
    2189,
    'PAY-21027',
    4500.00,
    DATEADD(DAY, -30, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 28
   Claim-level patient responsibility
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2190,
    29,
    1086,
    1,
    'Bajaj Allianz Health Insurance',
    'INR',
    DATEADD(DAY, -35, GETDATE()),
    DATEADD(DAY, -34, GETDATE()),
    8400.00,
    7600.00,
    6000.00,
    800.00,
    1600.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId28 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    2190,
    'Consultation',
    'CONS028',
    'Emergency Consultation',
    1,
    2400.00,
    2200.00,
    1800.00,
    GETDATE()
);

DECLARE @LineItemId37 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId37,
    2190,
    1,
    'Emergency',
    'Emergency assessment'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    2190,
    'Lab',
    'LAB028',
    'Emergency Blood Panel',
    1,
    6000.00,
    5400.00,
    4200.00,
    GETDATE()
);

DECLARE @LineItemId38 INT = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId,
    AppointmentId,
    LabTestCode,
    LabTestName,
    ResultValue,
    ResultUnit,
    NormalRange,
    PerformedDate
)
VALUES
(
    @LineItemId38,
    2190,
    'LAB028',
    'Emergency Blood Panel',
    'Within Normal Limits',
    'mg/dL',
    'Normal Range',
    DATEADD(DAY, -35, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    2190,
    @LineItemId37,
    'ADJ028',
    'Emergency service adjustment',
    800.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    NULL,
    'Deductible',
    1600.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    2190,
    'PAY-21028',
    6000.00,
    DATEADD(DAY, -25, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId28,
    2190,
    29,
    1600.00,
    'Card',
    DATEADD(DAY, -20, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 29
   USD billing claim
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2191,
    26,
    1083,
    1,
    'Star Health Insurance',
    'USD',
    DATEADD(DAY, -30, GETDATE()),
    DATEADD(DAY, -29, GETDATE()),
    1200.00,
    1100.00,
    850.00,
    100.00,
    150.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId29 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId29,
    2191,
    'Consultation',
    'CONS029',
    'International Specialist Consultation',
    1,
    1200.00,
    1100.00,
    850.00,
    GETDATE()
);

DECLARE @LineItemId39 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId,
    AppointmentId,
    DoctorId,
    VisitType,
    Notes
)
VALUES
(
    @LineItemId39,
    2191,
    1,
    'New Visit',
    'International consultation billing example'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId29,
    2191,
    @LineItemId39,
    'ADJ029',
    'Contractual adjustment',
    100.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId29,
    @LineItemId39,
    'Copay',
    150.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId29,
    2191,
    'PAY-21029',
    850.00,
    DATEADD(DAY, -20, GETDATE()),
    GETDATE()
);


/* ============================================================
   SCENARIO 30
   Surgery + ICU + Bed with multiple insurance payments
   ============================================================ */

INSERT INTO dbo.ClaimMaster
(
    AppointmentId,
    PatientId,
    ProfileId,
    HospitalId,
    InsuranceProvider,
    CurrencyCode,
    DateOfService,
    ClaimDate,
    TotalChargeAmount,
    TotalAllowedAmount,
    TotalPaidAmount,
    TotalAdjustmentAmount,
    TotalPatientResponsibility,
    ClaimStatus,
    CreatedDate
)
VALUES
(
    2192,
    37,
    1104,
    1,
    'Care Health Insurance',
    'INR',
    DATEADD(DAY, -28, GETDATE()),
    DATEADD(DAY, -25, GETDATE()),
    52000.00,
    47000.00,
    36000.00,
    5000.00,
    6000.00,
    'Submitted',
    GETDATE()
);

DECLARE @ClaimId30 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    'Surgery',
    'SURG030',
    'Major Abdominal Surgery',
    1,
    32000.00,
    29000.00,
    22000.00,
    GETDATE()
);

DECLARE @LineItemId40 INT = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId,
    AppointmentId,
    SurgeonId,
    SurgeryType,
    DurationMinutes,
    SurgeryDate
)
VALUES
(
    @LineItemId40,
    2192,
    1,
    'Major Abdominal Surgery',
    210,
    DATEADD(DAY, -28, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    'ICU',
    'ICU030',
    'Post-operative ICU Monitoring',
    24,
    12000.00,
    11000.00,
    8500.00,
    GETDATE()
);

DECLARE @LineItemId41 INT = SCOPE_IDENTITY();

INSERT INTO dbo.ICUDetail
(
    LineItemId,
    AppointmentId,
    ICUType,
    Hours,
    StartTime,
    EndTime
)
VALUES
(
    @LineItemId41,
    2192,
    'Surgical ICU',
    24,
    DATEADD(HOUR, -72, GETDATE()),
    DATEADD(HOUR, -48, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId,
    AppointmentId,
    ServiceCategory,
    ServiceCode,
    Description,
    Units,
    ChargeAmount,
    AllowedAmount,
    PaidAmount,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    'Bed',
    'BED030',
    'Private Recovery Room',
    4,
    8000.00,
    7000.00,
    5500.00,
    GETDATE()
);

DECLARE @LineItemId42 INT = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId,
    AppointmentId,
    RoomType,
    Days,
    StartDate,
    EndDate
)
VALUES
(
    @LineItemId42,
    2192,
    'Private Recovery Room',
    4,
    DATEADD(DAY, -28, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -24, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId,
    AppointmentId,
    LineItemId,
    AdjustmentCode,
    AdjustmentDescription,
    AdjustmentAmount,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    @LineItemId40,
    'ADJ030',
    'Surgical package adjustment',
    5000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId,
    LineItemId,
    Type,
    Amount,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    @LineItemId40,
    'Deductible',
    6000.00,
    GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId,
    AppointmentId,
    PaymentReference,
    PaidAmount,
    PaymentDate,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    'PAY-21030-A',
    20000.00,
    DATEADD(DAY, -18, GETDATE()),
    GETDATE()
),
(
    @ClaimId30,
    2192,
    'PAY-21030-B',
    16000.00,
    DATEADD(DAY, -12, GETDATE()),
    GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId,
    AppointmentId,
    PatientId,
    AmountPaid,
    PaymentMethod,
    TransactionDate,
    CreatedDate
)
VALUES
(
    @ClaimId30,
    2192,
    37,
    6000.00,
    'Bank Transfer',
    DATEADD(DAY, -10, GETDATE()),
    GETDATE()
);

/* ============================================================
   END OF ADDITIONAL REALISTIC SAMPLE DATA
   ============================================================ */

/* ============================================================
   ADDITIONAL REALISTIC BILLING SAMPLE DATA
   Scenarios 31-40
   Purpose:
   Expand the existing Billing sample data with additional
   real-world insurance and payment combinations.
   ============================================================ */


/* ============================================================
   SCENARIO 31
   Denied Diagnostic Claim
   Insurance denied the diagnostic services.
   Patient responsibility is not automatically assigned.
   ============================================================ */

DECLARE @ClaimId31 INT;
DECLARE @L43 INT;
DECLARE @L44 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2184, 26, 1098, 1,
    'HDFC ERGO Health Insurance', 'INR',
    DATEADD(DAY, -32, GETDATE()),
    DATEADD(DAY, -30, GETDATE()),
    9000.00, 0.00, 0.00, 0.00, 0.00,
    'Denied', GETDATE()
);

SET @ClaimId31 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId31, 2184, 'Scan', 'SCAN031',
    'Advanced Abdominal CT Scan', 1,
    6000.00, 0.00, 0.00, GETDATE()
);

SET @L43 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId, AppointmentId, ScanType, BodyPart,
    ScanResultSummary, PerformedDate
)
VALUES
(
    @L43, 2184, 'CT Scan', 'Abdomen',
    'Diagnostic imaging completed; claim denied by payer',
    DATEADD(DAY, -32, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId31, 2184, 'Lab', 'LAB031',
    'Specialized Blood Panel', 1,
    3000.00, 0.00, 0.00, GETDATE()
);

SET @L44 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId, AppointmentId, LabTestCode, LabTestName,
    ResultValue, ResultUnit, NormalRange, PerformedDate
)
VALUES
(
    @L44, 2184, 'LAB031', 'Specialized Blood Panel',
    'Within Normal Limits', 'mg/dL', 'Reference Range',
    DATEADD(DAY, -32, GETDATE())
);


/* ============================================================
   SCENARIO 32
   Primary + Secondary Insurance Payments
   Claim receives multiple insurance payments.
   ============================================================ */

DECLARE @ClaimId32 INT;
DECLARE @L45 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2185, 26, 1083, 1,
    'Star Health Insurance', 'INR',
    DATEADD(DAY, -28, GETDATE()),
    DATEADD(DAY, -26, GETDATE()),
    15000.00, 13000.00, 11000.00, 2000.00, 2000.00,
    'Submitted', GETDATE()
);

SET @ClaimId32 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId32, 2185, 'Consultation', 'CONS032',
    'Specialist Consultation', 1,
    5000.00, 4500.00, 4000.00, GETDATE()
);

SET @L45 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @L45, 2185, 1, 'Follow-up',
    'Specialist consultation with primary and secondary insurance processing'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId32, 2185, @L45,
    'ADJ032', 'Contractual insurance adjustment',
    2000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId32, @L45, 'Coinsurance',
    2000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId32, 2185, 'PAY-21032-PRIMARY',
    8000.00, DATEADD(DAY, -18, GETDATE()), GETDATE()
),
(
    @ClaimId32, 2185, 'PAY-21032-SECONDARY',
    3000.00, DATEADD(DAY, -10, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 33
   Line-Level Mixed Adjudication
   Different services have different payment outcomes.
   ============================================================ */

DECLARE @ClaimId33 INT;
DECLARE @L46 INT;
DECLARE @L47 INT;
DECLARE @L48 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2186, 29, 1099, 1,
    'Bajaj Allianz Health Insurance', 'INR',
    DATEADD(DAY, -24, GETDATE()),
    DATEADD(DAY, -22, GETDATE()),
    18000.00, 15500.00, 10500.00, 1500.00, 3500.00,
    'Partially Paid', GETDATE()
);

SET @ClaimId33 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId33, 2186, 'Consultation', 'CONS033',
    'Specialist Consultation', 1,
    4000.00, 3500.00, 3500.00, GETDATE()
);

SET @L46 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @L46, 2186, 1, 'New Visit',
    'Consultation fully adjudicated'
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId33, 2186, 'Lab', 'LAB033',
    'Advanced Liver Function Test', 1,
    5000.00, 4500.00, 2500.00, GETDATE()
);

SET @L47 = SCOPE_IDENTITY();

INSERT INTO dbo.LabTestDetail
(
    LineItemId, AppointmentId, LabTestCode, LabTestName,
    ResultValue, ResultUnit, NormalRange, PerformedDate
)
VALUES
(
    @L47, 2186, 'LAB033', 'Advanced Liver Function Test',
    'Normal', 'mg/dL', 'Reference Range',
    DATEADD(DAY, -24, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId33, 2186, 'Pharmacy', 'MED033',
    'Post Consultation Medication', 1,
    9000.00, 7500.00, 4500.00, GETDATE()
);

SET @L48 = SCOPE_IDENTITY();

INSERT INTO dbo.PharmacyDetail
(
    LineItemId, AppointmentId, MedicineName,
    Quantity, Dosage
)
VALUES
(
    @L48, 2186,
    'Post Consultation Medication Pack',
    30, 'As prescribed'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId33, 2186, @L47,
    'ADJ033', 'Laboratory contractual adjustment',
    1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId33, @L48, 'Copay',
    3500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId33, 2186, 'PAY-21033',
    10500.00, DATEADD(DAY, -15, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 34
   Patient Responsibility Paid in Installments
   Patient makes multiple payments against the responsibility.
   ============================================================ */

DECLARE @ClaimId34 INT;
DECLARE @L49 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2187, 26, 1097, 1,
    'Niva Bupa Health Insurance', 'INR',
    DATEADD(DAY, -21, GETDATE()),
    DATEADD(DAY, -19, GETDATE()),
    12500.00, 11000.00, 8000.00, 1500.00, 1500.00,
    'Submitted', GETDATE()
);

SET @ClaimId34 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId34, 2187, 'Scan', 'SCAN034',
    'MRI Knee Scan', 1,
    12500.00, 11000.00, 8000.00, GETDATE()
);

SET @L49 = SCOPE_IDENTITY();

INSERT INTO dbo.ScanDetail
(
    LineItemId, AppointmentId, ScanType, BodyPart,
    ScanResultSummary, PerformedDate
)
VALUES
(
    @L49, 2187, 'MRI', 'Knee',
    'No acute abnormality detected',
    DATEADD(DAY, -21, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId34, 2187, @L49,
    'ADJ034', 'Imaging contractual adjustment',
    1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId34, @L49, 'Deductible',
    1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId34, 2187, 'PAY-21034',
    8000.00, DATEADD(DAY, -14, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId,
    AmountPaid, PaymentMethod,
    TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId34, 2187, 26,
    750.00, 'UPI',
    DATEADD(DAY, -10, GETDATE()), GETDATE()
),
(
    @ClaimId34, 2187, 26,
    750.00, 'Card',
    DATEADD(DAY, -5, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 35
   Claim-Level Adjustment
   Adjustment applies to the complete claim.
   ============================================================ */

DECLARE @ClaimId35 INT;
DECLARE @L50 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2188, 26, 1098, 1,
    'ICICI Lombard Health Insurance', 'INR',
    DATEADD(DAY, -18, GETDATE()),
    DATEADD(DAY, -16, GETDATE()),
    14000.00, 12500.00, 9000.00, 1500.00, 2000.00,
    'Submitted', GETDATE()
);

SET @ClaimId35 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId35, 2188, 'Consultation', 'CONS035',
    'General Medicine Consultation', 1,
    4000.00, 3500.00, 2500.00, GETDATE()
);

SET @L50 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId, VisitType, Notes
)
VALUES
(
    @L50, 2188, 1, 'Follow-up',
    'Routine follow-up consultation'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId35, 2188, NULL,
    'ADJ035', 'Overall claim contractual adjustment',
    1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId35, NULL, 'Deductible',
    2000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId35, 2188, 'PAY-21035',
    9000.00, DATEADD(DAY, -12, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 36
   Fully Paid Inpatient Claim
   Surgery + Bed + Nursing with zero remaining balance.
   ============================================================ */

DECLARE @ClaimId36 INT;
DECLARE @L51 INT;
DECLARE @L52 INT;
DECLARE @L53 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2189, 29, 1099, 1,
    'Care Health Insurance', 'INR',
    DATEADD(DAY, -16, GETDATE()),
    DATEADD(DAY, -14, GETDATE()),
    42000.00, 36000.00, 36000.00, 6000.00, 0.00,
    'Paid', GETDATE()
);

SET @ClaimId36 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId36, 2189, 'Surgery', 'SURG036',
    'Laparoscopic Surgery', 1,
    26000.00, 22000.00, 22000.00, GETDATE()
);

SET @L51 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId, AppointmentId, SurgeonId,
    SurgeryType, DurationMinutes, SurgeryDate
)
VALUES
(
    @L51, 2189, 1,
    'Laparoscopic Surgery', 150,
    DATEADD(DAY, -16, GETDATE())
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId36, 2189, 'Bed', 'BED036',
    'Private Inpatient Room', 4,
    8000.00, 7000.00, 7000.00, GETDATE()
);

SET @L52 = SCOPE_IDENTITY();

INSERT INTO dbo.BedChargeDetail
(
    LineItemId, AppointmentId, RoomType,
    Days, StartDate, EndDate
)
VALUES
(
    @L52, 2189, 'Private Room',
    4,
    DATEADD(DAY, -16, CAST(GETDATE() AS DATE)),
    DATEADD(DAY, -12, CAST(GETDATE() AS DATE))
);

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId36, 2189, 'Nursing', 'NURS036',
    'Inpatient Nursing Care', 8,
    8000.00, 7000.00, 7000.00, GETDATE()
);

SET @L53 = SCOPE_IDENTITY();

INSERT INTO dbo.NursingChargeDetail
(
    LineItemId, AppointmentId, Hours, NurseId
)
VALUES
(
    @L53, 2189, 8, 1
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId36, 2189, @L51,
    'ADJ036', 'Inpatient package adjustment',
    6000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId36, 2189, 'PAY-21036',
    36000.00, DATEADD(DAY, -8, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 37
   Partial Insurance Payment + Copay
   Outstanding patient balance remains.
   ============================================================ */

DECLARE @ClaimId37 INT;
DECLARE @L54 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2190, 29, 1086, 1,
    'Tata AIG Health Insurance', 'INR',
    DATEADD(DAY, -14, GETDATE()),
    DATEADD(DAY, -12, GETDATE()),
    10000.00, 9000.00, 5500.00, 1000.00, 2500.00,
    'Partially Paid', GETDATE()
);

SET @ClaimId37 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId37, 2190, 'Consultation', 'CONS037',
    'Emergency Specialist Consultation', 1,
    10000.00, 9000.00, 5500.00, GETDATE()
);

SET @L54 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId,
    VisitType, Notes
)
VALUES
(
    @L54, 2190, 1,
    'Emergency',
    'Emergency specialist consultation'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId37, 2190, @L54,
    'ADJ037', 'Contractual consultation adjustment',
    1000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId37, @L54,
    'Copay', 2500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId37, 2190, 'PAY-21037',
    5500.00, DATEADD(DAY, -7, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientCopayTransaction
(
    AppointmentId, PatientId, CopayAmount,
    PaymentMethod, TransactionDate, CreatedDate
)
VALUES
(
    2190, 29, 1000.00,
    'UPI', DATEADD(DAY, -5, GETDATE()), GETDATE()
);

INSERT INTO dbo.PatientPaymentTransaction
(
    ClaimId, AppointmentId, PatientId,
    AmountPaid, PaymentMethod,
    TransactionDate, CreatedDate
)
VALUES
(
    @ClaimId37, 2190, 29,
    1000.00, 'UPI',
    DATEADD(DAY, -5, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 38
   Multiple Insurance Payments
   Claim receives three separate payment transactions.
   ============================================================ */

DECLARE @ClaimId38 INT;
DECLARE @L55 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2191, 26, 1083, 1,
    'United India Insurance', 'INR',
    DATEADD(DAY, -12, GETDATE()),
    DATEADD(DAY, -10, GETDATE()),
    22000.00, 19000.00, 15000.00, 3000.00, 1000.00,
    'Submitted', GETDATE()
);

SET @ClaimId38 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId38, 2191, 'Surgery', 'SURG038',
    'Minor Orthopedic Procedure', 1,
    22000.00, 19000.00, 15000.00, GETDATE()
);

SET @L55 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId, AppointmentId, SurgeonId,
    SurgeryType, DurationMinutes, SurgeryDate
)
VALUES
(
    @L55, 2191, 1,
    'Minor Orthopedic Procedure', 100,
    DATEADD(DAY, -12, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId38, 2191, @L55,
    'ADJ038', 'Surgical package adjustment',
    3000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId38, @L55,
    'Copay', 1000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId38, 2191, 'PAY-21038-A',
    5000.00, DATEADD(DAY, -7, GETDATE()), GETDATE()
),
(
    @ClaimId38, 2191, 'PAY-21038-B',
    6000.00, DATEADD(DAY, -5, GETDATE()), GETDATE()
),
(
    @ClaimId38, 2191, 'PAY-21038-C',
    4000.00, DATEADD(DAY, -2, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 39
   Overpayment Situation
   Insurance payments exceed the allowed amount.
   ============================================================ */

DECLARE @ClaimId39 INT;
DECLARE @L56 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2183, 26, 1098, 1,
    'Aditya Birla Health Insurance', 'INR',
    DATEADD(DAY, -10, GETDATE()),
    DATEADD(DAY, -8, GETDATE()),
    10000.00, 8500.00, 9000.00, 1500.00, 0.00,
    'Paid', GETDATE()
);

SET @ClaimId39 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId39, 2183, 'Consultation', 'CONS039',
    'Specialist Consultation', 1,
    10000.00, 8500.00, 9000.00, GETDATE()
);

SET @L56 = SCOPE_IDENTITY();

INSERT INTO dbo.ConsultationDetail
(
    LineItemId, AppointmentId, DoctorId,
    VisitType, Notes
)
VALUES
(
    @L56, 2183, 1,
    'Follow-up',
    'Claim with excess insurance payment requiring review'
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId39, 2183, @L56,
    'ADJ039', 'Contractual adjustment',
    1500.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId39, 2183, 'PAY-21039-A',
    5000.00, DATEADD(DAY, -5, GETDATE()), GETDATE()
),
(
    @ClaimId39, 2183, 'PAY-21039-B',
    4000.00, DATEADD(DAY, -2, GETDATE()), GETDATE()
);


/* ============================================================
   SCENARIO 40
   Pending Secondary Insurance
   Primary payer has processed the claim and remaining
   eligible amount is awaiting secondary processing.
   ============================================================ */

DECLARE @ClaimId40 INT;
DECLARE @L57 INT;

INSERT INTO dbo.ClaimMaster
(
    AppointmentId, PatientId, ProfileId, HospitalId,
    InsuranceProvider, CurrencyCode, DateOfService, ClaimDate,
    TotalChargeAmount, TotalAllowedAmount, TotalPaidAmount,
    TotalAdjustmentAmount, TotalPatientResponsibility,
    ClaimStatus, CreatedDate
)
VALUES
(
    2192, 37, 1104, 1,
    'Care Health Insurance', 'INR',
    DATEADD(DAY, -8, GETDATE()),
    DATEADD(DAY, -6, GETDATE()),
    30000.00, 27000.00, 18000.00, 3000.00, 6000.00,
    'Pending Secondary', GETDATE()
);

SET @ClaimId40 = SCOPE_IDENTITY();

INSERT INTO dbo.ClaimLineItem
(
    ClaimId, AppointmentId, ServiceCategory, ServiceCode,
    Description, Units, ChargeAmount, AllowedAmount,
    PaidAmount, CreatedDate
)
VALUES
(
    @ClaimId40, 2192, 'Surgery', 'SURG040',
    'Orthopedic Surgical Procedure', 1,
    30000.00, 27000.00, 18000.00, GETDATE()
);

SET @L57 = SCOPE_IDENTITY();

INSERT INTO dbo.SurgeryDetail
(
    LineItemId, AppointmentId, SurgeonId,
    SurgeryType, DurationMinutes, SurgeryDate
)
VALUES
(
    @L57, 2192, 1,
    'Orthopedic Surgical Procedure', 180,
    DATEADD(DAY, -8, GETDATE())
);

INSERT INTO dbo.ClaimAdjustment
(
    ClaimId, AppointmentId, LineItemId,
    AdjustmentCode, AdjustmentDescription,
    AdjustmentAmount, CreatedDate
)
VALUES
(
    @ClaimId40, 2192, @L57,
    'ADJ040', 'Primary payer contractual adjustment',
    3000.00, GETDATE()
);

INSERT INTO dbo.ClaimPatientResponsibility
(
    ClaimId, LineItemId, Type, Amount, CreatedDate
)
VALUES
(
    @ClaimId40, @L57,
    'Coinsurance', 6000.00, GETDATE()
);

INSERT INTO dbo.ClaimPayment
(
    ClaimId, AppointmentId, PaymentReference,
    PaidAmount, PaymentDate, CreatedDate
)
VALUES
(
    @ClaimId40, 2192, 'PAY-21040-PRIMARY',
    18000.00, DATEADD(DAY, -3, GETDATE()), GETDATE()
);


/* ============================================================
   END OF SCENARIOS 31-40
   ============================================================ */