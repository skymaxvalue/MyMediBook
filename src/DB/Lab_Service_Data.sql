USE db53801
GO

-- ======================================
-- SECTION 4 : LAB ORDER DATA
-- ======================================

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status, Created_By)
VALUES
(5,101,'2026-06-07 10:00','Routine','Routine thyroid checkup','New','Dr.James'),

(5,102,'2026-06-07 11:15','STAT','Diabetic monitoring','New','Dr.Sarah'),

(5,103,'2026-06-07 12:30','Routine','Vitamin deficiency assessment','New','Dr.Robert');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status, Created_By)
VALUES
(5,104,GETDATE(),'Routine','General health screening','New','Dr.Emily'),

(5,105,GETDATE(),'STAT','Thyroid profile follow-up','New','Dr.Michael'),

(5,106,GETDATE(),'Routine','Kidney function assessment','New','Dr.Priya'),

(5,107,GETDATE(),'STAT','Vitamin B12 deficiency check','New','Dr.David'),

(5,108,GETDATE(),'Routine','Inflammation marker evaluation','New','Dr.Lisa'),

(5,109,GETDATE(),'STAT','Electrolyte imbalance investigation','New','Dr.Kevin');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status, Created_By)
VALUES
(6,110,GETDATE(),'Routine','Annual health screening','New','Dr.Arun'),

(7,111,GETDATE(),'STAT','Kidney function assessment','New','Dr.Priya'),

(8,112,GETDATE(),'Routine','Vitamin deficiency evaluation','New','Dr.Rajesh'),

(9,113,GETDATE(),'STAT','Thyroid profile','New','Dr.Kumar'),

(10,114,GETDATE(),'Routine','Inflammation screening','New','Dr.Suresh');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status, Created_By)
VALUES

(11,115,GETDATE(),'Routine','Annual health screening','New','Dr.Rajesh'),

(12,116,GETDATE(),'STAT','Kidney function assessment','New','Dr.Priya'),

(13,117,GETDATE(),'Routine','Thyroid and vitamin profile','New','Dr.Sarah'),

(14,118,GETDATE(),'Routine','General wellness profile','New','Dr.James'),

(14,118,GETDATE(),'STAT','Follow-up investigation','New','Dr.James'),

(15,119,GETDATE(),'Routine','Electrolyte evaluation','New','Dr.Emily'),

(16,120,GETDATE(),'STAT','Emergency inflammatory profile','New','Dr.David'),

(17,121,GETDATE(),'Routine','Diabetic profile','New','Dr.Kevin'),

(18,122,GETDATE(),'Routine','Thyroid profile','New','Dr.Lisa'),

(19,123,GETDATE(),'STAT','Kidney function profile','New','Dr.Robert'),

(20,124,GETDATE(),'Routine','Inflammatory profile','New','Dr.Michael');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status)
VALUES
(51,3001,GETDATE(),'Routine','Diabetes Profile','Completed'),
(52,3002,GETDATE(),'Routine','Thyroid Profile','Completed'),
(53,3003,GETDATE(),'Routine','Kidney Profile','Completed'),
(54,3004,GETDATE(),'Routine','Vitamin Profile','Completed'),
(55,3005,GETDATE(),'Routine','Cardiac Profile','Completed');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status)
VALUES

(61,3001,GETDATE(),'Routine','General Health Profile','Completed'),
(62,3002,GETDATE(),'Routine','Inflammatory Profile','Completed'),
(63,3003,GETDATE(),'Routine','Electrolyte Profile','Completed'),
(64,3004,GETDATE(),'Routine','Bone Health Profile','Completed'),
(65,3005,GETDATE(),'Routine','Liver Function Profile','Completed');

INSERT INTO LAB_ORDER
(Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status)
VALUES

(71,3001,GETDATE(),'Routine','Diabetes Follow-up','Completed'),
(72,3002,GETDATE(),'Routine','Thyroid Follow-up','Completed'),
(73,3003,GETDATE(),'Routine','Vitamin Follow-up','Completed'),
(74,3004,GETDATE(),'Routine','Kidney Follow-up','Completed'),
(75,3005,GETDATE(),'Routine','Cardiac Follow-up','Completed');

-- ======================================
-- SECTION 5 : LAB ORDER TEST DATA
-- ======================================

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES
(2,5,'Pending'),
(3,4,'Pending'),
(4,7,'Pending');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES
(5,9,'Pending'),
(5,10,'Pending'),

(6,11,'Pending'),
(6,12,'Pending'),

(7,13,'Pending'),
(7,14,'Pending'),

(8,15,'Pending');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES
(11,1,'Pending'),
(11,2,'Pending'),
(11,3,'Pending'),
(11,4,'Pending'),

(12,6,'Pending'),
(12,11,'Pending'),
(12,12,'Pending'),
(12,13,'Pending'),

(13,7,'Pending'),
(13,14,'Pending'),
(13,15,'Pending'),

(14,5,'Pending'),
(14,8,'Pending'),
(14,9,'Pending'),

(15,1,'Pending'),
(15,10,'Pending'),
(15,15,'Pending');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES

-- Order 16 (Patient 11)
(16,1,'Pending'),
(16,2,'Pending'),
(16,3,'Pending'),
(16,4,'Pending'),

-- Order 17 (Patient 12)
(17,6,'Pending'),
(17,11,'Pending'),
(17,12,'Pending'),
(17,13,'Pending'),
(17,14,'Pending'),

-- Order 18 (Patient 13)
(18,7,'Pending'),
(18,5,'Pending'),
(18,8,'Pending'),
(18,9,'Pending'),
(18,15,'Pending'),

-- Order 19 (Patient 14)
(19,1,'Pending'),
(19,10,'Pending'),

-- Order 20 (Patient 14)
(20,2,'Pending'),
(20,3,'Pending'),

-- Order 21 (Patient 15)
(21,6,'Pending'),
(21,11,'Pending'),
(21,12,'Pending'),

-- Order 22 (Patient 16)
(22,1,'Pending'),
(22,15,'Pending'),
(22,7,'Pending'),
(22,13,'Pending'),

-- Order 23 (Patient 17)
(23,3,'Pending'),
(23,4,'Pending'),
(23,2,'Pending'),

-- Order 24 (Patient 18)
(24,5,'Pending'),
(24,8,'Pending'),
(24,9,'Pending'),

-- Order 25 (Patient 19)
(25,6,'Pending'),
(25,12,'Pending'),
(25,13,'Pending'),
(25,10,'Pending'),

-- Order 26 (Patient 20)
(26,1,'Pending'),
(26,15,'Pending'),
(26,14,'Pending');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES

-- Order 28 : Patient 21 - Diabetes Profile
(28,3,'Pending'),
(28,4,'Pending'),
(28,2,'Pending'),
(28,6,'Pending'),

-- Order 29 : Patient 22 - Thyroid Profile
(29,5,'Pending'),
(29,8,'Pending'),
(29,9,'Pending'),

-- Order 30 : Patient 23 - Kidney Profile
(30,6,'Pending'),
(30,11,'Pending'),
(30,12,'Pending'),
(30,13,'Pending'),

-- Order 31 : Patient 24 - Vitamin Profile
(31,7,'Pending'),
(31,14,'Pending'),
(31,1,'Pending'),

-- Order 32 : Patient 25 - Inflammatory Profile
(32,1,'Pending'),
(32,15,'Pending'),
(32,10,'Pending'),

-- Order 33 : Patient 26 - General Health Profile
(33,1,'Pending'),
(33,3,'Pending'),
(33,2,'Pending'),
(33,6,'Pending'),
(33,11,'Pending'),

-- Order 34 : Patient 27 - Diabetes Follow-up
(34,3,'Pending'),
(34,4,'Pending'),
(34,2,'Pending'),

-- Order 35 : Patient 28 - Cardiac Profile
(35,1,'Pending'),
(35,2,'Pending'),
(35,15,'Pending'),

-- Order 36 : Patient 29 - Vitamin Profile
(36,7,'Pending'),
(36,14,'Pending'),
(36,1,'Pending'),
(36,11,'Pending'),

-- Order 37 : Patient 30 - Mixed Profile
(37,5,'Pending'),
(37,8,'Pending'),
(37,9,'Pending'),
(37,7,'Pending');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES

-- Patient 51 : Diabetes Profile
(38,3,'Completed'),
(38,4,'Completed'),
(38,2,'Completed'),
(38,6,'Completed'),

-- Patient 52 : Thyroid Profile
(39,5,'Completed'),
(39,8,'Completed'),
(39,9,'Completed'),

-- Patient 53 : Kidney Profile
(40,6,'Completed'),
(40,11,'Completed'),
(40,12,'Completed'),
(40,13,'Completed'),

-- Patient 54 : Vitamin Profile
(41,7,'Completed'),
(41,14,'Completed'),
(41,1,'Completed'),

-- Patient 55 : Cardiac Profile
(42,1,'Completed'),
(42,2,'Completed'),
(42,15,'Completed');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES

-- Patient 61 : General Health Profile
(43,1,'Completed'),
(43,3,'Completed'),
(43,2,'Completed'),
(43,6,'Completed'),
(43,11,'Completed'),

-- Patient 62 : Inflammatory Profile
(44,1,'Completed'),
(44,15,'Completed'),
(44,10,'Completed'),

-- Patient 63 : Electrolyte Profile
(45,11,'Completed'),
(45,12,'Completed'),
(45,13,'Completed'),

-- Patient 64 : Bone Health Profile
(46,7,'Completed'),
(46,11,'Completed'),
(46,14,'Completed'),

-- Patient 65 : Liver Function Profile
(47,1,'Completed'),
(47,6,'Completed'),
(47,10,'Completed'),
(47,15,'Completed');

INSERT INTO LAB_ORDER_TEST
(Order_ID, Test_ID, Status)
VALUES

-- Patient 71 : Diabetes Follow-up
(48,3,'Completed'),
(48,4,'Completed'),
(48,2,'Completed'),

-- Patient 72 : Thyroid Follow-up
(49,5,'Completed'),
(49,8,'Completed'),
(49,9,'Completed'),

-- Patient 73 : Vitamin Follow-up
(50,7,'Completed'),
(50,14,'Completed'),
(50,1,'Completed'),

-- Patient 74 : Kidney Follow-up
(51,6,'Completed'),
(51,11,'Completed'),
(51,12,'Completed'),
(51,13,'Completed'),

-- Patient 75 : Cardiac Follow-up
(52,1,'Completed'),
(52,2,'Completed'),
(52,15,'Completed');

-- ======================================
-- SECTION 6 : SAMPLE DATA
-- ======================================

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES
(4, 2, 'LAB-2026-0002-TSH', '2026-06-07 10:15', 'Tech.John', 'Collected'),

(5, 1, 'LAB-2026-0003-HBA1C', '2026-06-07 11:30', 'Tech.John', 'Collected'),

(6, 2, 'LAB-2026-0004-VITD', '2026-06-07 12:45', 'Tech.Mary', 'Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES
(14,1,'LAB-2026-0014-CBC','2026-06-17 09:15','Tech.John','Collected'),
(15,2,'LAB-2026-0015-LIPID','2026-06-17 09:20','Tech.John','Collected'),
(16,2,'LAB-2026-0016-FBS','2026-06-17 09:25','Tech.John','Collected'),
(17,1,'LAB-2026-0017-HBA1C','2026-06-17 09:30','Tech.Mary','Collected'),

(18,2,'LAB-2026-0018-CREAT','2026-06-17 10:00','Tech.Mary','Collected'),
(19,2,'LAB-2026-0019-CAL','2026-06-17 10:05','Tech.Mary','Collected'),
(20,2,'LAB-2026-0020-NA','2026-06-17 10:10','Tech.John','Collected'),
(21,2,'LAB-2026-0021-K','2026-06-17 10:15','Tech.John','Collected'),

(22,2,'LAB-2026-0022-VITD','2026-06-17 11:00','Tech.Mary','Collected'),
(23,2,'LAB-2026-0023-B12','2026-06-17 11:05','Tech.Mary','Collected'),
(24,2,'LAB-2026-0024-CRP','2026-06-17 11:10','Tech.John','Collected'),

(25,2,'LAB-2026-0025-TSH','2026-06-17 12:00','Tech.John','Collected'),
(26,2,'LAB-2026-0026-T3','2026-06-17 12:05','Tech.John','Collected'),
(27,2,'LAB-2026-0027-T4','2026-06-17 12:10','Tech.Mary','Collected'),

(28,1,'LAB-2026-0028-CBC','2026-06-17 13:00','Tech.Mary','Collected'),
(29,2,'LAB-2026-0029-URIC','2026-06-17 13:05','Tech.John','Collected'),
(30,2,'LAB-2026-0030-CRP','2026-06-17 13:10','Tech.John','Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES

(31,1,'LAB-2026-0031-CBC','2026-06-18 09:00','Tech.John','Collected'),
(32,2,'LAB-2026-0032-LIPID','2026-06-18 09:05','Tech.John','Collected'),
(33,2,'LAB-2026-0033-FBS','2026-06-18 09:10','Tech.John','Collected'),
(34,1,'LAB-2026-0034-HBA1C','2026-06-18 09:15','Tech.Mary','Collected'),

(35,2,'LAB-2026-0035-CREAT','2026-06-18 09:30','Tech.Mary','Collected'),
(36,2,'LAB-2026-0036-CAL','2026-06-18 09:35','Tech.Mary','Collected'),
(37,2,'LAB-2026-0037-NA','2026-06-18 09:40','Tech.John','Collected'),
(38,2,'LAB-2026-0038-K','2026-06-18 09:45','Tech.John','Collected'),
(39,2,'LAB-2026-0039-B12','2026-06-18 09:50','Tech.Mary','Collected'),
(40,2,'LAB-2026-0040-VITD','2026-06-18 10:00','Tech.John','Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES

(69,1,'LAB-2026-0069','2026-06-18 09:00','Tech.John','Collected'),
(70,1,'LAB-2026-0070','2026-06-18 09:05','Tech.John','Collected'),
(71,1,'LAB-2026-0071','2026-06-18 09:10','Tech.John','Collected'),
(72,2,'LAB-2026-0072','2026-06-18 09:15','Tech.Mary','Collected'),

(73,2,'LAB-2026-0073','2026-06-18 09:20','Tech.Mary','Collected'),
(74,2,'LAB-2026-0074','2026-06-18 09:25','Tech.Mary','Collected'),
(75,2,'LAB-2026-0075','2026-06-18 09:30','Tech.Mary','Collected'),

(76,1,'LAB-2026-0076','2026-06-18 09:35','Tech.John','Collected'),
(77,1,'LAB-2026-0077','2026-06-18 09:40','Tech.John','Collected'),
(78,1,'LAB-2026-0078','2026-06-18 09:45','Tech.John','Collected'),
(79,1,'LAB-2026-0079','2026-06-18 09:50','Tech.John','Collected'),

(80,2,'LAB-2026-0080','2026-06-18 09:55','Tech.Mary','Collected'),
(81,2,'LAB-2026-0081','2026-06-18 10:00','Tech.Mary','Collected'),
(82,1,'LAB-2026-0082','2026-06-18 10:05','Tech.Mary','Collected'),

(83,1,'LAB-2026-0083','2026-06-18 10:10','Tech.John','Collected'),
(84,1,'LAB-2026-0084','2026-06-18 10:15','Tech.John','Collected'),
(85,1,'LAB-2026-0085','2026-06-18 10:20','Tech.John','Collected'),

(86,1,'LAB-2026-0086','2026-06-18 10:25','Tech.Mary','Collected'),
(87,1,'LAB-2026-0087','2026-06-18 10:30','Tech.Mary','Collected'),
(88,1,'LAB-2026-0088','2026-06-18 10:35','Tech.Mary','Collected'),
(89,1,'LAB-2026-0089','2026-06-18 10:40','Tech.Mary','Collected'),
(90,1,'LAB-2026-0090','2026-06-18 10:45','Tech.Mary','Collected'),

(91,1,'LAB-2026-0091','2026-06-18 10:50','Tech.John','Collected'),
(92,1,'LAB-2026-0092','2026-06-18 10:55','Tech.John','Collected'),
(93,1,'LAB-2026-0093','2026-06-18 11:00','Tech.John','Collected'),

(94,1,'LAB-2026-0094','2026-06-18 11:05','Tech.Mary','Collected'),
(95,1,'LAB-2026-0095','2026-06-18 11:10','Tech.Mary','Collected'),
(96,1,'LAB-2026-0096','2026-06-18 11:15','Tech.Mary','Collected'),

(97,2,'LAB-2026-0097','2026-06-18 11:20','Tech.John','Collected'),
(98,2,'LAB-2026-0098','2026-06-18 11:25','Tech.John','Collected'),
(99,1,'LAB-2026-0099','2026-06-18 11:30','Tech.John','Collected'),
(100,1,'LAB-2026-0100','2026-06-18 11:35','Tech.John','Collected'),

(101,2,'LAB-2026-0101','2026-06-18 11:40','Tech.Mary','Collected'),
(102,2,'LAB-2026-0102','2026-06-18 11:45','Tech.Mary','Collected'),
(103,2,'LAB-2026-0103','2026-06-18 11:50','Tech.Mary','Collected'),
(104,2,'LAB-2026-0104','2026-06-18 11:55','Tech.Mary','Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES

(105,1,'LAB-2026-0105','2026-06-22 09:00','Tech.John','Collected'),
(106,1,'LAB-2026-0106','2026-06-22 09:05','Tech.John','Collected'),
(107,1,'LAB-2026-0107','2026-06-22 09:10','Tech.John','Collected'),
(108,1,'LAB-2026-0108','2026-06-22 09:15','Tech.John','Collected'),

(109,2,'LAB-2026-0109','2026-06-22 09:20','Tech.Mary','Collected'),
(110,2,'LAB-2026-0110','2026-06-22 09:25','Tech.Mary','Collected'),
(111,2,'LAB-2026-0111','2026-06-22 09:30','Tech.Mary','Collected'),

(112,1,'LAB-2026-0112','2026-06-22 09:35','Tech.John','Collected'),
(113,1,'LAB-2026-0113','2026-06-22 09:40','Tech.John','Collected'),
(114,1,'LAB-2026-0114','2026-06-22 09:45','Tech.John','Collected'),
(115,1,'LAB-2026-0115','2026-06-22 09:50','Tech.John','Collected'),

(116,2,'LAB-2026-0116','2026-06-22 09:55','Tech.Mary','Collected'),
(117,2,'LAB-2026-0117','2026-06-22 10:00','Tech.Mary','Collected'),
(118,1,'LAB-2026-0118','2026-06-22 10:05','Tech.Mary','Collected'),

(119,1,'LAB-2026-0119','2026-06-22 10:10','Tech.John','Collected'),
(120,1,'LAB-2026-0120','2026-06-22 10:15','Tech.John','Collected'),
(121,1,'LAB-2026-0121','2026-06-22 10:20','Tech.John','Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES

(122,1,'LAB-2026-0122','2026-06-22 11:00','Tech.John','Collected'),
(123,1,'LAB-2026-0123','2026-06-22 11:05','Tech.John','Collected'),
(124,1,'LAB-2026-0124','2026-06-22 11:10','Tech.John','Collected'),
(125,1,'LAB-2026-0125','2026-06-22 11:15','Tech.John','Collected'),
(126,1,'LAB-2026-0126','2026-06-22 11:20','Tech.John','Collected'),

(127,1,'LAB-2026-0127','2026-06-22 11:25','Tech.Mary','Collected'),
(128,1,'LAB-2026-0128','2026-06-22 11:30','Tech.Mary','Collected'),
(129,1,'LAB-2026-0129','2026-06-22 11:35','Tech.Mary','Collected'),

(130,1,'LAB-2026-0130','2026-06-22 11:40','Tech.John','Collected'),
(131,1,'LAB-2026-0131','2026-06-22 11:45','Tech.John','Collected'),
(132,1,'LAB-2026-0132','2026-06-22 11:50','Tech.John','Collected'),

(133,1,'LAB-2026-0133','2026-06-22 11:55','Tech.Mary','Collected'),
(134,1,'LAB-2026-0134','2026-06-22 12:00','Tech.Mary','Collected'),
(135,1,'LAB-2026-0135','2026-06-22 12:05','Tech.Mary','Collected'),

(136,1,'LAB-2026-0136','2026-06-22 12:10','Tech.John','Collected'),
(137,1,'LAB-2026-0137','2026-06-22 12:15','Tech.John','Collected'),
(138,1,'LAB-2026-0138','2026-06-22 12:20','Tech.John','Collected'),
(139,1,'LAB-2026-0139','2026-06-22 12:25','Tech.John','Collected');

INSERT INTO SAMPLE
(Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
VALUES

(140,1,'LAB-2026-0140','2026-06-22 13:00','Tech.John','Collected'),
(141,1,'LAB-2026-0141','2026-06-22 13:05','Tech.John','Collected'),
(142,1,'LAB-2026-0142','2026-06-22 13:10','Tech.John','Collected'),

(143,2,'LAB-2026-0143','2026-06-22 13:15','Tech.Mary','Collected'),
(144,2,'LAB-2026-0144','2026-06-22 13:20','Tech.Mary','Collected'),
(145,2,'LAB-2026-0145','2026-06-22 13:25','Tech.Mary','Collected'),

(146,1,'LAB-2026-0146','2026-06-22 13:30','Tech.John','Collected'),
(147,1,'LAB-2026-0147','2026-06-22 13:35','Tech.John','Collected'),
(148,1,'LAB-2026-0148','2026-06-22 13:40','Tech.John','Collected'),

(149,1,'LAB-2026-0149','2026-06-22 13:45','Tech.Mary','Collected'),
(150,1,'LAB-2026-0150','2026-06-22 13:50','Tech.Mary','Collected'),
(151,1,'LAB-2026-0151','2026-06-22 13:55','Tech.Mary','Collected'),
(152,1,'LAB-2026-0152','2026-06-22 14:00','Tech.Mary','Collected'),

(153,1,'LAB-2026-0153','2026-06-22 14:05','Tech.John','Collected'),
(154,1,'LAB-2026-0154','2026-06-22 14:10','Tech.John','Collected'),
(155,1,'LAB-2026-0155','2026-06-22 14:15','Tech.John','Collected');

-- ======================================
-- SECTION 7 : LAB RESULT DATA
-- ======================================

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

(4,
'2.8 mIU/L',
'mIU/L',
'0.4 - 4.0 mIU/L',
'Normal',
'Thyroid function within normal limits',
'Validated'),

(5,
'5.3 %',
'%',
'4.0 - 5.6 %',
'Normal',
'Good glycemic control',
'Validated'),

(6,
'32 ng/mL',
'ng/mL',
'20 - 50 ng/mL',
'Normal',
'Vitamin D level is adequate',
'Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

(14,'14.2 g/dL','g/dL','13-17 g/dL','Normal','CBC within normal range','Validated'),
(15,'180 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(16,'92 mg/dL','mg/dL','70-100 mg/dL','Normal','Fasting blood sugar normal','Validated'),
(17,'5.4 %','%','4.0-5.6 %','Normal','HbA1c normal','Validated'),

(18,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Kidney function normal','Validated'),
(19,'9.2 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium level normal','Validated'),
(20,'140 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium level normal','Validated'),
(21,'4.1 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium level normal','Validated'),

(22,'35 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(23,'350 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),
(24,'2.5 mg/L','mg/L','0-5 mg/L','Normal','Inflammation marker normal','Validated'),

(25,'2.9 mIU/L','mIU/L','0.4-4.0 mIU/L','Normal','TSH level normal','Validated'),
(26,'130 ng/dL','ng/dL','80-200 ng/dL','Normal','T3 level normal','Validated'),
(27,'8.5 ug/dL','ug/dL','5-12 ug/dL','Normal','T4 level normal','Validated'),

(28,'13.8 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(29,'5.8 mg/dL','mg/dL','3.5-7.2 mg/dL','Normal','Uric acid normal','Validated'),
(30,'1.8 mg/L','mg/L','0-5 mg/L','Normal','CRP level normal','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range,
 Interpretation, Comments, Status)
VALUES

(31,'13.9 g/dL','g/dL','13-17 g/dL','Normal','CBC within normal range','Validated'),

(32,'170 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),

(33,'94 mg/dL','mg/dL','70-100 mg/dL','Normal','Fasting blood sugar normal','Validated'),

(34,'5.2 %','%','4.0-5.6 %','Normal','HbA1c normal','Validated'),

(35,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Kidney function normal','Validated'),

(36,'9.3 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium level normal','Validated'),

(37,'140 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium level normal','Validated'),

(38,'4.2 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium level normal','Validated'),

(39,'360 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),

(40,'34 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

-- Patient 21 : Diabetes Profile
(69,'95 mg/dL','mg/dL','70-100 mg/dL','Normal','Fasting blood sugar normal','Validated'),
(70,'5.5 %','%','4.0-5.6 %','Normal','HbA1c within normal range','Validated'),
(71,'175 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(72,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Kidney function normal','Validated'),

-- Patient 22 : Thyroid Profile
(73,'2.8 mIU/L','mIU/L','0.4-4.0 mIU/L','Normal','TSH level normal','Validated'),
(74,'135 ng/dL','ng/dL','80-200 ng/dL','Normal','T3 level normal','Validated'),
(75,'8.7 ug/dL','ug/dL','5-12 ug/dL','Normal','T4 level normal','Validated'),

-- Patient 23 : Kidney Profile
(76,'1.0 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(77,'9.1 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium level normal','Validated'),
(78,'139 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium level normal','Validated'),
(79,'4.2 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium level normal','Validated'),

-- Patient 24 : Vitamin Profile
(80,'34 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(81,'420 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),
(82,'14.1 g/dL','g/dL','13-17 g/dL','Normal','CBC within normal range','Validated'),

-- Patient 25 : Inflammatory Profile
(83,'13.8 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(84,'2.1 mg/L','mg/L','0-5 mg/L','Normal','CRP level normal','Validated'),
(85,'5.6 mg/dL','mg/dL','3.5-7.2 mg/dL','Normal','Uric acid normal','Validated'),

-- Patient 26 : General Health Profile
(86,'13.9 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

-- Patient 26 : General Health Profile (continued)
(87,'92 mg/dL','mg/dL','70-100 mg/dL','Normal','Fasting blood sugar normal','Validated'),
(88,'180 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(89,'0.8 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(90,'9.3 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium level normal','Validated'),

-- Patient 27 : Diabetes Follow-up
(91,'96 mg/dL','mg/dL','70-100 mg/dL','Normal','FBS normal','Validated'),
(92,'5.4 %','%','4.0-5.6 %','Normal','HbA1c normal','Validated'),
(93,'172 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),

-- Patient 28 : Cardiac Profile
(94,'14.0 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(95,'178 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(96,'2.3 mg/L','mg/L','0-5 mg/L','Normal','CRP normal','Validated'),

-- Patient 29 : Vitamin Profile
(97,'36 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(98,'390 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),
(99,'13.7 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(100,'9.0 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium level normal','Validated'),

-- Patient 30 : Mixed Profile
(101,'2.7 mIU/L','mIU/L','0.4-4.0 mIU/L','Normal','TSH normal','Validated'),
(102,'128 ng/dL','ng/dL','80-200 ng/dL','Normal','T3 normal','Validated'),
(103,'8.2 ug/dL','ug/dL','5-12 ug/dL','Normal','T4 normal','Validated'),
(104,'33 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

(105,'94 mg/dL','mg/dL','70-100 mg/dL','Normal','FBS normal','Validated'),
(106,'5.3 %','%','4.0-5.6 %','Normal','HbA1c normal','Validated'),
(107,'176 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(108,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),

(109,'2.7 mIU/L','mIU/L','0.4-4.0 mIU/L','Normal','TSH normal','Validated'),
(110,'132 ng/dL','ng/dL','80-200 ng/dL','Normal','T3 normal','Validated'),
(111,'8.4 ug/dL','ug/dL','5-12 ug/dL','Normal','T4 normal','Validated'),

(112,'1.0 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(113,'9.1 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium normal','Validated'),
(114,'139 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium normal','Validated'),
(115,'4.2 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium normal','Validated'),

(116,'35 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(117,'410 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),
(118,'14.0 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),

(119,'13.8 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(120,'178 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(121,'2.2 mg/L','mg/L','0-5 mg/L','Normal','CRP normal','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

(122,'13.9 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(123,'95 mg/dL','mg/dL','70-100 mg/dL','Normal','FBS normal','Validated'),
(124,'180 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(125,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(126,'9.2 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium normal','Validated'),

(127,'14.0 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(128,'2.1 mg/L','mg/L','0-5 mg/L','Normal','CRP normal','Validated'),
(129,'5.8 mg/dL','mg/dL','3.5-7.2 mg/dL','Normal','Uric acid normal','Validated'),

(130,'9.1 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium normal','Validated'),
(131,'139 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium normal','Validated'),
(132,'4.2 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium normal','Validated'),

(133,'34 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(134,'9.0 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium normal','Validated'),
(135,'420 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),

(136,'13.8 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(137,'0.8 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(138,'5.7 mg/dL','mg/dL','3.5-7.2 mg/dL','Normal','Uric acid normal','Validated'),
(139,'2.3 mg/L','mg/L','0-5 mg/L','Normal','CRP normal','Validated');

INSERT INTO LAB_RESULT
(Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
VALUES

(140,'96 mg/dL','mg/dL','70-100 mg/dL','Normal','FBS normal','Validated'),
(141,'5.4 %','%','4.0-5.6 %','Normal','HbA1c normal','Validated'),
(142,'182 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),

(143,'2.9 mIU/L','mIU/L','0.4-4.0 mIU/L','Normal','TSH normal','Validated'),
(144,'130 ng/dL','ng/dL','80-200 ng/dL','Normal','T3 normal','Validated'),
(145,'8.6 ug/dL','ug/dL','5-12 ug/dL','Normal','T4 normal','Validated'),

(146,'36 ng/mL','ng/mL','20-50 ng/mL','Normal','Vitamin D adequate','Validated'),
(147,'415 pg/mL','pg/mL','200-900 pg/mL','Normal','Vitamin B12 normal','Validated'),
(148,'14.1 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),

(149,'0.9 mg/dL','mg/dL','0.7-1.3 mg/dL','Normal','Creatinine normal','Validated'),
(150,'9.2 mg/dL','mg/dL','8.5-10.5 mg/dL','Normal','Calcium normal','Validated'),
(151,'140 mmol/L','mmol/L','135-145 mmol/L','Normal','Sodium normal','Validated'),
(152,'4.3 mmol/L','mmol/L','3.5-5.0 mmol/L','Normal','Potassium normal','Validated'),

(153,'13.9 g/dL','g/dL','13-17 g/dL','Normal','CBC normal','Validated'),
(154,'177 mg/dL','mg/dL','<200 mg/dL','Normal','Lipid profile normal','Validated'),
(155,'2.4 mg/L','mg/L','0-5 mg/L','Normal','CRP normal','Validated');

-- ======================================
-- SECTION 8 : DOCTOR NOTIFICATION DATA
-- ======================================

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(4, 3002,
'2026-06-07 15:00',
'Sent',
4,
'2026-06-07 15:05',
'Sent'),

(5, 3001,
'2026-06-07 16:00',
'Sent',
5,
'2026-06-07 16:05',
'Sent'),

(6, 3003,
'2026-06-07 17:00',
'Sent',
6,
'2026-06-07 17:05',
'Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(14,3001,'2026-06-17 15:00','Sent',14,'2026-06-17 15:05','Sent'),
(15,3001,'2026-06-17 15:10','Sent',15,'2026-06-17 15:15','Sent'),
(16,3001,'2026-06-17 15:20','Sent',16,'2026-06-17 15:25','Sent'),
(17,3001,'2026-06-17 15:30','Sent',17,'2026-06-17 15:35','Sent'),

(18,3002,'2026-06-17 16:00','Sent',18,'2026-06-17 16:05','Sent'),
(19,3002,'2026-06-17 16:10','Sent',19,'2026-06-17 16:15','Sent'),
(20,3002,'2026-06-17 16:20','Sent',20,'2026-06-17 16:25','Sent'),
(21,3002,'2026-06-17 16:30','Sent',21,'2026-06-17 16:35','Sent'),

(22,3003,'2026-06-17 17:00','Sent',22,'2026-06-17 17:05','Sent'),
(23,3003,'2026-06-17 17:10','Sent',23,'2026-06-17 17:15','Sent'),
(24,3003,'2026-06-17 17:20','Sent',24,'2026-06-17 17:25','Sent'),

(25,3004,'2026-06-17 18:00','Sent',25,'2026-06-17 18:05','Sent'),
(26,3004,'2026-06-17 18:10','Sent',26,'2026-06-17 18:15','Sent'),
(27,3004,'2026-06-17 18:20','Sent',27,'2026-06-17 18:25','Sent'),

(28,3005,'2026-06-17 19:00','Sent',28,'2026-06-17 19:05','Sent'),
(29,3005,'2026-06-17 19:10','Sent',29,'2026-06-17 19:15','Sent'),
(30,3005,'2026-06-17 19:20','Sent',30,'2026-06-17 19:25','Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(31,3001,'2026-06-18 15:00','Sent',31,'2026-06-18 15:05','Sent'),
(32,3001,'2026-06-18 15:10','Sent',32,'2026-06-18 15:15','Sent'),
(33,3001,'2026-06-18 15:20','Sent',33,'2026-06-18 15:25','Sent'),
(34,3001,'2026-06-18 15:30','Sent',34,'2026-06-18 15:35','Sent'),

(35,3002,'2026-06-18 16:00','Sent',35,'2026-06-18 16:05','Sent'),
(36,3002,'2026-06-18 16:10','Sent',36,'2026-06-18 16:15','Sent'),
(37,3002,'2026-06-18 16:20','Sent',37,'2026-06-18 16:25','Sent'),
(38,3002,'2026-06-18 16:30','Sent',38,'2026-06-18 16:35','Sent'),
(39,3002,'2026-06-18 16:40','Sent',39,'2026-06-18 16:45','Sent'),

(40,3003,'2026-06-18 17:00','Sent',40,'2026-06-18 17:05','Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(69,3001,GETDATE(),'Sent',69,GETDATE(),'Sent'),
(70,3001,GETDATE(),'Sent',70,GETDATE(),'Sent'),
(71,3001,GETDATE(),'Sent',71,GETDATE(),'Sent'),
(72,3001,GETDATE(),'Sent',72,GETDATE(),'Sent'),

(73,3002,GETDATE(),'Sent',73,GETDATE(),'Sent'),
(74,3002,GETDATE(),'Sent',74,GETDATE(),'Sent'),
(75,3002,GETDATE(),'Sent',75,GETDATE(),'Sent'),

(76,3003,GETDATE(),'Sent',76,GETDATE(),'Sent'),
(77,3003,GETDATE(),'Sent',77,GETDATE(),'Sent'),
(78,3003,GETDATE(),'Sent',78,GETDATE(),'Sent'),
(79,3003,GETDATE(),'Sent',79,GETDATE(),'Sent'),

(80,3004,GETDATE(),'Sent',80,GETDATE(),'Sent'),
(81,3004,GETDATE(),'Sent',81,GETDATE(),'Sent'),
(82,3004,GETDATE(),'Sent',82,GETDATE(),'Sent'),

(83,3005,GETDATE(),'Sent',83,GETDATE(),'Sent'),
(84,3005,GETDATE(),'Sent',84,GETDATE(),'Sent'),
(85,3005,GETDATE(),'Sent',85,GETDATE(),'Sent'),

(86,3006,GETDATE(),'Sent',86,GETDATE(),'Sent'),
(87,3006,GETDATE(),'Sent',87,GETDATE(),'Sent'),
(88,3006,GETDATE(),'Sent',88,GETDATE(),'Sent'),
(89,3006,GETDATE(),'Sent',89,GETDATE(),'Sent'),
(90,3006,GETDATE(),'Sent',90,GETDATE(),'Sent'),

(91,3007,GETDATE(),'Sent',91,GETDATE(),'Sent'),
(92,3007,GETDATE(),'Sent',92,GETDATE(),'Sent'),
(93,3007,GETDATE(),'Sent',93,GETDATE(),'Sent'),

(94,3008,GETDATE(),'Sent',94,GETDATE(),'Sent'),
(95,3008,GETDATE(),'Sent',95,GETDATE(),'Sent'),
(96,3008,GETDATE(),'Sent',96,GETDATE(),'Sent'),

(97,3009,GETDATE(),'Sent',97,GETDATE(),'Sent'),
(98,3009,GETDATE(),'Sent',98,GETDATE(),'Sent'),
(99,3009,GETDATE(),'Sent',99,GETDATE(),'Sent'),
(100,3009,GETDATE(),'Sent',100,GETDATE(),'Sent'),

(101,3010,GETDATE(),'Sent',101,GETDATE(),'Sent'),
(102,3010,GETDATE(),'Sent',102,GETDATE(),'Sent'),
(103,3010,GETDATE(),'Sent',103,GETDATE(),'Sent'),
(104,3010,GETDATE(),'Sent',104,GETDATE(),'Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(105,3001,GETDATE(),'Sent',105,GETDATE(),'Sent'),
(106,3001,GETDATE(),'Sent',106,GETDATE(),'Sent'),
(107,3001,GETDATE(),'Sent',107,GETDATE(),'Sent'),
(108,3001,GETDATE(),'Sent',108,GETDATE(),'Sent'),

(109,3002,GETDATE(),'Sent',109,GETDATE(),'Sent'),
(110,3002,GETDATE(),'Sent',110,GETDATE(),'Sent'),
(111,3002,GETDATE(),'Sent',111,GETDATE(),'Sent'),

(112,3003,GETDATE(),'Sent',112,GETDATE(),'Sent'),
(113,3003,GETDATE(),'Sent',113,GETDATE(),'Sent'),
(114,3003,GETDATE(),'Sent',114,GETDATE(),'Sent'),
(115,3003,GETDATE(),'Sent',115,GETDATE(),'Sent'),

(116,3004,GETDATE(),'Sent',116,GETDATE(),'Sent'),
(117,3004,GETDATE(),'Sent',117,GETDATE(),'Sent'),
(118,3004,GETDATE(),'Sent',118,GETDATE(),'Sent'),

(119,3005,GETDATE(),'Sent',119,GETDATE(),'Sent'),
(120,3005,GETDATE(),'Sent',120,GETDATE(),'Sent'),
(121,3005,GETDATE(),'Sent',121,GETDATE(),'Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(122,3001,GETDATE(),'Sent',122,GETDATE(),'Sent'),
(123,3001,GETDATE(),'Sent',123,GETDATE(),'Sent'),
(124,3001,GETDATE(),'Sent',124,GETDATE(),'Sent'),
(125,3001,GETDATE(),'Sent',125,GETDATE(),'Sent'),
(126,3001,GETDATE(),'Sent',126,GETDATE(),'Sent'),

(127,3002,GETDATE(),'Sent',127,GETDATE(),'Sent'),
(128,3002,GETDATE(),'Sent',128,GETDATE(),'Sent'),
(129,3002,GETDATE(),'Sent',129,GETDATE(),'Sent'),

(130,3003,GETDATE(),'Sent',130,GETDATE(),'Sent'),
(131,3003,GETDATE(),'Sent',131,GETDATE(),'Sent'),
(132,3003,GETDATE(),'Sent',132,GETDATE(),'Sent'),

(133,3004,GETDATE(),'Sent',133,GETDATE(),'Sent'),
(134,3004,GETDATE(),'Sent',134,GETDATE(),'Sent'),
(135,3004,GETDATE(),'Sent',135,GETDATE(),'Sent'),

(136,3005,GETDATE(),'Sent',136,GETDATE(),'Sent'),
(137,3005,GETDATE(),'Sent',137,GETDATE(),'Sent'),
(138,3005,GETDATE(),'Sent',138,GETDATE(),'Sent'),
(139,3005,GETDATE(),'Sent',139,GETDATE(),'Sent');

INSERT INTO DOCTOR_NOTIFICATION
(Order_Test_ID, Doctor_ID,
Doctor_Notification_Date, Doctor_Status,
Patient_Notification_ID,
Patient_Notification_Date, Patient_Status)
VALUES

(140,3001,GETDATE(),'Sent',140,GETDATE(),'Sent'),
(141,3001,GETDATE(),'Sent',141,GETDATE(),'Sent'),
(142,3001,GETDATE(),'Sent',142,GETDATE(),'Sent'),

(143,3002,GETDATE(),'Sent',143,GETDATE(),'Sent'),
(144,3002,GETDATE(),'Sent',144,GETDATE(),'Sent'),
(145,3002,GETDATE(),'Sent',145,GETDATE(),'Sent'),

(146,3003,GETDATE(),'Sent',146,GETDATE(),'Sent'),
(147,3003,GETDATE(),'Sent',147,GETDATE(),'Sent'),
(148,3003,GETDATE(),'Sent',148,GETDATE(),'Sent'),

(149,3004,GETDATE(),'Sent',149,GETDATE(),'Sent'),
(150,3004,GETDATE(),'Sent',150,GETDATE(),'Sent'),
(151,3004,GETDATE(),'Sent',151,GETDATE(),'Sent'),
(152,3004,GETDATE(),'Sent',152,GETDATE(),'Sent'),

(153,3005,GETDATE(),'Sent',153,GETDATE(),'Sent'),
(154,3005,GETDATE(),'Sent',154,GETDATE(),'Sent'),
(155,3005,GETDATE(),'Sent',155,GETDATE(),'Sent');

-- ======================================
-- SECTION 9 : LAB QC RUN DATA
-- ======================================

INSERT INTO LAB_QC_RUN
(Instrument_ID, Test_ID, Run_Date,
Control_Level, Result_Value, Status, Comments)
VALUES

(2, 5,
'2026-06-07 08:00',
'Normal',
'TSH QC Passed',
'WithinLimits',
'Daily QC for TSH'),

(1, 4,
'2026-06-07 08:30',
'Normal',
'HbA1c QC Passed',
'WithinLimits',
'Daily QC for HbA1c');

INSERT INTO LAB_QC_RUN
(Instrument_ID, Test_ID, Run_Date,
Control_Level, Result_Value, Status, Comments)
VALUES

(1,1,'2026-06-17 08:00','Normal','CBC QC Passed','WithinLimits','Daily QC for CBC'),

(1,2,'2026-06-17 08:10','Normal','Lipid QC Passed','WithinLimits','Daily QC for Lipid Profile'),

(1,3,'2026-06-17 08:20','Normal','FBS QC Passed','WithinLimits','Daily QC for Fasting Blood Sugar'),

(2,6,'2026-06-17 08:30','Normal','Creatinine QC Passed','WithinLimits','Daily QC for Creatinine'),

(2,11,'2026-06-17 08:40','Normal','Calcium QC Passed','WithinLimits','Daily QC for Calcium'),

(2,12,'2026-06-17 08:50','Normal','Sodium QC Passed','WithinLimits','Daily QC for Sodium'),

(2,13,'2026-06-17 09:00','Normal','Potassium QC Passed','WithinLimits','Daily QC for Potassium'),

(3,14,'2026-06-17 09:10','Normal','Vitamin B12 QC Passed','WithinLimits','Daily QC for Vitamin B12'),

(3,15,'2026-06-17 09:20','Normal','CRP QC Passed','WithinLimits','Daily QC for C-Reactive Protein'),

(2,8,'2026-06-17 09:30','Normal','T3 QC Passed','WithinLimits','Daily QC for T3'),

(2,9,'2026-06-17 09:40','Normal','T4 QC Passed','WithinLimits','Daily QC for T4'),

(1,10,'2026-06-17 09:50','Normal','Uric Acid QC Passed','WithinLimits','Daily QC for Uric Acid');

INSERT INTO LAB_QC_RUN
(Instrument_ID, Test_ID, Run_Date,
Control_Level, Result_Value, Status, Comments)
VALUES

(3,7,
'2026-06-18 09:00',
'Normal',
'Vitamin D QC Passed',
'WithinLimits',
'Daily QC for Vitamin D');

-- ======================================
-- SECTION 10 : LAB AUDIT LOG DATA
-- ======================================

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_TEST_MASTER',
4,
'{"Status":"Active"}',
'{"Status":"Inactive"}',
'Admin');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_TEST_MASTER',
4,
'{"Status":"Active"}',
'{"Status":"Inactive"}',
'Admin'),

('LAB_RESULT',
14,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',
15,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('SAMPLE',
14,
'{"Status":"Collected"}',
'{"Status":"Processed"}',
'Tech.John'),

('LAB_ORDER_TEST',
18,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',
22,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_RESULT',
24,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',
31,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('SAMPLE',
25,
'{"Status":"Collected"}',
'{"Status":"Processed"}',
'Tech.Mary'),

('SAMPLE',
31,
'{"Status":"Collected"}',
'{"Status":"Processed"}',
'Tech.John'),

('LAB_ORDER_TEST',
31,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',
31,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System'),

('LAB_ORDER',
11,
'{"Status":"New"}',
'{"Status":"Completed"}',
'Admin');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_RESULT',69,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',73,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',76,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',80,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',83,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_ORDER_TEST',86,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('LAB_ORDER_TEST',91,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',94,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System'),

('DOCTOR_NOTIFICATION',97,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System'),

('LAB_ORDER',33,
'{"Status":"New"}',
'{"Status":"Completed"}',
'Admin');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_RESULT',105,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',109,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',112,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',116,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',119,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_ORDER_TEST',105,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',105,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_RESULT',122,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',127,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',130,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',133,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',136,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_ORDER_TEST',122,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',122,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System');

INSERT INTO LAB_AUDIT_LOG
(Table_Name, Record_ID,
Old_Value, New_Value, Modified_By)
VALUES

('LAB_RESULT',140,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',143,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',146,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',149,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_RESULT',153,
'{"Status":"Pending"}',
'{"Status":"Validated"}',
'LabAdmin'),

('LAB_ORDER_TEST',140,
'{"Status":"Pending"}',
'{"Status":"Completed"}',
'System'),

('DOCTOR_NOTIFICATION',140,
'{"Doctor_Status":"Pending"}',
'{"Doctor_Status":"Sent"}',
'System');

-- ======================================
-- SECTION 11 : JOIN QUERY
-- ======================================

SELECT
    LO.Order_ID,
    LO.Patient_ID,
    LTM.Test_Name,
    S.Barcode,
    LR.Result_Value,
    LR.Interpretation,
    DN.Doctor_Status
FROM LAB_ORDER LO
INNER JOIN LAB_ORDER_TEST LOT
    ON LO.Order_ID = LOT.Order_ID
INNER JOIN LAB_TEST_MASTER LTM
    ON LOT.Test_ID = LTM.Test_ID
INNER JOIN SAMPLE S
    ON LOT.Order_Test_ID = S.Order_Test_ID
INNER JOIN LAB_RESULT LR
    ON LOT.Order_Test_ID = LR.Order_Test_ID
INNER JOIN DOCTOR_NOTIFICATION DN
    ON LOT.Order_Test_ID = DN.Order_Test_ID
ORDER BY LO.Order_ID;

-- ======================================
-- SECTION 12 : AGGREGATE QUERIES
-- ======================================

SELECT Doctor_ID,
       COUNT(*) AS Total_Orders
FROM LAB_ORDER
GROUP BY Doctor_ID;

-- ======================================
-- SECTION 13 : VIEW
-- ======================================

CREATE VIEW vw_LabResults
AS
SELECT R.Result_ID,
       T.Test_Name,
       R.Result_Value
FROM LAB_RESULT R
JOIN LAB_ORDER_TEST OT
ON R.Order_Test_ID = OT.Order_Test_ID
JOIN LAB_TEST_MASTER T
ON OT.Test_ID = T.Test_ID;
GO

-- ======================================
-- SECTION 14 : STORED PROCEDURE
-- ======================================

CREATE PROCEDURE GetPatientOrders
@PatientID INT
AS
BEGIN
    SELECT *
    FROM LAB_ORDER
    WHERE Patient_ID = @PatientID;
END
GO


CREATE PROCEDURE GetLabTestResultDetails
(
    @Order_Test_ID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        LO.Order_ID,
        LO.Patient_ID,
        LOT.Order_Test_ID,
        LTM.Test_Name,
        LR.Result_Value,
        LR.Units,
        LR.Normal_Range,
        LR.Interpretation,
        LR.Comments,
        LR.Status,
        LR.Entered_Date
    FROM LAB_RESULT LR
    INNER JOIN LAB_ORDER_TEST LOT
        ON LR.Order_Test_ID = LOT.Order_Test_ID
    INNER JOIN LAB_TEST_MASTER LTM
        ON LOT.Test_ID = LTM.Test_ID
    INNER JOIN LAB_ORDER LO
        ON LOT.Order_ID = LO.Order_ID
    WHERE LOT.Order_Test_ID = @Order_Test_ID;
END
GO

-- ======================================
-- SECTION 15 : TRIGGER
-- ======================================

CREATE OR ALTER TRIGGER trg_AuditLabOrder
ON LAB_ORDER
AFTER UPDATE
AS
BEGIN
    PRINT 'LAB_ORDER updated';
END;
GO

-- ======================================
-- SECTION 16 : INDEXES
-- ======================================

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_LAB_ORDER_Patient'
)
BEGIN
    CREATE INDEX IX_LAB_ORDER_Patient
    ON LAB_ORDER (Patient_ID);
END
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_LAB_ORDER_TEST_Test'
)
BEGIN
    CREATE INDEX IX_LAB_ORDER_TEST_Test
    ON LAB_ORDER_TEST (Test_ID);
END
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_LAB_RESULT_OrderTest'
)
BEGIN
    CREATE INDEX IX_LAB_RESULT_OrderTest
    ON LAB_RESULT (Order_Test_ID);
END
GO

IF NOT EXISTS (
    SELECT *
    FROM sys.indexes
    WHERE name = 'IX_SAMPLE_OrderTest'
)
BEGIN
    CREATE INDEX IX_SAMPLE_OrderTest
    ON SAMPLE (Order_Test_ID);
END
GO

-- ======================================
-- SECTION 17 : VERIFICATION QUERIES
-- ======================================

SELECT COUNT(*) AS TotalOrders
FROM LAB_ORDER;

SELECT COUNT(*) AS TotalTests
FROM LAB_ORDER_TEST;

SELECT COUNT(*) AS TotalResults
FROM LAB_RESULT;

SELECT COUNT(*) AS TotalSamples
FROM SAMPLE;

SELECT COUNT(*) AS TotalNotifications
FROM DOCTOR_NOTIFICATION;

-- ======================================
-- SECTION 18 : EXECUTION COMPLETE
-- ======================================

PRINT 'Lab Service Database Script Executed Successfully';