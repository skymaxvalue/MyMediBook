SELECT DB_NAME() AS CurrentDatabase;

INSERT INTO Doctor
(
    FirstName,
    LastName,
    SpecialtyID,
    LicenseNumber,
    DEANumber,
    NPINumber,
    Phone,
    Email,
    IsActive,
    CreatedAt
)
VALUES
(
'Rajesh',
'Kumar',
1,
'LIC1001',
'DEA1001',
'NPI1001',
'9876543210',
'rajesh.kumar@hospital.com',
1,
GETDATE()
),

(
'Priya',
'Sharma',
2,
'LIC1002',
'DEA1002',
'NPI1002',
'9876543211',
'priya.sharma@hospital.com',
1,
GETDATE()
),

(
'Arun',
'Prakash',
3,
'LIC1003',
'DEA1003',
'NPI1003',
'9876543212',
'arun.prakash@hospital.com',
1,
GETDATE()
);

INSERT INTO Medication
(
    GenericName,
    BrandName,
    DrugFormID,
    ScheduleID,
    RouteID,
    Strength,
    NDCCode,
    Manufacturer,
    IsControlled,
    RequiresPriorAuth,
    IsActive,
    CreatedAt
)
VALUES
(
'Paracetamol',
'Crocin',
1,
5,
1,
'500mg',
'NDC1001',
'GSK',
0,
0,
1,
GETDATE()
),

(
'Amoxicillin',
'Amoxil',
1,
6,
1,
'250mg',
'NDC1002',
'Pfizer',
0,
0,
1,
GETDATE()
),

(
'Cetirizine',
'Zyrtec',
1,
5,
1,
'10mg',
'NDC1003',
'Johnson & Johnson',
0,
0,
1,
GETDATE()
);

INSERT INTO Pharmacy
(
    PharmacyName,
    NPI,
    Address,
    Phone,
    Fax,
    IsActive
)
VALUES
(
'City Care Pharmacy',
'NPI5001',
'12 Main Street, Chennai',
'9876500001',
'044-2201001',
1
),

(
'Apollo Pharmacy',
'NPI5002',
'45 Anna Nagar, Chennai',
'9876500002',
'044-2201002',
1
),

(
'MedPlus Pharmacy',
'NPI5003',
'78 T Nagar, Chennai',
'9876500003',
'044-2201003',
1
);

INSERT INTO Patient
(
    MRN,
    FirstName,
    LastName,
    DateOfBirth,
    Gender,
    BloodType,
    Phone,
    Email,
    Address,
    EmergencyContact,
    EmergencyPhone,
    InsurancePayer,
    InsuranceMemberID,
    IsActive,
    CreatedAt,
    UpdatedAt
)
VALUES
(
'MRN1001',
'Ravi',
'Kumar',
'1995-06-15',
'Male',
'O+',
'9876543201',
'ravi.kumar@email.com',
'Chennai',
'Suresh Kumar',
'9876543215',
'Star Health',
'INS1001',
1,
GETDATE(),
GETDATE()
),

(
'MRN1002',
'Meena',
'Sharma',
'1998-03-22',
'Female',
'A+',
'9876543202',
'meena.sharma@email.com',
'Madurai',
'Lakshmi Sharma',
'9876543216',
'HDFC Ergo',
'INS1002',
1,
GETDATE(),
GETDATE()
),

(
'MRN1003',
'Arjun',
'Prakash',
'1992-11-10',
'Male',
'B+',
'9876543203',
'arjun.prakash@email.com',
'Coimbatore',
'Ramesh Prakash',
'9876543217',
'ICICI Lombard',
'INS1003',
1,
GETDATE(),
GETDATE()
);

INSERT INTO Patient
(
MRN,
FirstName,
LastName,
DateOfBirth,
Gender,
BloodType,
Phone,
Email,
Address,
EmergencyContact,
EmergencyPhone,
InsurancePayer,
InsuranceMemberID,
IsActive,
CreatedAt,
UpdatedAt
)
VALUES
(
'MRN1004',
'Suresh',
'Kumar',
'1988-07-14',
'Male',
'A+',
'9876543204',
'suresh.kumar@email.com',
'Trichy',
'Ravi Kumar',
'9876543218',
'Star Health',
'INS1004',
1,
GETDATE(),
GETDATE()
),

(
'MRN1005',
'Kavya',
'Devi',
'1996-11-25',
'Female',
'O+',
'9876543205',
'kavya.devi@email.com',
'Salem',
'Lakshmi Devi',
'9876543219',
'HDFC Ergo',
'INS1005',
1,
GETDATE(),
GETDATE()
),

(
'MRN1006',
'Manoj',
'Prakash',
'1990-03-18',
'Male',
'B+',
'9876543206',
'manoj.prakash@email.com',
'Erode',
'Selvam Prakash',
'9876543220',
'ICICI Lombard',
'INS1006',
1,
GETDATE(),
GETDATE()
);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
 Phone, Email, Address, EmergencyContact, EmergencyPhone,
 InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1007','Priya','Raman','1994-08-11','Female','A+',
'9876543207','priya.raman@email.com','Chennai',
'Raman Kumar','9876543221',
'HDFC Ergo','INS1007',1),

('MRN1008','Vignesh','Kumar','1989-05-16','Male','B+',
'9876543208','vignesh.kumar@email.com','Madurai',
'Kumar Raj','9876543222',
'Star Health','INS1008',1),

('MRN1009','Divya','Suresh','1996-02-21','Female','O+',
'9876543209','divya.suresh@email.com','Salem',
'Suresh Kumar','9876543223',
'ICICI Lombard','INS1009',1),

('MRN1010','Aravind','Raj','1991-11-04','Male','A-',
'9876543210','aravind.raj@email.com','Coimbatore',
'Raj Kumar','9876543224',
'HDFC Ergo','INS1010',1),

('MRN1011','Nisha','Devi','1995-07-09','Female','B+',
'9876543211','nisha.devi@email.com','Trichy',
'Devi Kumar','9876543225',
'Star Health','INS1011',1),

('MRN1012','Karthik','Prabhu','1990-03-13','Male','O+',
'9876543212','karthik.prabhu@email.com','Erode',
'Prabhu Kumar','9876543226',
'ICICI Lombard','INS1012',1),

('MRN1013','Harini','Selvam','1997-06-25','Female','AB+',
'9876543213','harini.selvam@email.com','Chennai',
'Selvam Kumar','9876543227',
'HDFC Ergo','INS1013',1),

('MRN1014','Sanjay','Kumar','1988-10-18','Male','A+',
'9876543214','sanjay.kumar@email.com','Madurai',
'Kumar Raj','9876543228',
'Star Health','INS1014',1),

('MRN1015','Keerthana','Ravi','1993-12-30','Female','O-',
'9876543215','keerthana.ravi@email.com','Salem',
'Ravi Kumar','9876543229',
'ICICI Lombard','INS1015',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
 Phone, Email, Address, EmergencyContact, EmergencyPhone,
 InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1016','Rahul','Kumar','1992-04-15','Male','B+',
'9876543216','rahul.kumar@email.com','Chennai',
'Kumar Raj','9876543230',
'HDFC Ergo','INS1016',1),

('MRN1017','Anitha','Devi','1995-09-08','Female','O+',
'9876543217','anitha.devi@email.com','Madurai',
'Devi Kumar','9876543231',
'Star Health','INS1017',1),

('MRN1018','Vijay','Prakash','1988-11-20','Male','A+',
'9876543218','vijay.prakash@email.com','Coimbatore',
'Prakash Kumar','9876543232',
'ICICI Lombard','INS1018',1),

('MRN1019','Swathi','Ravi','1994-06-12','Female','AB+',
'9876543219','swathi.ravi@email.com','Salem',
'Ravi Kumar','9876543233',
'HDFC Ergo','INS1019',1),

('MRN1020','Kiran','Selvam','1991-02-25','Male','O-',
'9876543220','kiran.selvam@email.com','Trichy',
'Selvam Kumar','9876543234',
'Star Health','INS1020',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
 Phone, Email, Address, EmergencyContact, EmergencyPhone,
 InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1021','Deepak','Rajan','1993-05-11','Male','A+',
'9876543221','deepak.rajan@email.com','Chennai',
'Rajan Kumar','9876543235',
'HDFC Ergo','INS1021',1),

('MRN1022','Sneha','Priya','1996-08-24','Female','B+',
'9876543222','sneha.priya@email.com','Madurai',
'Priya Kumar','9876543236',
'Star Health','INS1022',1),

('MRN1023','Karthika','Devi','1994-01-18','Female','O+',
'9876543223','karthika.devi@email.com','Salem',
'Devi Kumar','9876543237',
'ICICI Lombard','INS1023',1),

('MRN1024','Ashwin','Kumar','1989-11-03','Male','AB+',
'9876543224','ashwin.kumar@email.com','Coimbatore',
'Kumar Raj','9876543238',
'HDFC Ergo','INS1024',1),

('MRN1025','Lavanya','Ravi','1997-03-21','Female','A-',
'9876543225','lavanya.ravi@email.com','Trichy',
'Ravi Kumar','9876543239',
'Star Health','INS1025',1),

('MRN1026','Praveen','Selvam','1992-07-15','Male','B+',
'9876543226','praveen.selvam@email.com','Erode',
'Selvam Kumar','9876543240',
'ICICI Lombard','INS1026',1),

('MRN1027','Nandhini','Suresh','1995-12-06','Female','O-',
'9876543227','nandhini.suresh@email.com','Chennai',
'Suresh Kumar','9876543241',
'HDFC Ergo','INS1027',1),

('MRN1028','Gokul','Prakash','1990-09-14','Male','A+',
'9876543228','gokul.prakash@email.com','Madurai',
'Prakash Kumar','9876543242',
'Star Health','INS1028',1),

('MRN1029','Pavithra','Mani','1998-04-29','Female','B-',
'9876543229','pavithra.mani@email.com','Salem',
'Mani Kumar','9876543243',
'ICICI Lombard','INS1029',1),

('MRN1030','Surya','Kannan','1991-06-10','Male','O+',
'9876543230','surya.kannan@email.com','Coimbatore',
'Kannan Kumar','9876543244',
'HDFC Ergo','INS1030',1);

UPDATE Patient SET Phone='9124678351' WHERE PatientID=1;
UPDATE Patient SET Phone='9347856124' WHERE PatientID=2;
UPDATE Patient SET Phone='9562387415' WHERE PatientID=3;
UPDATE Patient SET Phone='9445263781' WHERE PatientID=4;
UPDATE Patient SET Phone='9786321458' WHERE PatientID=5;
UPDATE Patient SET Phone='9178456321' WHERE PatientID=6;
UPDATE Patient SET Phone='9362581470' WHERE PatientID=7;
UPDATE Patient SET Phone='9495632814' WHERE PatientID=8;
UPDATE Patient SET Phone='9687452136' WHERE PatientID=9;
UPDATE Patient SET Phone='9384512678' WHERE PatientID=10;

UPDATE Patient SET Phone='9821456732' WHERE PatientID=11;
UPDATE Patient SET Phone='9514267385' WHERE PatientID=12;
UPDATE Patient SET Phone='9753146825' WHERE PatientID=13;
UPDATE Patient SET Phone='9641523780' WHERE PatientID=14;
UPDATE Patient SET Phone='9812365478' WHERE PatientID=15;
UPDATE Patient SET Phone='9736541280' WHERE PatientID=16;
UPDATE Patient SET Phone='9428175634' WHERE PatientID=17;
UPDATE Patient SET Phone='9654238175' WHERE PatientID=18;
UPDATE Patient SET Phone='9867345218' WHERE PatientID=19;
UPDATE Patient SET Phone='9536421789' WHERE PatientID=20;

UPDATE Patient SET Phone='9198765432' WHERE PatientID=21;
UPDATE Patient SET Phone='9312456789' WHERE PatientID=22;
UPDATE Patient SET Phone='9578123465' WHERE PatientID=23;
UPDATE Patient SET Phone='9485632174' WHERE PatientID=24;
UPDATE Patient SET Phone='9748125630' WHERE PatientID=25;
UPDATE Patient SET Phone='9357124689' WHERE PatientID=26;
UPDATE Patient SET Phone='9678452130' WHERE PatientID=27;
UPDATE Patient SET Phone='9432165789' WHERE PatientID=28;
UPDATE Patient SET Phone='9798541236' WHERE PatientID=29;
UPDATE Patient SET Phone='9523164785' WHERE PatientID=30;

UPDATE Patient SET EmergencyPhone='9632587410' WHERE PatientID=1;
UPDATE Patient SET EmergencyPhone='9821456732' WHERE PatientID=2;
UPDATE Patient SET EmergencyPhone='9514267385' WHERE PatientID=3;
UPDATE Patient SET EmergencyPhone='9753146825' WHERE PatientID=4;
UPDATE Patient SET EmergencyPhone='9641523780' WHERE PatientID=5;
UPDATE Patient SET EmergencyPhone='9812365478' WHERE PatientID=6;
UPDATE Patient SET EmergencyPhone='9736541280' WHERE PatientID=7;
UPDATE Patient SET EmergencyPhone='9428175634' WHERE PatientID=8;
UPDATE Patient SET EmergencyPhone='9654238175' WHERE PatientID=9;
UPDATE Patient SET EmergencyPhone='9867345218' WHERE PatientID=10;

UPDATE Patient SET EmergencyPhone='9536421789' WHERE PatientID=11;
UPDATE Patient SET EmergencyPhone='9198765432' WHERE PatientID=12;
UPDATE Patient SET EmergencyPhone='9312456789' WHERE PatientID=13;
UPDATE Patient SET EmergencyPhone='9578123465' WHERE PatientID=14;
UPDATE Patient SET EmergencyPhone='9485632174' WHERE PatientID=15;
UPDATE Patient SET EmergencyPhone='9748125630' WHERE PatientID=16;
UPDATE Patient SET EmergencyPhone='9357124689' WHERE PatientID=17;
UPDATE Patient SET EmergencyPhone='9678452130' WHERE PatientID=18;
UPDATE Patient SET EmergencyPhone='9432165789' WHERE PatientID=19;
UPDATE Patient SET EmergencyPhone='9798541236' WHERE PatientID=20;

UPDATE Patient SET EmergencyPhone='9523164785' WHERE PatientID=21;
UPDATE Patient SET EmergencyPhone='9168247350' WHERE PatientID=22;
UPDATE Patient SET EmergencyPhone='9386721450' WHERE PatientID=23;
UPDATE Patient SET EmergencyPhone='9473168250' WHERE PatientID=24;
UPDATE Patient SET EmergencyPhone='9651827340' WHERE PatientID=25;
UPDATE Patient SET EmergencyPhone='9827346150' WHERE PatientID=26;
UPDATE Patient SET EmergencyPhone='9548637210' WHERE PatientID=27;
UPDATE Patient SET EmergencyPhone='9713628450' WHERE PatientID=28;
UPDATE Patient SET EmergencyPhone='9368152740' WHERE PatientID=29;
UPDATE Patient SET EmergencyPhone='9481726350' WHERE PatientID=30;

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1031','Akhil','Ramanathan','1992-04-18','Male','A+',
'9447836215','akhil.ramanathan@email.com','Chennai',
'Meena Ramanathan','9362587410',
'HDFC Ergo','INS1031',1),

('MRN1032','Janani','Krishnamurthy','1995-08-22','Female','B+',
'9381467253','janani.krish@email.com','Madurai',
'Krishnamurthy S','9674125836',
'Star Health','INS1032',1),

('MRN1033','Varun','Balakrishnan','1991-11-07','Male','O+',
'9568341275','varun.bala@email.com','Salem',
'Lakshmi Balakrishnan','9812573468',
'ICICI Lombard','INS1033',1),

('MRN1034','Harini','Sundaresan','1996-01-30','Female','AB+',
'9783146527','harini.s@email.com','Trichy',
'Sundaresan P','9427863154',
'HDFC Ergo','INS1034',1),

('MRN1035','Madhan','Venkatraman','1989-06-14','Male','A-',
'9654823716','madhan.v@email.com','Coimbatore',
'Revathi Venkatraman','9536147285',
'Star Health','INS1035',1),

('MRN1036','Pavithra','Aravindan','1994-10-09','Female','O-',
'9873154268','pavithra.a@email.com','Erode',
'Aravindan K','9741863257',
'ICICI Lombard','INS1036',1),

('MRN1037','Rohit','Natarajan','1990-03-25','Male','B-',
'9486251734','rohit.n@email.com','Chennai',
'Natarajan R','9863527418',
'HDFC Ergo','INS1037',1),

('MRN1038','Deepika','Sivaraman','1997-12-11','Female','A+',
'9347681524','deepika.s@email.com','Madurai',
'Sivaraman M','9518436725',
'Star Health','INS1038',1),

('MRN1039','Kishore','Mahadevan','1993-07-03','Male','AB-',
'9796243815','kishore.m@email.com','Salem',
'Mahadevan S','9642175839',
'ICICI Lombard','INS1039',1),

('MRN1040','Nivetha','Parameswaran','1998-05-19','Female','O+',
'9527364185','nivetha.p@email.com','Trichy',
'Parameswaran R','9753816247',
'HDFC Ergo','INS1040',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1041','Abinaya','Raghunathan','1994-03-12','Female','A+',
'9637418520','abinaya.r@email.com','Chennai',
'Raghunathan K','9845217630',
'HDFC Ergo','INS1041',1),

('MRN1042','Vishal','Ganesh','1991-08-24','Male','B+',
'9785632140','vishal.g@email.com','Madurai',
'Ganesh Kumar','9512478365',
'Star Health','INS1042',1),

('MRN1043','Keerthika','Madhavan','1996-11-05','Female','O+',
'9341527860','keerthika.m@email.com','Salem',
'Madhavan S','9736514280',
'ICICI Lombard','INS1043',1),

('MRN1044','Praveen','Ravichandran','1989-06-19','Male','AB+',
'9524681730','praveen.r@email.com','Trichy',
'Ravichandran P','9863247510',
'HDFC Ergo','INS1044',1),

('MRN1045','Swetha','Jagannathan','1997-01-28','Female','A-',
'9478136520','swetha.j@email.com','Coimbatore',
'Jagannathan R','9641528370',
'Star Health','INS1045',1),

('MRN1046','Dharun','Muthukumar','1992-09-16','Male','O-',
'9814527630','dharun.m@email.com','Erode',
'Muthukumar K','9754186320',
'ICICI Lombard','INS1046',1),

('MRN1047','Roshini','Venkataraman','1995-04-09','Female','B-',
'9563274180','roshini.v@email.com','Chennai',
'Venkataraman S','9426815370',
'HDFC Ergo','INS1047',1),

('MRN1048','Sathish','Elangovan','1990-12-21','Male','A+',
'9384175260','sathish.e@email.com','Madurai',
'Elangovan P','9874162530',
'Star Health','INS1048',1),

('MRN1049','Meghana','Balachandar','1998-07-14','Female','AB-',
'9652147830','meghana.b@email.com','Salem',
'Balachandar R','9538214760',
'ICICI Lombard','INS1049',1),

('MRN1050','Arjun','Srinivasan','1993-10-31','Male','O+',
'9795314680','arjun.s@email.com','Trichy',
'Srinivasan K','9681437520',
'HDFC Ergo','INS1050',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1051','Kavin','Ramesh','1992-05-14','Male','B+',
'9448162735','kavin.ramesh@email.com','Chennai',
'Suresh Ramesh','9365271840',
'HDFC Ergo','INS1051',1),

('MRN1052','Haritha','Mohan','1995-09-22','Female','O+',
'9562841730','haritha.mohan@email.com','Madurai',
'Mohan Kumar','9784512630',
'Star Health','INS1052',1),

('MRN1053','Vignesh','Rajan','1991-12-08','Male','A+',
'9683412750','vignesh.rajan@email.com','Salem',
'Lakshmi Rajan','9826173540',
'ICICI Lombard','INS1053',1),

('MRN1054','Nandhini','Prakash','1996-03-19','Female','AB+',
'9751632840','nandhini.prakash@email.com','Trichy',
'Prakash Kumar','9642817350',
'HDFC Ergo','INS1054',1),

('MRN1055','Sathish','Kumar','1989-08-30','Male','O-',
'9483726150','sathish.kumar@email.com','Coimbatore',
'Revathi Kumar','9537261840',
'Star Health','INS1055',1),

('MRN1056','Priyadharshini','Selvam','1994-10-11','Female','A-',
'9817263540','priya.selvam@email.com','Erode',
'Selvam K','9746325180',
'ICICI Lombard','INS1056',1),

('MRN1057','Aravind','Babu','1990-06-25','Male','B-',
'9638512740','aravind.babu@email.com','Chennai',
'Babu R','9863147250',
'HDFC Ergo','INS1057',1),

('MRN1058','Keerthana','Mani','1997-11-03','Female','A+',
'9342716850','keerthana.mani@email.com','Madurai',
'Mani S','9518263740',
'Star Health','INS1058',1),

('MRN1059','Dinesh','Balaji','1993-04-16','Male','AB-',
'9796132850','dinesh.balaji@email.com','Salem',
'Balaji K','9647352180',
'ICICI Lombard','INS1059',1),

('MRN1060','Divya','Ravi','1998-07-27','Female','O+',
'9527183640','divya.ravi@email.com','Trichy',
'Ravi S','9752638140',
'HDFC Ergo','INS1060',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1061','Ajay','Karthik','1991-02-15','Male','A+',
'9447216358','ajay.karthik@email.com','Chennai',
'Saranya Karthik','9365182740',
'HDFC Ergo','INS1061',1),

('MRN1062','Pooja','Ramesh','1995-06-24','Female','B+',
'9563827415','pooja.ramesh@email.com','Madurai',
'Ramesh Kumar','9782615340',
'Star Health','INS1062',1),

('MRN1063','Karthikeyan','Suresh','1990-11-09','Male','O+',
'9681572430','karthik.suresh@email.com','Salem',
'Meena Suresh','9826347150',
'ICICI Lombard','INS1063',1),

('MRN1064','Anitha','Murugan','1997-04-12','Female','AB+',
'9752863140','anitha.murugan@email.com','Trichy',
'Murugan R','9648173520',
'HDFC Ergo','INS1064',1),

('MRN1065','Pradeep','Selvaraj','1988-09-28','Male','O-',
'9486132750','pradeep.selvaraj@email.com','Coimbatore',
'Revathi Selvaraj','9532846170',
'Star Health','INS1065',1),

('MRN1066','Gayathri','Manoharan','1993-07-16','Female','A-',
'9815472630','gayathri.manoharan@email.com','Erode',
'Manoharan K','9743186250',
'ICICI Lombard','INS1066',1),

('MRN1067','Vijay','Krishnan','1992-12-05','Male','B-',
'9632748510','vijay.krishnan@email.com','Chennai',
'Krishnan S','9865273140',
'HDFC Ergo','INS1067',1),

('MRN1068','Ramya','Balasubramanian','1998-03-21','Female','A+',
'9348627510','ramya.bala@email.com','Madurai',
'Balasubramanian R','9517348260',
'Star Health','INS1068',1),

('MRN1069','Arun','Prakash','1994-08-13','Male','AB-',
'9794216385','arun.prakash@email.com','Salem',
'Prakash Kumar','9645237180',
'ICICI Lombard','INS1069',1),

('MRN1070','Shalini','Venkatesh','1996-10-30','Female','O+',
'9523817460','shalini.venkatesh@email.com','Trichy',
'Venkatesh S','9751648230',
'HDFC Ergo','INS1070',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1071','Naveen','Rajendran','1992-01-18','Male','A+',
'9447123856','naveen.raj@email.com','Chennai',
'Rajendran K','9364127850',
'HDFC Ergo','INS1071',1),

('MRN1072','Priya','Sankar','1995-05-29','Female','B+',
'9567312485','priya.sankar@email.com','Madurai',
'Sankar R','9783152640',
'Star Health','INS1072',1),

('MRN1073','Saravanan','Kumar','1990-09-11','Male','O+',
'9682547310','saravanan.k@email.com','Salem',
'Lakshmi Kumar','9827415630',
'ICICI Lombard','INS1073',1),

('MRN1074','Deepa','Raghavan','1997-02-25','Female','AB+',
'9754316820','deepa.r@email.com','Trichy',
'Raghavan P','9641823570',
'HDFC Ergo','INS1074',1),

('MRN1075','Manikandan','Ravi','1989-07-14','Male','O-',
'9482763150','mani.ravi@email.com','Coimbatore',
'Revathi Ravi','9537614280',
'Star Health','INS1075',1),

('MRN1076','Meena','Subramanian','1994-10-06','Female','A-',
'9816243570','meena.s@email.com','Erode',
'Subramanian K','9742856310',
'ICICI Lombard','INS1076',1),

('MRN1077','Kishore','Balaji','1991-12-22','Male','B-',
'9635478210','kishore.b@email.com','Chennai',
'Balaji R','9861734250',
'HDFC Ergo','INS1077',1),

('MRN1078','Swetha','Narayanan','1998-03-09','Female','A+',
'9348162750','swetha.n@email.com','Madurai',
'Narayanan S','9514287360',
'Star Health','INS1078',1),

('MRN1079','Senthil','Prasad','1993-06-27','Male','AB-',
'9793628150','senthil.p@email.com','Salem',
'Prasad K','9647315280',
'ICICI Lombard','INS1079',1),

('MRN1080','Bhavya','Mohan','1996-11-17','Female','O+',
'9527841630','bhavya.m@email.com','Trichy',
'Mohan R','9753186240',
'HDFC Ergo','INS1080',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1081','Arvind','Sridhar','1992-04-12','Male','A+',
'9448157263','arvind.s@email.com','Chennai',
'Sridhar K','9365274180',
'HDFC Ergo','INS1081',1),

('MRN1082','Divya','Karthikeyan','1995-08-23','Female','B+',
'9562748135','divya.k@email.com','Madurai',
'Karthikeyan R','9784516320',
'Star Health','INS1082',1),

('MRN1083','Praveen','Rajkumar','1991-11-15','Male','O+',
'9683415270','praveen.r@email.com','Salem',
'Lakshmi Rajkumar','9826174350',
'ICICI Lombard','INS1083',1),

('MRN1084','Harini','Vijayan','1997-01-30','Female','AB+',
'9751836240','harini.v@email.com','Trichy',
'Vijayan P','9642735180',
'HDFC Ergo','INS1084',1),

('MRN1085','Suresh','Madhavan','1989-06-08','Male','O-',
'9485261730','suresh.m@email.com','Coimbatore',
'Revathi Madhavan','9536174280',
'Star Health','INS1085',1),

('MRN1086','Keerthana','Ramesh','1994-09-19','Female','A-',
'9817352640','keerthana.r@email.com','Erode',
'Ramesh K','9742865310',
'ICICI Lombard','INS1086',1),

('MRN1087','Vignesh','Bharathi','1990-03-26','Male','B-',
'9638527140','vignesh.b@email.com','Chennai',
'Bharathi S','9863157420',
'HDFC Ergo','INS1087',1),

('MRN1088','Janani','Selvam','1998-12-11','Female','A+',
'9347268150','janani.s@email.com','Madurai',
'Selvam R','9518472630',
'Star Health','INS1088',1),

('MRN1089','Dinesh','Ganesh','1993-07-03','Male','AB-',
'9796153240','dinesh.g@email.com','Salem',
'Ganesh K','9645281730',
'ICICI Lombard','INS1089',1),

('MRN1090','Nivetha','Manoharan','1996-05-21','Female','O+',
'9527361840','nivetha.m@email.com','Trichy',
'Manoharan R','9751634280',
'HDFC Ergo','INS1090',1);

INSERT INTO Patient
(MRN, FirstName, LastName, DateOfBirth, Gender, BloodType,
Phone, Email, Address, EmergencyContact, EmergencyPhone,
InsurancePayer, InsuranceMemberID, IsActive)
VALUES

('MRN1091','Akash','Sivakumar','1992-02-14','Male','A+',
'9447182635','akash.s@email.com','Chennai',
'Sivakumar R','9365218740',
'HDFC Ergo','INS1091',1),

('MRN1092','Lavanya','Prakash','1995-06-27','Female','B+',
'9563821745','lavanya.p@email.com','Madurai',
'Prakash K','9784152630',
'Star Health','INS1092',1),

('MRN1093','Ramesh','Kannan','1991-10-08','Male','O+',
'9681542730','ramesh.k@email.com','Salem',
'Meena Kannan','9826317450',
'ICICI Lombard','INS1093',1),

('MRN1094','Sharmila','Arun','1997-03-19','Female','AB+',
'9752841630','sharmila.a@email.com','Trichy',
'Arun P','9648173250',
'HDFC Ergo','INS1094',1),

('MRN1095','Bharath','Murali','1989-08-31','Male','O-',
'9486173520','bharath.m@email.com','Coimbatore',
'Revathi Murali','9532817460',
'Star Health','INS1095',1),

('MRN1096','Deepika','Rajesh','1994-11-16','Female','A-',
'9815437260','deepika.r@email.com','Erode',
'Rajesh K','9743162850',
'ICICI Lombard','INS1096',1),

('MRN1097','Sarath','Balaji','1990-05-24','Male','B-',
'9632784510','sarath.b@email.com','Chennai',
'Balaji S','9865243170',
'HDFC Ergo','INS1097',1),

('MRN1098','Pavithra','Natarajan','1998-09-05','Female','A+',
'9348621750','pavithra.n@email.com','Madurai',
'Natarajan R','9517382640',
'Star Health','INS1098',1),

('MRN1099','Karthik','Venkatesh','1993-07-12','Male','AB-',
'9794263815','karthik.v@email.com','Salem',
'Venkatesh K','9647351280',
'ICICI Lombard','INS1099',1),

('MRN1100','Anjali','Raghavan','1996-12-22','Female','O+',
'9527813640','anjali.r@email.com','Trichy',
'Raghavan S','9751628430',
'HDFC Ergo','INS1100',1);

INSERT INTO Consultation
(
    ConsultationNumber,
    PatientID,
    DoctorID,
    VisitTypeID,
    ConsultationDate,
    ChiefComplaint,
    PresentIllness,
    PastMedicalHistory,
    FamilyHistory,
    SocialHistory,
    ReviewOfSystems,
    BloodPressureSys,
    BloodPressureDia,
    HeartRate,
    RespiratoryRate,
    Temperature,
    OxygenSaturation,
    WeightLbs,
    HeightInches,
    BMI,
    PhysicalExam,
    AssessmentPlan,
    FollowUpDays,
    ConsultationStatus,
    CreatedAt,
    UpdatedAt
)
VALUES
(
'CONS1001',
1,
1,
1,
GETDATE(),
'Fever and headache',
'Fever for 2 days with mild headache',
'No major illness',
'Father has hypertension',
'Non-smoker',
'Normal',
120,
80,
72,
18,
98.6,
99,
150,
68,
22.8,
'Normal examination',
'Paracetamol and hydration advised',
7,
'Completed',
GETDATE(),
GETDATE()
),

(
'CONS1002',
2,
2,
4,
GETDATE(),
'Cough and cold',
'Persistent cough for 5 days',
'Asthma history',
'Mother has diabetes',
'Occasional alcohol use',
'Normal',
118,
78,
74,
17,
99.1,
98,
135,
64,
23.2,
'Mild throat congestion',
'Antibiotics prescribed',
5,
'Completed',
GETDATE(),
GETDATE()
),

(
'CONS1003',
3,
3,
3,
GETDATE(),
'Stomach pain',
'Abdominal discomfort after meals',
'Gastritis',
'No significant history',
'Non-smoker',
'Normal',
122,
82,
76,
19,
98.4,
99,
160,
70,
22.9,
'Mild abdominal tenderness',
'Antacid medication prescribed',
10,
'Completed',
GETDATE(),
GETDATE()
);

INSERT INTO Consultation
(
ConsultationNumber,
PatientID,
DoctorID,
VisitTypeID,
ConsultationDate,
ChiefComplaint,
PresentIllness,
PastMedicalHistory,
FamilyHistory,
SocialHistory,
ReviewOfSystems,
BloodPressureSys,
BloodPressureDia,
HeartRate,
RespiratoryRate,
Temperature,
OxygenSaturation,
WeightLbs,
HeightInches,
BMI,
PhysicalExam,
AssessmentPlan,
FollowUpDays,
ConsultationStatus,
CreatedAt,
UpdatedAt
)
VALUES
(
'CONS1004',
4,
1,
1,
GETDATE(),
'Fever and body pain',
'High fever for 3 days',
'No major illness',
'Father has diabetes',
'Non-smoker',
'Normal',
120,
80,
74,
18,
99.2,
98,
155,
69,
22.9,
'Normal examination',
'Paracetamol and rest advised',
7,
'Completed',
GETDATE(),
GETDATE()
),

(
'CONS1005',
5,
2,
4,
GETDATE(),
'Sneezing and allergy',
'Frequent sneezing for 5 days',
'Allergic rhinitis',
'Mother has asthma',
'Non-smoker',
'Normal',
118,
78,
72,
17,
98.8,
99,
130,
64,
22.3,
'Mild nasal congestion',
'Antihistamine prescribed',
5,
'Completed',
GETDATE(),
GETDATE()
),

(
'CONS1006',
6,
3,
3,
GETDATE(),
'Acidity and stomach pain',
'Burning sensation after meals',
'Gastritis',
'No significant history',
'Occasional alcohol use',
'Normal',
122,
82,
76,
18,
98.6,
99,
165,
70,
23.7,
'Mild abdominal tenderness',
'Antacid medication prescribed',
10,
'Completed',
GETDATE(),
GETDATE()
);

INSERT INTO Prescription
(
    RxNumber,
    ConsultationID,
    PatientID,
    DoctorID,
    PharmacyID,
    StatusID,
    IsElectronic,
    SpecialInstructions,
    Notes
)
VALUES
('RX-20260615-0001',1,1,1,1,1,1,'Take with food','Fever treatment'),

('RX-20260615-0002',2,2,2,2,1,1,'Avoid cold drinks','Cold and cough treatment'),

('RX-20260615-0003',3,3,3,3,1,1,'Do not skip doses','Gastric medication');

INSERT INTO Prescription
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
'RX-20260615-0004',
4,
4,
1,
1,
GETDATE(),
1,
1,
'Take with food',
'Fever treatment',
GETDATE(),
GETDATE()
),

(
'RX-20260615-0005',
5,
5,
2,
2,
GETDATE(),
1,
1,
'Avoid dust and cold drinks',
'Allergy treatment',
GETDATE(),
GETDATE()
),

(
'RX-20260615-0006',
6,
6,
3,
3,
GETDATE(),
1,
1,
'Avoid spicy foods',
'Acidity treatment',
GETDATE(),
GETDATE()
);

INSERT INTO PrescriptionItem
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
SubstitutionAllowed
)
VALUES
(
1,1,3,'500 mg',5,15,0,0,
GETDATE(),
DATEADD(DAY,5,GETDATE()),
'Take one tablet three times daily after meals',
1
),

(
2,2,2,'10 mg',7,14,0,0,
GETDATE(),
DATEADD(DAY,7,GETDATE()),
'Take one tablet twice daily',
1
),

(
3,3,2,'250 mg',10,20,0,0,
GETDATE(),
DATEADD(DAY,10,GETDATE()),
'Take one capsule twice daily after food',
1
);

UPDATE PrescriptionItem
SET PrescriptionID = 5
WHERE ItemID = 4;

UPDATE PrescriptionItem
SET PrescriptionID = 6
WHERE ItemID = 5;

UPDATE PrescriptionItem
SET PrescriptionID = 7
WHERE ItemID = 6;