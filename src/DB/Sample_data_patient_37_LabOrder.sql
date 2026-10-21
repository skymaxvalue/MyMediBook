/* ============================================================
   ADD LAB SAMPLE DATA FOR PATIENT 37
   ============================================================ */

DECLARE @OrderID INT;
DECLARE @OrderTestID1 INT;
DECLARE @OrderTestID2 INT;
DECLARE @OrderTestID3 INT;

-- 1. Create Lab Order
INSERT INTO dbo.LAB_ORDER
(
    Patient_ID,
    Doctor_ID,
    Order_Date,
    Priority,
    Notes,
    Status,
    Created_By,
    Created_Date,
    ProfileId
)
VALUES
(
    37,
    109,
    GETDATE(),
    'Routine',
    'Routine wellness screening',
    'New',
    'Dr.Kevin',
    GETDATE(),
    72
);

SET @OrderID = SCOPE_IDENTITY();


-- 2. Add CBC
INSERT INTO dbo.LAB_ORDER_TEST
(
    Order_ID,
    Test_ID,
    Status,
    Sample_Collected_Date,
    Completed_Date
)
VALUES
(
    @OrderID,
    1,
    'Completed',
    GETDATE(),
    GETDATE()
);

SET @OrderTestID1 = SCOPE_IDENTITY();


-- 3. Add Lipid Profile
INSERT INTO dbo.LAB_ORDER_TEST
(
    Order_ID,
    Test_ID,
    Status,
    Sample_Collected_Date,
    Completed_Date
)
VALUES
(
    @OrderID,
    2,
    'Completed',
    GETDATE(),
    GETDATE()
);

SET @OrderTestID2 = SCOPE_IDENTITY();


-- 4. Add Fasting Blood Sugar
INSERT INTO dbo.LAB_ORDER_TEST
(
    Order_ID,
    Test_ID,
    Status,
    Sample_Collected_Date,
    Completed_Date
)
VALUES
(
    @OrderID,
    3,
    'Completed',
    GETDATE(),
    GETDATE()
);

SET @OrderTestID3 = SCOPE_IDENTITY();


-- 5. Add CBC Result
INSERT INTO dbo.LAB_RESULT
(
    Order_Test_ID,
    Result_Value,
    Units,
    Normal_Range,
    Interpretation,
    Comments,
    Status,
    Entered_Date,
    Component_ID
)
VALUES
(
    @OrderTestID1,
    '13.8',
    'g/dL',
    '12.0-16.0',
    'Normal',
    'Hemoglobin within normal range',
    'Validated',
    GETDATE(),
    NULL
);


-- 6. Add Lipid Result
INSERT INTO dbo.LAB_RESULT
(
    Order_Test_ID,
    Result_Value,
    Units,
    Normal_Range,
    Interpretation,
    Comments,
    Status,
    Entered_Date,
    Component_ID
)
VALUES
(
    @OrderTestID2,
    '185',
    'mg/dL',
    '<200',
    'Normal',
    'Total cholesterol within desirable range',
    'Validated',
    GETDATE(),
    NULL
);


-- 7. Add Blood Sugar Result
INSERT INTO dbo.LAB_RESULT
(
    Order_Test_ID,
    Result_Value,
    Units,
    Normal_Range,
    Interpretation,
    Comments,
    Status,
    Entered_Date,
    Component_ID
)
VALUES
(
    @OrderTestID3,
    '96',
    'mg/dL',
    '70-100',
    'Normal',
    'Fasting blood glucose within normal range',
    'Validated',
    GETDATE(),
    NULL
);


-- 8. Return newly created IDs
SELECT
    @OrderID AS NewOrderID,
    @OrderTestID1 AS CBC_OrderTestID,
    @OrderTestID2 AS Lipid_OrderTestID,
    @OrderTestID3 AS Sugar_OrderTestID;