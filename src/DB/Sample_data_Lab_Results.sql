USE [db53801]
GO

INSERT INTO LAB_RESULT
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
SELECT
    OT.Order_Test_ID,

    CASE C.Component_Name
        WHEN 'Hemoglobin' THEN '15.2'
        WHEN 'WBC Count' THEN '8200'
        WHEN 'Platelet Count' THEN '210000'
        WHEN 'Total Cholesterol' THEN '185'
        WHEN 'HDL' THEN '52'
        WHEN 'LDL' THEN '118'
        WHEN 'Glucose (Fasting)' THEN '92'
        WHEN 'HbA1c Percentage' THEN '5.2'
        WHEN 'TSH' THEN '2.4'
        WHEN 'Serum Creatinine' THEN '0.9'
        WHEN 'Uric Acid' THEN '5.1'
        WHEN 'Vitamin D Level' THEN '32'
        WHEN 'Vitamin B12' THEN '520'
        WHEN 'C-Reactive Protein' THEN '2.1'
        WHEN 'Sodium' THEN '140'
        WHEN 'Potassium' THEN '4.3'
        WHEN 'Calcium' THEN '9.4'
        WHEN 'Triiodothyronine' THEN '120'
        WHEN 'Thyroxine' THEN '8.2'
        ELSE NULL
    END AS Result_Value,

    TM.Units,

    CASE C.Component_Name
        WHEN 'Hemoglobin' THEN '13-17 g/dL'
        WHEN 'WBC Count' THEN '4k-11k cells/µL'
        WHEN 'Platelet Count' THEN '150k-450k /µL'
        ELSE TM.Normal_Range_Male
    END AS Normal_Range,

    'Normal' AS Interpretation,

    'Dummy test result for API testing' AS Comments,

    'Entered' AS Status,

    GETDATE() AS Entered_Date,

    C.Component_ID

FROM LAB_ORDER_TEST OT

INNER JOIN LAB_TEST_MASTER TM
    ON OT.Test_ID = TM.Test_ID

INNER JOIN LAB_TEST_COMPONENT C
    ON OT.Test_ID = C.Test_ID

WHERE OT.Order_Test_ID <= 81

  AND NOT EXISTS
  (
      SELECT 1
      FROM LAB_RESULT LR
      WHERE LR.Order_Test_ID = OT.Order_Test_ID
        AND LR.Component_ID = C.Component_ID
  );