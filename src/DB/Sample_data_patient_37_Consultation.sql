USE [db53801]
GO

BEGIN TRY
    BEGIN TRANSACTION;

    DECLARE @ConsultationID INT;
    DECLARE @PrescriptionID INT;

    -- 1. Create Consultation for Patient 37
    INSERT INTO dbo.Consultation
    (
        ConsultationNumber,
        PatientID,
        DoctorID,
        VisitTypeID,
        ConsultationDate,
        ChiefComplaint,
        PresentIllness,
        PhysicalExam,
        AssessmentPlan,
        FollowUpDays,
        ConsultationStatus,
        CreatedAt,
        UpdatedAt
    )
    VALUES
    (
        'CONS-P37-001',
        37,
        1,
        1,
        GETDATE(),
        'Routine health checkup',
        'Patient reports mild fever and seasonal allergy symptoms.',
        'Temperature slightly elevated. General examination normal.',
        'Prescribed medication for fever and allergy symptoms.',
        7,
        'Completed',
        GETDATE(),
        GETDATE()
    );

    SET @ConsultationID = SCOPE_IDENTITY();

    -- 2. Create Prescription
    INSERT INTO dbo.Prescription
    (
        RxNumber,
        ConsultationID,
        PatientID,
        DoctorID,
        PharmacyID,
        PrescribedDate,
        StatusID,
        IsElectronic,
        SpecialInstructions,
        Notes,
        CreatedAt,
        UpdatedAt
    )
    VALUES
    (
        'RX-P37-001',
        @ConsultationID,
        37,
        1,
        1,
        GETDATE(),
        1,
        0,
        'Take medicines as prescribed.',
        'Routine prescription sample data for Patient 37.',
        GETDATE(),
        GETDATE()
    );

    SET @PrescriptionID = SCOPE_IDENTITY();

    -- 3. Add Prescription Items

    -- Paracetamol
    INSERT INTO dbo.PrescriptionItem
    (
        PrescriptionID,
        MedicationID,
        FrequencyID,
        DosageAmount,
        DurationDays,
        QuantityDispensed,
        RefillsAllowed,
        RefillsRemaining,
        StartDate,
        EndDate,
        DoctorSig,
        SubstitutionAllowed,
        PriorAuthNumber,
        Notes,
        CreatedAt
    )
    VALUES
    (
        @PrescriptionID,
        1,
        1,
        '500 mg',
        5,
        5,
        0,
        0,
        CAST(GETDATE() AS DATE),
        DATEADD(DAY, 4, CAST(GETDATE() AS DATE)),
        'Rajesh Kumar',
        1,
        NULL,
        'Take once daily after food.',
        GETDATE()
    );

    -- Amoxicillin
    INSERT INTO dbo.PrescriptionItem
    (
        PrescriptionID,
        MedicationID,
        FrequencyID,
        DosageAmount,
        DurationDays,
        QuantityDispensed,
        RefillsAllowed,
        RefillsRemaining,
        StartDate,
        EndDate,
        DoctorSig,
        SubstitutionAllowed,
        PriorAuthNumber,
        Notes,
        CreatedAt
    )
    VALUES
    (
        @PrescriptionID,
        2,
        2,
        '250 mg',
        5,
        10,
        0,
        0,
        CAST(GETDATE() AS DATE),
        DATEADD(DAY, 4, CAST(GETDATE() AS DATE)),
        'Rajesh Kumar',
        1,
        NULL,
        'Take twice daily after food.',
        GETDATE()
    );

    -- Zyrtec
    INSERT INTO dbo.PrescriptionItem
    (
        PrescriptionID,
        MedicationID,
        FrequencyID,
        DosageAmount,
        DurationDays,
        QuantityDispensed,
        RefillsAllowed,
        RefillsRemaining,
        StartDate,
        EndDate,
        DoctorSig,
        SubstitutionAllowed,
        PriorAuthNumber,
        Notes,
        CreatedAt
    )
    VALUES
    (
        @PrescriptionID,
        3,
        1,
        '10 mg',
        5,
        5,
        0,
        0,
        CAST(GETDATE() AS DATE),
        DATEADD(DAY, 4, CAST(GETDATE() AS DATE)),
        'Rajesh Kumar',
        1,
        NULL,
        'Take once daily at night.',
        GETDATE()
    );

    COMMIT TRANSACTION;

    PRINT 'Prescription sample data created successfully.';
    PRINT 'ConsultationID = ' + CAST(@ConsultationID AS VARCHAR(20));
    PRINT 'PrescriptionID = ' + CAST(@PrescriptionID AS VARCHAR(20));

END TRY
BEGIN CATCH

    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;

END CATCH;
GO