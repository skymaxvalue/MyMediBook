USE [master]
GO
/****** Object:  Database [db53801]    Script Date: 6/8/2026 10:21:33 PM ******/
CREATE DATABASE [db53801]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'db53801', FILENAME = N'D:\Services\MSSQL\Data\db53801.mdf' , SIZE = 73728KB , MAXSIZE = 1048576KB , FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'db53801_log', FILENAME = N'D:\Services\MSSQL\Data\db53801_log.ldf' , SIZE = 8192KB , MAXSIZE = 5242880KB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [db53801].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [db53801] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [db53801] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [db53801] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [db53801] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [db53801] SET ARITHABORT OFF 
GO
ALTER DATABASE [db53801] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [db53801] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [db53801] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [db53801] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [db53801] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [db53801] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [db53801] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [db53801] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [db53801] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [db53801] SET  ENABLE_BROKER 
GO
ALTER DATABASE [db53801] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [db53801] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [db53801] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [db53801] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [db53801] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [db53801] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [db53801] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [db53801] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [db53801] SET  MULTI_USER 
GO
ALTER DATABASE [db53801] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [db53801] SET DB_CHAINING OFF 
GO
ALTER DATABASE [db53801] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [db53801] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [db53801] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [db53801] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [db53801] SET QUERY_STORE = ON
GO
ALTER DATABASE [db53801] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [db53801]
GO
/****** Object:  Schema [HangFire]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE SCHEMA [HangFire]
GO
/****** Object:  FullTextCatalog [db53801]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE FULLTEXT CATALOG [db53801] WITH ACCENT_SENSITIVITY = ON
AS DEFAULT
GO
/****** Object:  Table [dbo].[AppointmentInsuranceMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppointmentInsuranceMaster](
	[InsuranceId] [int] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [int] NOT NULL,
	[Provider] [varchar](200) NULL,
	[PolicyNumber] [varchar](100) NULL,
	[GroupId] [varchar](100) NULL,
	[HolderName] [varchar](200) NULL,
	[Address] [varchar](300) NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[InsuranceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppointmentPaymentMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppointmentPaymentMaster](
	[PaymentId] [int] IDENTITY(1,1) NOT NULL,
	[AppointmentId] [int] NOT NULL,
	[PaymentType] [varchar](50) NULL,
	[TransactionId] [varchar](100) NULL,
	[Amount] [decimal](18, 2) NULL,
	[PaymentStatus] [varchar](20) NULL,
	[CreatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[PaymentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[TransactionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Appointments]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointments](
	[AppointmentId] [int] IDENTITY(1,1) NOT NULL,
	[PatientId] [int] NOT NULL,
	[DoctorId] [int] NOT NULL,
	[SlotId] [int] NOT NULL,
	[AppointmentDate] [date] NOT NULL,
	[TimeSlot] [nvarchar](20) NOT NULL,
	[Status] [nvarchar](20) NOT NULL,
	[VisitPurpose] [nvarchar](300) NULL,
	[VisitType] [nvarchar](50) NULL,
	[OtpMethod] [nvarchar](50) NULL,
	[UpdatedDate] [datetime] NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AppointmentSlots]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AppointmentSlots](
	[SlotId] [int] IDENTITY(1,1) NOT NULL,
	[DoctorId] [int] NOT NULL,
	[SlotDate] [date] NOT NULL,
	[TimeSlot] [nvarchar](20) NOT NULL,
	[IsBooked] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SlotId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CitiesMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CitiesMaster](
	[CityId] [int] IDENTITY(1,1) NOT NULL,
	[CityName] [varchar](100) NOT NULL,
	[StateId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CountriesMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CountriesMaster](
	[CountryId] [int] IDENTITY(1,1) NOT NULL,
	[CountryName] [varchar](100) NOT NULL,
	[CountryCode] [char](2) NOT NULL,
	[PhoneCode] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[CountryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[CountryCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Department]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Department](
	[DepartmentId] [int] IDENTITY(1,1) NOT NULL,
	[DepartmentName] [varchar](150) NOT NULL,
	[Description] [varchar](300) NULL,
	[ParentDepartmentId] [int] NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedDate] [datetime] NULL,
	[SpecialityId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DepartmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DOCTOR_NOTIFICATION]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DOCTOR_NOTIFICATION](
	[Notification_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_Test_ID] [int] NOT NULL,
	[Doctor_ID] [int] NOT NULL,
	[Doctor_Notification_Date] [datetime] NULL,
	[Doctor_Status] [varchar](20) NULL,
	[Patient_Notification_ID] [int] NULL,
	[Patient_Notification_Date] [datetime] NULL,
	[Patient_Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Notification_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DoctorAvailability]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoctorAvailability](
	[AvailabilityId] [int] IDENTITY(1,1) NOT NULL,
	[DoctorId] [int] NOT NULL,
	[DayOfWeek] [nvarchar](10) NOT NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[IsAvailable] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AvailabilityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DoctorMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DoctorMaster](
	[DoctorId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[SpecialityId] [int] NOT NULL,
	[DepartmentId] [int] NOT NULL,
	[Email] [nvarchar](200) NOT NULL,
	[Phone] [nvarchar](15) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[DoctorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ErrorLogs]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ErrorLogs](
	[ErrorId] [int] IDENTITY(1,1) NOT NULL,
	[IsDBError] [bit] NULL,
	[ObjectId] [int] NULL,
	[Error_Line] [int] NULL,
	[Error_Message] [nvarchar](max) NULL,
	[Error_Procedure] [nvarchar](500) NULL,
	[Error_Trace] [nvarchar](max) NULL,
	[Error_Severity] [int] NULL,
	[Error_State] [int] NULL,
	[CreatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ErrorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_AUDIT_LOG]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_AUDIT_LOG](
	[Audit_ID] [int] IDENTITY(1,1) NOT NULL,
	[Table_Name] [varchar](100) NOT NULL,
	[Record_ID] [int] NOT NULL,
	[Old_Value] [varchar](max) NULL,
	[New_Value] [varchar](max) NULL,
	[Modified_By] [varchar](100) NULL,
	[Modified_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Audit_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_INSTRUMENT]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_INSTRUMENT](
	[Instrument_ID] [int] IDENTITY(1,1) NOT NULL,
	[Instrument_Name] [varchar](100) NOT NULL,
	[Manufacturer] [varchar](100) NULL,
	[Model] [varchar](100) NULL,
	[Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Instrument_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_ORDER]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_ORDER](
	[Order_ID] [int] IDENTITY(1,1) NOT NULL,
	[Patient_ID] [int] NOT NULL,
	[Doctor_ID] [int] NOT NULL,
	[Order_Date] [datetime] NOT NULL,
	[Priority] [varchar](20) NULL,
	[Notes] [varchar](500) NULL,
	[Status] [varchar](20) NULL,
	[Created_By] [varchar](100) NULL,
	[Created_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Order_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_ORDER_TEST]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_ORDER_TEST](
	[Order_Test_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_ID] [int] NOT NULL,
	[Test_ID] [int] NOT NULL,
	[Status] [varchar](20) NULL,
	[Sample_Collected_Date] [datetime] NULL,
	[Completed_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Order_Test_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_QC_RUN]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_QC_RUN](
	[QC_Run_ID] [int] IDENTITY(1,1) NOT NULL,
	[Instrument_ID] [int] NOT NULL,
	[Test_ID] [int] NOT NULL,
	[Run_Date] [datetime] NOT NULL,
	[Control_Level] [varchar](50) NULL,
	[Result_Value] [varchar](100) NULL,
	[Status] [varchar](20) NULL,
	[Comments] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[QC_Run_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_RESULT]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_RESULT](
	[Result_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_Test_ID] [int] NOT NULL,
	[Result_Value] [varchar](100) NULL,
	[Units] [varchar](50) NULL,
	[Normal_Range] [varchar](200) NULL,
	[Interpretation] [varchar](50) NULL,
	[Comments] [varchar](500) NULL,
	[Status] [varchar](20) NULL,
	[Entered_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Result_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_TEST_COMPONENT]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_TEST_COMPONENT](
	[Component_ID] [int] IDENTITY(1,1) NOT NULL,
	[Test_ID] [int] NOT NULL,
	[Component_Name] [varchar](200) NOT NULL,
	[Unit_ID] [int] NULL,
	[Display_Order] [int] NULL,
	[Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Component_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LAB_TEST_MASTER]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LAB_TEST_MASTER](
	[Test_ID] [int] IDENTITY(1,1) NOT NULL,
	[Test_Code] [varchar](50) NOT NULL,
	[Test_Name] [varchar](200) NOT NULL,
	[Category] [varchar](100) NULL,
	[Sample_Type] [varchar](100) NULL,
	[Normal_Range_Male] [varchar](200) NULL,
	[Normal_Range_Female] [varchar](200) NULL,
	[Normal_Range_Child] [varchar](200) NULL,
	[Units] [varchar](50) NULL,
	[Description] [varchar](500) NULL,
	[Turnaround_Time] [int] NULL,
	[Price] [decimal](10, 2) NULL,
	[Status] [varchar](20) NULL,
	[Created_By] [varchar](100) NULL,
	[Created_Date] [datetime] NULL,
	[Modified_By] [varchar](100) NULL,
	[Modified_Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Test_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Test_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Login]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Login](
	[LoginId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Username] [varchar](150) NOT NULL,
	[PasswordHash] [varbinary](500) NOT NULL,
	[PasswordSalt] [varbinary](500) NOT NULL,
	[LastLoginDate] [datetime] NULL,
	[IsLocked] [bit] NOT NULL,
	[FailedAttempts] [int] NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[LoginId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NORMAL_RANGE]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NORMAL_RANGE](
	[Range_ID] [int] IDENTITY(1,1) NOT NULL,
	[Component_ID] [int] NOT NULL,
	[Gender] [varchar](10) NULL,
	[Age_From] [int] NULL,
	[Age_To] [int] NULL,
	[Min_Value] [decimal](10, 2) NULL,
	[Max_Value] [decimal](10, 2) NULL,
	[Unit_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Range_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OtpMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OtpMaster](
	[OtpId] [int] IDENTITY(1,1) NOT NULL,
	[OtpHash] [varbinary](500) NOT NULL,
	[OtpSalt] [varbinary](500) NOT NULL,
	[OtpExpiry] [datetime] NOT NULL,
	[OtpAttempts] [int] NULL,
	[IsUsed] [bit] NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedDate] [datetime] NULL,
	[PatientId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[OtpId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Patient]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Patient](
	[PatientId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](100) NOT NULL,
	[MiddleName] [varchar](100) NULL,
	[LastName] [varchar](100) NOT NULL,
	[DateOfBirth] [date] NOT NULL,
	[PhoneNumber] [varchar](20) NOT NULL,
	[Email] [varchar](200) NOT NULL,
	[Gender] [varchar](20) NULL,
	[AddressLine1] [varchar](200) NOT NULL,
	[AddressLine2] [varchar](200) NULL,
	[CityId] [int] NOT NULL,
	[ZipCode] [varchar](20) NOT NULL,
	[StateId] [int] NULL,
	[CountryId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](100) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedDate] [datetime] NULL,
	[PhoneCountryCode] [varchar](10) NULL,
 CONSTRAINT [PK_Patient] PRIMARY KEY CLUSTERED 
(
	[PatientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ_Patient_Email] UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PatientLoginMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PatientLoginMaster](
	[LoginId] [int] IDENTITY(1,1) NOT NULL,
	[PatientId] [int] NOT NULL,
	[Username] [varchar](150) NOT NULL,
	[PasswordHash] [varbinary](500) NOT NULL,
	[PasswordSalt] [varbinary](500) NOT NULL,
	[SecurityQuestionId] [int] NOT NULL,
	[SecurityAnswerHash] [varbinary](500) NOT NULL,
	[SecurityAnswerSalt] [varbinary](500) NOT NULL,
	[LastLoginDate] [datetime] NULL,
	[IsLocked] [bit] NOT NULL,
	[FailedAttempts] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[LoginId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Role]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Role](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [varchar](100) NOT NULL,
	[Description] [varchar](300) NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SAMPLE]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SAMPLE](
	[Sample_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_Test_ID] [int] NOT NULL,
	[Specimen_Type_ID] [int] NOT NULL,
	[Barcode] [varchar](100) NOT NULL,
	[Collection_Date] [datetime] NULL,
	[Collected_By] [varchar](100) NULL,
	[Status] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[Sample_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SecurityQuestionMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SecurityQuestionMaster](
	[QuestionId] [int] IDENTITY(1,1) NOT NULL,
	[QuestionText] [varchar](300) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[QuestionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SpecialityMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SpecialityMaster](
	[SpecialityId] [int] IDENTITY(1,1) NOT NULL,
	[SpecialityName] [nvarchar](100) NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[SpecialityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SPECIMEN_TYPE]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SPECIMEN_TYPE](
	[Specimen_Type_ID] [int] IDENTITY(1,1) NOT NULL,
	[Specimen_Name] [varchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Specimen_Type_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StatesMaster]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StatesMaster](
	[StateId] [int] IDENTITY(1,1) NOT NULL,
	[StateName] [varchar](100) NOT NULL,
	[CountryId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[StateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TEST_METHOD]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TEST_METHOD](
	[Method_ID] [int] IDENTITY(1,1) NOT NULL,
	[Method_Name] [varchar](100) NOT NULL,
	[Instrument_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Method_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UNIT_MASTER]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UNIT_MASTER](
	[Unit_ID] [int] IDENTITY(1,1) NOT NULL,
	[Unit_Code] [varchar](50) NOT NULL,
	[Unit_Name] [varchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Unit_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [varchar](100) NOT NULL,
	[LastName] [varchar](100) NOT NULL,
	[Email] [varchar](200) NOT NULL,
	[PhoneNumber] [varchar](20) NULL,
	[DepartmentId] [int] NULL,
	[RoleId] [int] NOT NULL,
	[IsActive] [bit] NOT NULL,
	[CreatedBy] [varchar](100) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedBy] [varchar](100) NULL,
	[UpdatedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[AggregatedCounter]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[AggregatedCounter](
	[Key] [nvarchar](100) NOT NULL,
	[Value] [bigint] NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_CounterAggregated] PRIMARY KEY CLUSTERED 
(
	[Key] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Counter]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Counter](
	[Key] [nvarchar](100) NOT NULL,
	[Value] [int] NOT NULL,
	[ExpireAt] [datetime] NULL,
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_HangFire_Counter] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Hash]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Hash](
	[Key] [nvarchar](100) NOT NULL,
	[Field] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[ExpireAt] [datetime2](7) NULL,
 CONSTRAINT [PK_HangFire_Hash] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Field] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Job]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Job](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[StateId] [bigint] NULL,
	[StateName] [nvarchar](20) NULL,
	[InvocationData] [nvarchar](max) NOT NULL,
	[Arguments] [nvarchar](max) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_Job] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[JobParameter]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[JobParameter](
	[JobId] [bigint] NOT NULL,
	[Name] [nvarchar](40) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_HangFire_JobParameter] PRIMARY KEY CLUSTERED 
(
	[JobId] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[JobQueue]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[JobQueue](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[JobId] [bigint] NOT NULL,
	[Queue] [nvarchar](50) NOT NULL,
	[FetchedAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_JobQueue] PRIMARY KEY CLUSTERED 
(
	[Queue] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[List]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[List](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Key] [nvarchar](100) NOT NULL,
	[Value] [nvarchar](max) NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_List] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Schema]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Schema](
	[Version] [int] NOT NULL,
 CONSTRAINT [PK_HangFire_Schema] PRIMARY KEY CLUSTERED 
(
	[Version] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Server]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Server](
	[Id] [nvarchar](200) NOT NULL,
	[Data] [nvarchar](max) NULL,
	[LastHeartbeat] [datetime] NOT NULL,
 CONSTRAINT [PK_HangFire_Server] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[Set]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[Set](
	[Key] [nvarchar](100) NOT NULL,
	[Score] [float] NOT NULL,
	[Value] [nvarchar](256) NOT NULL,
	[ExpireAt] [datetime] NULL,
 CONSTRAINT [PK_HangFire_Set] PRIMARY KEY CLUSTERED 
(
	[Key] ASC,
	[Value] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = ON, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [HangFire].[State]    Script Date: 6/8/2026 10:21:35 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [HangFire].[State](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[JobId] [bigint] NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
	[Reason] [nvarchar](100) NULL,
	[CreatedAt] [datetime] NOT NULL,
	[Data] [nvarchar](max) NULL,
 CONSTRAINT [PK_HangFire_State] PRIMARY KEY CLUSTERED 
(
	[JobId] ASC,
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_AggregatedCounter_ExpireAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_AggregatedCounter_ExpireAt] ON [HangFire].[AggregatedCounter]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Hash_ExpireAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Hash_ExpireAt] ON [HangFire].[Hash]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Job_ExpireAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Job_ExpireAt] ON [HangFire].[Job]
(
	[ExpireAt] ASC
)
INCLUDE([StateName]) 
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_HangFire_Job_StateName]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Job_StateName] ON [HangFire].[Job]
(
	[StateName] ASC
)
WHERE ([StateName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_List_ExpireAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_List_ExpireAt] ON [HangFire].[List]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Server_LastHeartbeat]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Server_LastHeartbeat] ON [HangFire].[Server]
(
	[LastHeartbeat] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_Set_ExpireAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_ExpireAt] ON [HangFire].[Set]
(
	[ExpireAt] ASC
)
WHERE ([ExpireAt] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_HangFire_Set_Score]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_Set_Score] ON [HangFire].[Set]
(
	[Key] ASC,
	[Score] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_HangFire_State_CreatedAt]    Script Date: 6/8/2026 10:21:35 PM ******/
CREATE NONCLUSTERED INDEX [IX_HangFire_State_CreatedAt] ON [HangFire].[State]
(
	[CreatedAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AppointmentInsuranceMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AppointmentPaymentMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Appointments] ADD  DEFAULT ('Scheduled') FOR [Status]
GO
ALTER TABLE [dbo].[Appointments] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AppointmentSlots] ADD  DEFAULT ((0)) FOR [IsBooked]
GO
ALTER TABLE [dbo].[AppointmentSlots] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[CountriesMaster] ADD  DEFAULT (NULL) FOR [PhoneCode]
GO
ALTER TABLE [dbo].[Department] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Department] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION] ADD  DEFAULT ('Sent') FOR [Doctor_Status]
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION] ADD  DEFAULT ('Sent') FOR [Patient_Status]
GO
ALTER TABLE [dbo].[DoctorAvailability] ADD  DEFAULT ((1)) FOR [IsAvailable]
GO
ALTER TABLE [dbo].[DoctorAvailability] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[DoctorMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[DoctorMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[ErrorLogs] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[LAB_AUDIT_LOG] ADD  DEFAULT (getdate()) FOR [Modified_Date]
GO
ALTER TABLE [dbo].[LAB_INSTRUMENT] ADD  DEFAULT ('Active') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_ORDER] ADD  DEFAULT ('New') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_ORDER] ADD  DEFAULT (getdate()) FOR [Created_Date]
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST] ADD  DEFAULT ('Pending') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_QC_RUN] ADD  DEFAULT ('WithinLimits') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_RESULT] ADD  DEFAULT ('Entered') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_RESULT] ADD  DEFAULT (getdate()) FOR [Entered_Date]
GO
ALTER TABLE [dbo].[LAB_TEST_COMPONENT] ADD  DEFAULT ('Active') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_TEST_MASTER] ADD  DEFAULT ('Active') FOR [Status]
GO
ALTER TABLE [dbo].[LAB_TEST_MASTER] ADD  DEFAULT (getdate()) FOR [Created_Date]
GO
ALTER TABLE [dbo].[Login] ADD  DEFAULT ((0)) FOR [IsLocked]
GO
ALTER TABLE [dbo].[Login] ADD  DEFAULT ((0)) FOR [FailedAttempts]
GO
ALTER TABLE [dbo].[Login] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[OtpMaster] ADD  DEFAULT ((0)) FOR [OtpAttempts]
GO
ALTER TABLE [dbo].[OtpMaster] ADD  DEFAULT ((0)) FOR [IsUsed]
GO
ALTER TABLE [dbo].[OtpMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Patient] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Patient] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[PatientLoginMaster] ADD  DEFAULT ((0)) FOR [IsLocked]
GO
ALTER TABLE [dbo].[PatientLoginMaster] ADD  DEFAULT ((0)) FOR [FailedAttempts]
GO
ALTER TABLE [dbo].[PatientLoginMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[PatientLoginMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Role] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Role] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[SAMPLE] ADD  DEFAULT ('Collected') FOR [Status]
GO
ALTER TABLE [dbo].[SecurityQuestionMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SecurityQuestionMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[SpecialityMaster] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[SpecialityMaster] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[AppointmentInsuranceMaster]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentInsurance_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointments] ([AppointmentId])
GO
ALTER TABLE [dbo].[AppointmentInsuranceMaster] CHECK CONSTRAINT [FK_AppointmentInsurance_Appointment]
GO
ALTER TABLE [dbo].[AppointmentPaymentMaster]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentPayment_Appointment] FOREIGN KEY([AppointmentId])
REFERENCES [dbo].[Appointments] ([AppointmentId])
GO
ALTER TABLE [dbo].[AppointmentPaymentMaster] CHECK CONSTRAINT [FK_AppointmentPayment_Appointment]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Doctor] FOREIGN KEY([DoctorId])
REFERENCES [dbo].[DoctorMaster] ([DoctorId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Doctor]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Patient] FOREIGN KEY([PatientId])
REFERENCES [dbo].[Patient] ([PatientId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Patient]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD  CONSTRAINT [FK_Appointments_Slot] FOREIGN KEY([SlotId])
REFERENCES [dbo].[AppointmentSlots] ([SlotId])
GO
ALTER TABLE [dbo].[Appointments] CHECK CONSTRAINT [FK_Appointments_Slot]
GO
ALTER TABLE [dbo].[AppointmentSlots]  WITH CHECK ADD  CONSTRAINT [FK_AppointmentSlots_Doctor] FOREIGN KEY([DoctorId])
REFERENCES [dbo].[DoctorMaster] ([DoctorId])
GO
ALTER TABLE [dbo].[AppointmentSlots] CHECK CONSTRAINT [FK_AppointmentSlots_Doctor]
GO
ALTER TABLE [dbo].[CitiesMaster]  WITH CHECK ADD  CONSTRAINT [FK_CitiesMaster_StatesMaster] FOREIGN KEY([StateId])
REFERENCES [dbo].[StatesMaster] ([StateId])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[CitiesMaster] CHECK CONSTRAINT [FK_CitiesMaster_StatesMaster]
GO
ALTER TABLE [dbo].[Department]  WITH CHECK ADD  CONSTRAINT [FK_Department_ParentDepartment] FOREIGN KEY([ParentDepartmentId])
REFERENCES [dbo].[Department] ([DepartmentId])
GO
ALTER TABLE [dbo].[Department] CHECK CONSTRAINT [FK_Department_ParentDepartment]
GO
ALTER TABLE [dbo].[Department]  WITH CHECK ADD  CONSTRAINT [FK_Department_Speciality] FOREIGN KEY([SpecialityId])
REFERENCES [dbo].[SpecialityMaster] ([SpecialityId])
GO
ALTER TABLE [dbo].[Department] CHECK CONSTRAINT [FK_Department_Speciality]
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION]  WITH CHECK ADD  CONSTRAINT [FK_NOTIFICATION_ORDER_TEST] FOREIGN KEY([Order_Test_ID])
REFERENCES [dbo].[LAB_ORDER_TEST] ([Order_Test_ID])
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION] CHECK CONSTRAINT [FK_NOTIFICATION_ORDER_TEST]
GO
ALTER TABLE [dbo].[DoctorAvailability]  WITH CHECK ADD  CONSTRAINT [FK_DoctorAvailability_Doctor] FOREIGN KEY([DoctorId])
REFERENCES [dbo].[DoctorMaster] ([DoctorId])
GO
ALTER TABLE [dbo].[DoctorAvailability] CHECK CONSTRAINT [FK_DoctorAvailability_Doctor]
GO
ALTER TABLE [dbo].[DoctorMaster]  WITH CHECK ADD  CONSTRAINT [FK_DoctorMaster_Department] FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Department] ([DepartmentId])
GO
ALTER TABLE [dbo].[DoctorMaster] CHECK CONSTRAINT [FK_DoctorMaster_Department]
GO
ALTER TABLE [dbo].[DoctorMaster]  WITH CHECK ADD  CONSTRAINT [FK_DoctorMaster_Speciality] FOREIGN KEY([SpecialityId])
REFERENCES [dbo].[SpecialityMaster] ([SpecialityId])
GO
ALTER TABLE [dbo].[DoctorMaster] CHECK CONSTRAINT [FK_DoctorMaster_Speciality]
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_TEST_ORDER] FOREIGN KEY([Order_ID])
REFERENCES [dbo].[LAB_ORDER] ([Order_ID])
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST] CHECK CONSTRAINT [FK_ORDER_TEST_ORDER]
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_TEST_TEST] FOREIGN KEY([Test_ID])
REFERENCES [dbo].[LAB_TEST_MASTER] ([Test_ID])
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST] CHECK CONSTRAINT [FK_ORDER_TEST_TEST]
GO
ALTER TABLE [dbo].[LAB_QC_RUN]  WITH CHECK ADD  CONSTRAINT [FK_QC_INSTRUMENT] FOREIGN KEY([Instrument_ID])
REFERENCES [dbo].[LAB_INSTRUMENT] ([Instrument_ID])
GO
ALTER TABLE [dbo].[LAB_QC_RUN] CHECK CONSTRAINT [FK_QC_INSTRUMENT]
GO
ALTER TABLE [dbo].[LAB_QC_RUN]  WITH CHECK ADD  CONSTRAINT [FK_QC_TEST] FOREIGN KEY([Test_ID])
REFERENCES [dbo].[LAB_TEST_MASTER] ([Test_ID])
GO
ALTER TABLE [dbo].[LAB_QC_RUN] CHECK CONSTRAINT [FK_QC_TEST]
GO
ALTER TABLE [dbo].[LAB_RESULT]  WITH CHECK ADD  CONSTRAINT [FK_RESULT_ORDER_TEST] FOREIGN KEY([Order_Test_ID])
REFERENCES [dbo].[LAB_ORDER_TEST] ([Order_Test_ID])
GO
ALTER TABLE [dbo].[LAB_RESULT] CHECK CONSTRAINT [FK_RESULT_ORDER_TEST]
GO
ALTER TABLE [dbo].[LAB_TEST_COMPONENT]  WITH CHECK ADD  CONSTRAINT [FK_COMPONENT_TEST] FOREIGN KEY([Test_ID])
REFERENCES [dbo].[LAB_TEST_MASTER] ([Test_ID])
GO
ALTER TABLE [dbo].[LAB_TEST_COMPONENT] CHECK CONSTRAINT [FK_COMPONENT_TEST]
GO
ALTER TABLE [dbo].[LAB_TEST_COMPONENT]  WITH CHECK ADD  CONSTRAINT [FK_COMPONENT_UNIT] FOREIGN KEY([Unit_ID])
REFERENCES [dbo].[UNIT_MASTER] ([Unit_ID])
GO
ALTER TABLE [dbo].[LAB_TEST_COMPONENT] CHECK CONSTRAINT [FK_COMPONENT_UNIT]
GO
ALTER TABLE [dbo].[Login]  WITH CHECK ADD  CONSTRAINT [FK_Login_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Login] CHECK CONSTRAINT [FK_Login_Users]
GO
ALTER TABLE [dbo].[NORMAL_RANGE]  WITH CHECK ADD  CONSTRAINT [FK_NORMAL_RANGE_COMPONENT] FOREIGN KEY([Component_ID])
REFERENCES [dbo].[LAB_TEST_COMPONENT] ([Component_ID])
GO
ALTER TABLE [dbo].[NORMAL_RANGE] CHECK CONSTRAINT [FK_NORMAL_RANGE_COMPONENT]
GO
ALTER TABLE [dbo].[NORMAL_RANGE]  WITH CHECK ADD  CONSTRAINT [FK_NORMAL_RANGE_UNIT] FOREIGN KEY([Unit_ID])
REFERENCES [dbo].[UNIT_MASTER] ([Unit_ID])
GO
ALTER TABLE [dbo].[NORMAL_RANGE] CHECK CONSTRAINT [FK_NORMAL_RANGE_UNIT]
GO
ALTER TABLE [dbo].[OtpMaster]  WITH CHECK ADD  CONSTRAINT [FK_OtpMaster_Patient] FOREIGN KEY([PatientId])
REFERENCES [dbo].[Patient] ([PatientId])
GO
ALTER TABLE [dbo].[OtpMaster] CHECK CONSTRAINT [FK_OtpMaster_Patient]
GO
ALTER TABLE [dbo].[PatientLoginMaster]  WITH CHECK ADD  CONSTRAINT [FK_PatientLoginMaster_Patient] FOREIGN KEY([PatientId])
REFERENCES [dbo].[Patient] ([PatientId])
GO
ALTER TABLE [dbo].[PatientLoginMaster] CHECK CONSTRAINT [FK_PatientLoginMaster_Patient]
GO
ALTER TABLE [dbo].[PatientLoginMaster]  WITH CHECK ADD  CONSTRAINT [FK_PatientLoginMaster_SecurityQuestion] FOREIGN KEY([SecurityQuestionId])
REFERENCES [dbo].[SecurityQuestionMaster] ([QuestionId])
GO
ALTER TABLE [dbo].[PatientLoginMaster] CHECK CONSTRAINT [FK_PatientLoginMaster_SecurityQuestion]
GO
ALTER TABLE [dbo].[SAMPLE]  WITH CHECK ADD  CONSTRAINT [FK_SAMPLE_ORDER_TEST] FOREIGN KEY([Order_Test_ID])
REFERENCES [dbo].[LAB_ORDER_TEST] ([Order_Test_ID])
GO
ALTER TABLE [dbo].[SAMPLE] CHECK CONSTRAINT [FK_SAMPLE_ORDER_TEST]
GO
ALTER TABLE [dbo].[SAMPLE]  WITH CHECK ADD  CONSTRAINT [FK_SAMPLE_SPECIMEN] FOREIGN KEY([Specimen_Type_ID])
REFERENCES [dbo].[SPECIMEN_TYPE] ([Specimen_Type_ID])
GO
ALTER TABLE [dbo].[SAMPLE] CHECK CONSTRAINT [FK_SAMPLE_SPECIMEN]
GO
ALTER TABLE [dbo].[StatesMaster]  WITH CHECK ADD  CONSTRAINT [FK_StatesMaster_CountriesMaster] FOREIGN KEY([CountryId])
REFERENCES [dbo].[CountriesMaster] ([CountryId])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[StatesMaster] CHECK CONSTRAINT [FK_StatesMaster_CountriesMaster]
GO
ALTER TABLE [dbo].[TEST_METHOD]  WITH CHECK ADD  CONSTRAINT [FK_TEST_METHOD_INSTRUMENT] FOREIGN KEY([Instrument_ID])
REFERENCES [dbo].[LAB_INSTRUMENT] ([Instrument_ID])
GO
ALTER TABLE [dbo].[TEST_METHOD] CHECK CONSTRAINT [FK_TEST_METHOD_INSTRUMENT]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Department] FOREIGN KEY([DepartmentId])
REFERENCES [dbo].[Department] ([DepartmentId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Department]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Role] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Role] ([RoleId])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Role]
GO
ALTER TABLE [HangFire].[JobParameter]  WITH CHECK ADD  CONSTRAINT [FK_HangFire_JobParameter_Job] FOREIGN KEY([JobId])
REFERENCES [HangFire].[Job] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [HangFire].[JobParameter] CHECK CONSTRAINT [FK_HangFire_JobParameter_Job]
GO
ALTER TABLE [HangFire].[State]  WITH CHECK ADD  CONSTRAINT [FK_HangFire_State_Job] FOREIGN KEY([JobId])
REFERENCES [HangFire].[Job] ([Id])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [HangFire].[State] CHECK CONSTRAINT [FK_HangFire_State_Job]
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION]  WITH CHECK ADD  CONSTRAINT [CHK_DN_DoctorStatus] CHECK  (([Doctor_Status]='Read' OR [Doctor_Status]='Sent'))
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION] CHECK CONSTRAINT [CHK_DN_DoctorStatus]
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION]  WITH CHECK ADD  CONSTRAINT [CHK_DN_PatientStatus] CHECK  (([Patient_Status]='Read' OR [Patient_Status]='Sent'))
GO
ALTER TABLE [dbo].[DOCTOR_NOTIFICATION] CHECK CONSTRAINT [CHK_DN_PatientStatus]
GO
ALTER TABLE [dbo].[LAB_ORDER]  WITH CHECK ADD  CONSTRAINT [CHK_LO_Priority] CHECK  (([Priority]='STAT' OR [Priority]='Routine'))
GO
ALTER TABLE [dbo].[LAB_ORDER] CHECK CONSTRAINT [CHK_LO_Priority]
GO
ALTER TABLE [dbo].[LAB_ORDER]  WITH CHECK ADD  CONSTRAINT [CHK_LO_Status] CHECK  (([Status]='Cancelled' OR [Status]='Completed' OR [Status]='InProgress' OR [Status]='New'))
GO
ALTER TABLE [dbo].[LAB_ORDER] CHECK CONSTRAINT [CHK_LO_Status]
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST]  WITH CHECK ADD  CONSTRAINT [CHK_LOT_Status] CHECK  (([Status]='Cancelled' OR [Status]='Completed' OR [Status]='Collected' OR [Status]='Pending'))
GO
ALTER TABLE [dbo].[LAB_ORDER_TEST] CHECK CONSTRAINT [CHK_LOT_Status]
GO
ALTER TABLE [dbo].[LAB_RESULT]  WITH CHECK ADD  CONSTRAINT [CHK_LR_Status] CHECK  (([Status]='Amended' OR [Status]='Validated' OR [Status]='Entered'))
GO
ALTER TABLE [dbo].[LAB_RESULT] CHECK CONSTRAINT [CHK_LR_Status]
GO
ALTER TABLE [dbo].[LAB_TEST_MASTER]  WITH CHECK ADD  CONSTRAINT [CHK_LTM_Status] CHECK  (([Status]='Inactive' OR [Status]='Active'))
GO
ALTER TABLE [dbo].[LAB_TEST_MASTER] CHECK CONSTRAINT [CHK_LTM_Status]
GO
ALTER TABLE [dbo].[NORMAL_RANGE]  WITH CHECK ADD  CONSTRAINT [CHK_NR_Gender] CHECK  (([Gender]='Any' OR [Gender]='Child' OR [Gender]='Female' OR [Gender]='Male'))
GO
ALTER TABLE [dbo].[NORMAL_RANGE] CHECK CONSTRAINT [CHK_NR_Gender]
GO
ALTER TABLE [dbo].[SAMPLE]  WITH CHECK ADD  CONSTRAINT [CHK_SAMPLE_Status] CHECK  (([Status]='Recollected' OR [Status]='Rejected' OR [Status]='Collected'))
GO
ALTER TABLE [dbo].[SAMPLE] CHECK CONSTRAINT [CHK_SAMPLE_Status]
GO
/****** Object:  StoredProcedure [dbo].[sp_CollectSample]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_CollectSample]
(
    @Order_Test_ID INT,
    @Specimen_Type_ID INT,
    @Barcode VARCHAR(100),
    @Collected_By VARCHAR(100)
)
AS
BEGIN
    INSERT INTO SAMPLE
    (Order_Test_ID, Specimen_Type_ID, Barcode, Collection_Date, Collected_By, Status)
    VALUES
    (@Order_Test_ID, @Specimen_Type_ID, @Barcode, GETDATE(), @Collected_By, 'Collected');

    UPDATE LAB_ORDER_TEST
    SET Status = 'Collected',
        Sample_Collected_Date = GETDATE()
    WHERE Order_Test_ID = @Order_Test_ID;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_CreateLabOrder]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[sp_CreateLabOrder]
(
    @Patient_ID INT,
    @Doctor_ID INT,
    @Priority VARCHAR(20),
    @Notes VARCHAR(500),
    @Created_By VARCHAR(100),
    @TestList VARCHAR(MAX)   -- CSV: '1,2,3'
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Order_ID INT;

    -- Insert into LAB_ORDER
    INSERT INTO LAB_ORDER
    (Patient_ID, Doctor_ID, Order_Date, Priority, Notes, Status, Created_By)
    VALUES
    (@Patient_ID, @Doctor_ID, GETDATE(), @Priority, @Notes, 'New', @Created_By);

    SET @Order_ID = SCOPE_IDENTITY();

    -- Insert tests
    INSERT INTO LAB_ORDER_TEST (Order_ID, Test_ID, Status)
    SELECT @Order_ID, value, 'Pending'
    FROM STRING_SPLIT(@TestList, ',');

    SELECT @Order_ID AS NewOrderID;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_EnterLabResult]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_EnterLabResult]
(
    @Order_Test_ID INT,
    @Result_Value VARCHAR(100),
    @Units VARCHAR(50),
    @Normal_Range VARCHAR(200),
    @Interpretation VARCHAR(50),
    @Comments VARCHAR(500),
    @Status VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert result
    INSERT INTO LAB_RESULT
    (Order_Test_ID, Result_Value, Units, Normal_Range, Interpretation, Comments, Status)
    VALUES
    (@Order_Test_ID, @Result_Value, @Units, @Normal_Range, @Interpretation, @Comments, @Status);

    -- Mark test completed
    UPDATE LAB_ORDER_TEST
    SET Status = 'Completed',
        Completed_Date = GETDATE()
    WHERE Order_Test_ID = @Order_Test_ID;
END;

GO
/****** Object:  StoredProcedure [dbo].[sp_MarkNotificationRead]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_MarkNotificationRead]
(
    @Notification_ID INT,
    @UserType VARCHAR(10)  -- 'Doctor' or 'Patient'
)
AS
BEGIN
    IF @UserType = 'Doctor'
        UPDATE DOCTOR_NOTIFICATION
        SET Doctor_Status = 'Read'
        WHERE Notification_ID = @Notification_ID;

    IF @UserType = 'Patient'
        UPDATE DOCTOR_NOTIFICATION
        SET Patient_Status = 'Read'
        WHERE Notification_ID = @Notification_ID;
END;
GO
/****** Object:  StoredProcedure [dbo].[sp_SendLabNotifications]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[sp_SendLabNotifications]
(
    @Order_Test_ID INT,
    @Doctor_ID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO DOCTOR_NOTIFICATION
    (Order_Test_ID, Doctor_ID, Doctor_Notification_Date, Doctor_Status,
     Patient_Notification_ID, Patient_Notification_Date, Patient_Status)
    VALUES
    (@Order_Test_ID, @Doctor_ID, GETDATE(), 'Sent',
     @Order_Test_ID, GETDATE(), 'Sent');
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_CancelAppointment]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_CancelAppointment
-- =============================================
CREATE PROCEDURE [dbo].[USP_CancelAppointment]
(
    @AppointmentId  INT,
    @PatientId      INT,
    @CancelledBy    VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Validate appointment exists and belongs to this patient
        IF NOT EXISTS
        (
            SELECT 1 FROM Appointments
            WHERE AppointmentId = @AppointmentId
              AND PatientId     = @PatientId
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'No Appointment Exists' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 2. Block if already cancelled
        IF EXISTS
        (
            SELECT 1 FROM Appointments
            WHERE AppointmentId = @AppointmentId
              AND Status        = 'Cancelled'
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Appointment Already cancelled' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 3. Block if already completed
        IF EXISTS
        (
            SELECT 1 FROM Appointments
            WHERE AppointmentId = @AppointmentId
              AND Status        = 'Completed'
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Appointment Already Completed' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 4. Grab SlotId before updating
        DECLARE @SlotId INT;

        SELECT @SlotId = SlotId
        FROM Appointments
        WHERE AppointmentId = @AppointmentId;

        -- 5. Cancel the appointment
        UPDATE Appointments
        SET
            Status      = 'Cancelled',
            UpdatedDate = GETDATE()
        WHERE AppointmentId = @AppointmentId;

        -- 6. Free the slot
        UPDATE AppointmentSlots
        SET IsBooked = 0
        WHERE SlotId = @SlotId;

        COMMIT;

        SELECT
            1 AS Status,
            1 AS IsSuccess,
            'Appointment cancelled successfully' AS ResponseMessage,
            @AppointmentId AS ResponseId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SELECT 0 AS Status, 0 AS IsSuccess, ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END;

GO
/****** Object:  StoredProcedure [dbo].[USP_ClearPatientOtp]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_ClearPatientOtp
-- =============================================
CREATE PROCEDURE [dbo].[USP_ClearPatientOtp]
(
    @Email NVARCHAR(200)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PatientId INT;

    SELECT @PatientId = PatientId 
    FROM Patient 
    WHERE Email = @Email;

    IF @PatientId IS NULL
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'Patient not found' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM OtpMaster WHERE PatientId = @PatientId)
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'OTP record not found' AS ResponseMessage;
        RETURN;
    END

    DELETE FROM OtpMaster WHERE PatientId = @PatientId;

    SELECT CAST(1 AS BIT) AS IsSuccess, 
           'OTP cleared successfully' AS ResponseMessage;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_CreateAppointment]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_CreateAppointment
-- =============================================
CREATE PROCEDURE [dbo].[USP_CreateAppointment]
(
    -- Core
    @PatientId          INT,
    @DoctorId           INT,
    @SlotId             INT,
    @AppointmentDate    DATE,
    @TimeSlot           NVARCHAR(20),
    @VisitPurpose       NVARCHAR(300)   = NULL,
    @VisitType          NVARCHAR(50)    = NULL,
    @OtpMethod          NVARCHAR(50)    = NULL,

    -- Insurance (all optional)
    @Insurance          BIT             = 0,
    @Provider           VARCHAR(200)    = NULL,
    @Policy             VARCHAR(100)    = NULL,
    @GroupId            VARCHAR(100)    = NULL,
    @HolderName         VARCHAR(200)    = NULL,
    @InsuranceAddress   VARCHAR(300)    = NULL,

    -- Payment (all optional)
    @PaymentType        VARCHAR(50)     = NULL,
    @TransactionId      VARCHAR(100)    = NULL,
    @Amount             DECIMAL(18,2)   = NULL,
    @PaymentStatus      VARCHAR(20)     = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Validate patient
        IF NOT EXISTS
        (
            SELECT * FROM Patient
            WHERE PatientId = @PatientId
              AND IsActive  = 1
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Problem Fetching Patient Status' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 2. Validate doctor
        IF NOT EXISTS
        (
            SELECT 1 FROM DoctorMaster
            WHERE DoctorId = @DoctorId
              AND IsActive  = 1
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Problem Fetching Doctor Status' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 3. Validate slot belongs to doctor, is on correct date, and is free
        IF NOT EXISTS
        (
            SELECT 1 FROM AppointmentSlots
            WHERE SlotId   = @SlotId
              AND DoctorId = @DoctorId
              AND SlotDate = @AppointmentDate
              AND TimeSlot = @TimeSlot
              AND IsBooked = 0
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Problem Fetching Doctor Slots' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 4. Prevent double booking — same patient, same date, same time
        IF EXISTS
        (
            SELECT 1 FROM Appointments
            WHERE PatientId       = @PatientId
              AND AppointmentDate = @AppointmentDate
              AND TimeSlot        = @TimeSlot
              AND Status         != 'Cancelled'
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Patient Already Booked an Appointment' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 5. Insert appointment
        INSERT INTO Appointments
        (
            PatientId, DoctorId, SlotId, AppointmentDate,
            TimeSlot, VisitPurpose, VisitType, OtpMethod,
            Status, CreatedDate
        )
        VALUES
        (
            @PatientId, @DoctorId, @SlotId, @AppointmentDate,
            @TimeSlot, @VisitPurpose, @VisitType, @OtpMethod,
            'Scheduled', GETDATE()
        );

        DECLARE @AppointmentId INT = SCOPE_IDENTITY();

        -- 6. Mark slot as booked
        UPDATE AppointmentSlots
        SET IsBooked = 1
        WHERE SlotId = @SlotId;

        -- 7. Insert insurance if flagged
        IF @Insurance = 1
        BEGIN
            INSERT INTO AppointmentInsuranceMaster
            (
                AppointmentId, Provider, PolicyNumber,
                GroupId, HolderName, Address, CreatedDate
            )
            VALUES
            (
                @AppointmentId, @Provider, @Policy,
                @GroupId, @HolderName, @InsuranceAddress, GETDATE()
            );
        END

        -- 8. Insert payment if PaymentType provided
        IF @PaymentType IS NOT NULL
        BEGIN
            INSERT INTO AppointmentPaymentMaster
            (
                AppointmentId, PaymentType, TransactionId,
                Amount, PaymentStatus, CreatedDate
            )
            VALUES
            (
                @AppointmentId, @PaymentType, @TransactionId,
                @Amount, @PaymentStatus, GETDATE()
            );
        END

        COMMIT;

        SELECT
            1               AS Status,
            1               AS IsSuccess,
            'Appointment Created Successfully' AS ResponseMessage,
            @AppointmentId  AS ResponseId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SELECT 0 AS Status, 0 AS IsSuccess,
               ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END;

GO
/****** Object:  StoredProcedure [dbo].[USP_CreatePatientDetails]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[USP_CreatePatientDetails]
(
   @PatientId              INT             = NULL,
    @FirstName              VARCHAR(100),
    @MiddleName             VARCHAR(100)    = NULL,
    @LastName               VARCHAR(100),
    @DateOfBirth            DATETIME        ,
    @PhoneCountryCode       VARCHAR(10)     ,
    @PhoneNumber            VARCHAR(20),
    @Email                  VARCHAR(200),
    @Gender                 VARCHAR(20)     = NULL,
    @AddressLine1           VARCHAR(200),
    @AddressLine2           VARCHAR(200)    = NULL,
    @CityId                 INT,
    @ZipCode                VARCHAR(20),
    @StateId                INT             = NULL,
    @CountryId              INT,
    @Username               VARCHAR(150),
    @PasswordHash           VARBINARY(500),
    @PasswordSalt           VARBINARY(500),
    @SecurityQuestionId     INT,
    @SecurityAnswerHash     VARBINARY(500),
    @SecurityAnswerSalt     VARBINARY(500),
    @IsActive               BIT             = 1,
    @CreatedBy              VARCHAR(100)    = NULL,
    @CreatedDate            DATETIME        = NULL,
    @UpdatedBy              VARCHAR(100)    = NULL,
    @UpdatedDate            DATETIME        = NULL

)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Duplicate checks
        IF EXISTS (SELECT 1 FROM Patient WHERE PhoneNumber = @PhoneNumber)
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess, 'Phone Number Already Registered' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        IF EXISTS (SELECT 1 FROM Patient WHERE Email = @Email)
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess, 'Email Already Registered' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        IF EXISTS (SELECT 1 FROM PatientLoginMaster WHERE Username = @Username)
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess, 'Username Already Taken' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- Insert patient profile
        INSERT INTO dbo.Patient
        (
            FirstName, MiddleName, LastName, DateOfBirth, PhoneCountryCode, PhoneNumber, Email, Gender,
            AddressLine1, AddressLine2, CityId, ZipCode, StateId, CountryId,
            IsActive, CreatedBy, CreatedDate
        )
        VALUES
        (
            @FirstName, @MiddleName, @LastName, @DateOfBirth, @PhoneCountryCode, @PhoneNumber, @Email, @Gender,
            @AddressLine1, @AddressLine2, @CityId, @ZipCode, @StateId, @CountryId,
            @IsActive, @CreatedBy, GETDATE()
        );

        DECLARE @NewPatientId INT = SCOPE_IDENTITY();

        -- Insert credentials into LoginMaster
        INSERT INTO PatientLoginMaster
        (
            PatientId, Username, PasswordHash, PasswordSalt,
            SecurityQuestionId, SecurityAnswerHash, SecurityAnswerSalt,
            CreatedDate
        )
        VALUES
        (
            @NewPatientId, @Username, @PasswordHash, @PasswordSalt,
            @SecurityQuestionId, @SecurityAnswerHash, @SecurityAnswerSalt,
            GETDATE()
        );

        COMMIT;

        SELECT 1 AS Status, 1 AS IsSuccess,
               'Patient registered successfully' AS ResponseMessage,
               @NewPatientId AS ResponseId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SELECT 0 AS Status, 0 AS IsSuccess, ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetAvailableAppointments]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetAvailableAppointments]
(
    @DoctorId       INT,
    @RequestedDate  DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM DoctorMaster WHERE DoctorId = @DoctorId)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Doctor Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM DoctorMaster WHERE DoctorId = @DoctorId AND IsActive = 0)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Doctor Is Inactive' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM AppointmentSlots WHERE DoctorId = @DoctorId AND SlotDate = @RequestedDate AND IsBooked = 0)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'No Available Appointments Found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        s.SlotId,
        s.DoctorId,
        d.FirstName + ' ' + d.LastName AS DoctorName,
        s.SlotDate AS AppointmentDate,
        s.TimeSlot,
        s.IsBooked
    FROM AppointmentSlots s
    INNER JOIN DoctorMaster d ON s.DoctorId = d.DoctorId
    WHERE
        s.DoctorId = @DoctorId
        AND s.SlotDate = @RequestedDate
        AND s.IsBooked = 0
        AND d.IsActive = 1
    ORDER BY s.TimeSlot;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetCitiesByState]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetCitiesByState]
(
    @StateId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM StatesMaster WHERE StateId = @StateId)
    BEGIN
        SELECT 0 AS Status,
               0 AS IsSuccess,
               'State Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM CitiesMaster WHERE StateId = @StateId)
    BEGIN
        SELECT 0 AS Status,
               0 AS IsSuccess,
               'No Cities Found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        CityId,
        CityName,
        StateId
    FROM CitiesMaster
    WHERE StateId = @StateId
    ORDER BY CityName;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetCountries]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetCountries]
AS
BEGIN
    SELECT 
        CAST(1 AS BIT) AS Status,
        1 AS IsSuccess,
        'Data Fetched Successfully' AS ResponseMessage,
        CountryId, CountryName, CountryCode, PhoneCode 
        FROM CountriesMaster; 
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetDoctorAvailabilities]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetDoctorAvailabilities]
(
    @DoctorId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM DoctorMaster WHERE DoctorId = @DoctorId)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Doctor Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM DoctorMaster WHERE DoctorId = @DoctorId AND IsActive = 0)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Doctor Is Inactive' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM DoctorAvailability WHERE DoctorId = @DoctorId AND IsAvailable = 1)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'No Availability Found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        da.AvailabilityId,
        da.DoctorId,
        d.FirstName + ' ' + d.LastName AS DoctorName,
        da.DayOfWeek,
        da.StartTime,
        da.EndTime,
        da.IsAvailable
    FROM DoctorAvailability da
    INNER JOIN DoctorMaster d ON da.DoctorId = d.DoctorId
    WHERE da.DoctorId = @DoctorId AND da.IsAvailable = 1 AND d.IsActive = 1
    ORDER BY
        CASE da.DayOfWeek
            WHEN 'Monday'    THEN 1
            WHEN 'Tuesday'   THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday'  THEN 4
            WHEN 'Friday'    THEN 5
            WHEN 'Saturday'  THEN 6
            WHEN 'Sunday'    THEN 7
        END;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetErrorLogs]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 8b. USP_GetErrorLogs
CREATE PROCEDURE [dbo].[USP_GetErrorLogs]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        ErrorId, IsDBError, ObjectId, Error_Line, Error_Message,
        Error_Procedure, Error_Trace, Error_Severity, Error_State, CreatedDate
    FROM ErrorLogs
    ORDER BY CreatedDate DESC;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetMyAppointments]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetMyAppointments]
(
    @PatientId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientId = @PatientId)
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Patient Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully.' AS ResponseMessage,
        a.AppointmentId,
        a.PatientId,
        'Patient_' + CAST(a.PatientId AS NVARCHAR) AS PatientName,
        a.DoctorId,
        d.FirstName + ' ' + d.LastName AS DoctorName,
        s.SpecialityName AS Speciality,
        a.AppointmentDate,
        a.TimeSlot,
        a.Status,
        a.Notes
    FROM Appointments a
    INNER JOIN DoctorMaster d ON a.DoctorId = d.DoctorId
    INNER JOIN SpecialityMaster s ON d.SpecialityId = s.SpecialityId
    WHERE a.PatientId = @PatientId
    ORDER BY a.AppointmentDate DESC;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPatientByContactNo]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- USP_GetPatientByContactNo
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetPatientByContactNo] 
(
    @PhoneNumber VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

   SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        P.PatientId,
        P.FirstName,
        P.MiddleName,
        P.LastName,
        P.DateOfBirth,
        P.PhoneCountryCode,
        P.PhoneNumber,
        P.Email,
        P.Gender,
        P.AddressLine1,
        P.AddressLine2,
        P.CityId,
        P.ZipCode,
        P.StateId,
        P.CountryId,
        PL.Username,    
        P.IsActive,
        P.CreatedBy,
        P.CreatedDate,
        P.UpdatedBy,
        P.UpdatedDate
    FROM Patient P
    LEFT JOIN PatientLoginMaster PL
        ON P.PatientId = PL.PatientId
    WHERE P.PhoneNumber = @PhoneNumber;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPatientById]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_GetPatientById
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetPatientById]
(
    @Id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        P.PatientId,
        P.FirstName,
        P.MiddleName,
        P.LastName,
        P.DateOfBirth,
        P.PhoneCountryCode,
        P.PhoneNumber,
        P.Email,
        P.Gender,
        P.AddressLine1,
        P.AddressLine2,
        P.CityId,
        P.ZipCode,
        P.StateId,
        P.CountryId,
        PL.Username,
        P.IsActive,
        P.CreatedBy,
        P.CreatedDate,
        P.UpdatedBy,
        P.UpdatedDate
    FROM Patient P
    LEFT JOIN PatientLoginMaster PL
        ON P.PatientId = PL.PatientId
    WHERE P.PatientId = @Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPatientByUsername]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetPatientByUsername]
(
    @Username VARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM PatientLoginMaster
        WHERE Username = @Username
    )
    BEGIN
        SELECT
            0 AS Status,
            0 AS IsSuccess,
            'Username Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        P.PatientId,
        P.FirstName,
        P.MiddleName,
        P.LastName,
        P.DateOfBirth,
        p.PhoneCountryCode,
        P.PhoneNumber,
        P.Email,
        P.Gender,
        P.AddressLine1,
        P.AddressLine2,
        P.CityId,
        P.ZipCode,
        P.StateId,
        P.CountryId,
        PL.Username,
        P.IsActive,
        P.CreatedBy,
        P.CreatedDate,
        P.UpdatedBy,
        P.UpdatedDate
    FROM Patient P
    INNER JOIN PatientLoginMaster PL
        ON P.PatientId = PL.PatientId
    WHERE PL.Username = @Username;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPatientOtpDetail]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_GetPatientOtpDetail
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetPatientOtpDetail]
(
    @Email NVARCHAR(200)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PatientId INT;

    SELECT @PatientId = PatientId 
    FROM Patient 
    WHERE Email = @Email;

    IF @PatientId IS NULL
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'Patient not found' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM OtpMaster WHERE PatientId = @PatientId)
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'OTP record not found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        CAST(1 AS BIT) AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        P.PatientId,
        P.Email,
        O.OtpHash,
        O.OtpSalt,
        O.OtpExpiry   AS Expiry,
        O.OtpAttempts AS Attempts,
        O.IsUsed
    FROM Patient P
    INNER JOIN OtpMaster O ON P.PatientId = O.PatientId
    WHERE P.PatientId = @PatientId;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetPatientPassword]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetPatientPassword]
(
    @Username VARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM PatientLoginMaster
        WHERE Username = @Username
    )
    BEGIN
        SELECT
            CAST(0 AS BIT) AS Status,
            0 AS IsSuccess,
            'User not found' AS ResponseMessage;

        RETURN;
    END

    SELECT
        CAST(1 AS BIT) AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        L.PatientId,
        L.PasswordHash,
        L.PasswordSalt
    FROM PatientLoginMaster L
    WHERE L.Username = @Username;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetSecurityQuestionMaster]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 4. USP_GetSecurityQuestionMaster
CREATE PROCEDURE [dbo].[USP_GetSecurityQuestionMaster]
AS
BEGIN
    SELECT
        CAST(1 AS BIT) AS Status,
        1              AS IsSuccess,
        'Data Fetched Successfully' AS ResponseMessage,
        QuestionId,
        QuestionText
    FROM SecurityQuestionMaster;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetSpecialities]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetSpecialities]
(
    @DoctorName     NVARCHAR(200) = NULL,
    @DepartmentName NVARCHAR(200) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @DoctorName IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM DoctorMaster WHERE FirstName + ' ' + LastName LIKE '%' + @DoctorName + '%')
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Doctor Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    IF @DepartmentName IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM Department WHERE DepartmentName LIKE '%' + @DepartmentName + '%')
    BEGIN
        SELECT 0 AS Status, 0 AS IsSuccess, 'Department Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    SELECT DISTINCT
        s.SpecialityId,
        s.SpecialityName,
        dep.DepartmentName,
        d.FirstName + ' ' + d.LastName AS DoctorName
    FROM SpecialityMaster s
    LEFT JOIN Department dep ON s.SpecialityId = dep.SpecialityId
    LEFT JOIN DoctorMaster d
        ON d.SpecialityId = s.SpecialityId
        AND d.DepartmentId = dep.DepartmentId
    WHERE
        s.IsActive = 1
        AND (@DoctorName IS NULL OR d.FirstName + ' ' + d.LastName LIKE '%' + @DoctorName + '%')
        AND (@DepartmentName IS NULL OR dep.DepartmentName LIKE '%' + @DepartmentName + '%')
    ORDER BY s.SpecialityName, dep.DepartmentName, DoctorName;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetStatesByCountry]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_GetStatesByCountry]
(
    @CountryId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM CountriesMaster WHERE CountryId = @CountryId)
    BEGIN
        SELECT 0 AS Status,
               0 AS IsSuccess,
               'Country Does Not Exist' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM StatesMaster WHERE CountryId = @CountryId)
    BEGIN
        SELECT 0 AS Status,
               0 AS IsSuccess,
               'No States Found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        1 AS Status,
        1 AS IsSuccess,
        'Data fetched successfully' AS ResponseMessage,
        StateId,
        StateName,
        CountryId
    FROM StatesMaster
    WHERE CountryId = @CountryId
    ORDER BY StateName;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserByEmail]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[USP_GetUserByEmail]    
(    
    @Email VARCHAR(200) = NULL    
)    
AS    
BEGIN    
    SET NOCOUNT ON;    
    
    IF EXISTS  
    (  
        SELECT 1  
        FROM Patient  
        WHERE Email = @Email  
    )  
    BEGIN  
        SELECT  
            1 AS [Status],  
            1 AS [IsSuccess],  
            'Email Exists' AS ResponseMessage;  
        RETURN;  
    END  
   ELSE  
    BEGIN  
        SELECT  
            0 AS [Status],  
            1 AS [IsSuccess],  
            'Email Does not Exists' AS ResponseMessage;  
        RETURN;  
    END  
          
END 
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserById]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 5b. USP_GetUserById
CREATE PROCEDURE [dbo].[USP_GetUserById]
(
    @UserId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Login WHERE UserId = @UserId)
    BEGIN
        SELECT CAST(0 AS BIT) AS Status, 1 AS IsSuccess, 'User Not Found' AS ResponseMessage;
        RETURN;
    END

    SELECT
        CAST(1 AS BIT)              AS Status,
        1                           AS IsSuccess,
        'Data Fetched Successfully' AS ResponseMessage,
        L.Username,
        U.UserId,
        U.FirstName,
        U.LastName,
        U.Email,
        U.PhoneNumber,
        U.RoleId,
        R.RoleName,
        U.DepartmentId,
        D.DepartmentName,
        U.CreatedDate,
        U.IsActive,
        L.LastLoginDate
    FROM   Login      L
    INNER JOIN Users      U ON L.UserId = U.UserId
    INNER JOIN Role       R ON U.RoleId = R.RoleId
    INNER JOIN Department D ON U.DepartmentId = D.DepartmentId
    WHERE  L.UserId = @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserInfo]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 5a. USP_GetUserInfo
CREATE PROCEDURE [dbo].[USP_GetUserInfo]
(
    @Username VARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UserId INT;

    SELECT @UserId = UserId FROM Login WHERE Username = @Username;

    IF @UserId IS NULL
    BEGIN
        SELECT CAST(0 AS BIT) AS Status, 1 AS IsSuccess, 'User Not Found' AS ResponseMessage;
        RETURN;
    END

    UPDATE Login SET LastLoginDate = GETDATE() WHERE UserId = @UserId;

    SELECT
        CAST(1 AS BIT)          AS Status,
        1                       AS IsSuccess,
        'Login successful'      AS ResponseMessage,
        L.Username,
        U.UserId,
        U.FirstName,
        U.LastName,
        U.Email,
        U.PhoneNumber,
        U.RoleId,
        R.RoleName,
        U.DepartmentId,
        D.DepartmentName,
        U.CreatedDate,
        U.IsActive,
        L.LastLoginDate
    FROM   Login      L
    INNER JOIN Users      U ON L.UserId = U.UserId
    INNER JOIN Role       R ON U.RoleId = R.RoleId
    INNER JOIN Department D ON U.DepartmentId = D.DepartmentId
    WHERE  L.UserId = @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[USP_GetUserPassword]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 3. USP_GetUserPassword
CREATE PROCEDURE [dbo].[USP_GetUserPassword]
(
    @Username VARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT l.UserId, l.PasswordHash, l.PasswordSalt
    FROM   Login l
    INNER JOIN Users u ON l.UserId = u.UserId
    WHERE  l.Username = @Username;

    IF @@ROWCOUNT = 0
    BEGIN
        SELECT CAST(0 AS BIT) AS Status, 1 AS IsSuccess, 'User not found' AS ResponseMessage;
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[USP_InsertErrorLogs]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 8a. USP_InsertErrorLogs
CREATE PROCEDURE [dbo].[USP_InsertErrorLogs]
(
    @IsDBError      BIT          = 0,
    @Error_Message  VARCHAR(MAX) = '',
    @Error_Procedure VARCHAR(200) = '',
    @Error_Trace    VARCHAR(MAX) = '',
    @Error_Line     INT          = 0,
    @Error_Severity INT          = 0,
    @Error_State    INT          = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ErrorLogs
        (IsDBError, ObjectId, Error_Line, Error_Message, Error_Procedure, Error_Trace, Error_Severity, Error_State)
    VALUES
        (@IsDBError, OBJECT_ID(@Error_Procedure), @Error_Line, @Error_Message, @Error_Procedure, @Error_Trace, @Error_Severity, @Error_State);
END
GO
/****** Object:  StoredProcedure [dbo].[USP_SavePatientOtp]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- USP_SavePatientOtp
-- =============================================
CREATE PROCEDURE [dbo].[USP_SavePatientOtp]
(
    @Email    NVARCHAR(200),
    @OtpHash  VARBINARY(500),
    @OtpSalt  VARBINARY(500),
    @Expiry   DATETIME
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PatientId INT;

    SELECT @PatientId = PatientId 
    FROM Patient 
    WHERE Email = @Email;

    IF @PatientId IS NULL
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'Patient not found' AS ResponseMessage;
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM OtpMaster WHERE PatientId = @PatientId)
    BEGIN
        UPDATE OtpMaster
        SET
            OtpHash     = @OtpHash,
            OtpSalt     = @OtpSalt,
            OtpExpiry   = @Expiry,
            OtpAttempts = 0,
            IsUsed      = 0,
            UpdatedDate = GETDATE()
        WHERE PatientId = @PatientId;
    END
    ELSE
    BEGIN
        INSERT INTO OtpMaster
            (PatientId, OtpHash, OtpSalt, OtpExpiry, OtpAttempts, IsUsed, CreatedDate)
        VALUES
            (@PatientId, @OtpHash, @OtpSalt, @Expiry, 0, 0, GETDATE());
    END

    SELECT CAST(1 AS BIT) AS IsSuccess, 
           'OTP saved successfully' AS ResponseMessage;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdateAppointmentDetails]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- USP_UpdateAppointmentDetails
-- =============================================
CREATE PROCEDURE [dbo].[USP_UpdateAppointmentDetails]
(
    @AppointmentId      INT,
    @PatientId          INT,

    -- Updatable fields
    @DoctorId           INT             = NULL,
    @SlotId             INT             = NULL,
    @AppointmentDate    DATE            = NULL,
    @TimeSlot           NVARCHAR(20)    = NULL,
    @VisitPurpose       NVARCHAR(300)   = NULL,
    @UpdatedBy          VARCHAR(100)    = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- 1. Validate appointment exists and belongs to this patient
        IF NOT EXISTS
        (
            SELECT 1 FROM Appointments
            WHERE AppointmentId = @AppointmentId
              AND PatientId     = @PatientId
        )
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Patient Appontment Not Found' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 2. Block update on cancelled or completed appointments
        DECLARE @CurrentStatus NVARCHAR(20);

        SELECT @CurrentStatus = Status
        FROM Appointments
        WHERE AppointmentId = @AppointmentId;

        IF @CurrentStatus IN ('Cancelled', 'Completed')
        BEGIN
            SELECT 0 AS Status, 0 AS IsSuccess,
                   'Cannot Update an Already ' + @CurrentStatus + ' Appointment' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- 3. Capture current slot before any changes
        DECLARE @OldSlotId          INT;
        DECLARE @OldDoctorId        INT;
        DECLARE @OldAppointmentDate DATE;
        DECLARE @OldTimeSlot        NVARCHAR(20);

        SELECT
            @OldSlotId          = SlotId,
            @OldDoctorId        = DoctorId,
            @OldAppointmentDate = AppointmentDate,
            @OldTimeSlot        = TimeSlot
        FROM Appointments
        WHERE AppointmentId = @AppointmentId;

        -- 4. Resolve final values (fall back to existing if not passed)
        DECLARE @NewDoctorId        INT     = ISNULL(@DoctorId,        @OldDoctorId);
        DECLARE @NewSlotId          INT     = ISNULL(@SlotId,          @OldSlotId);
        DECLARE @NewAppointmentDate DATE    = ISNULL(@AppointmentDate, @OldAppointmentDate);
        DECLARE @NewTimeSlot        NVARCHAR(20) = ISNULL(@TimeSlot,   @OldTimeSlot);

        -- 5. Slot change detected — validate and swap
        DECLARE @SlotChanged BIT = 0;

        IF @NewSlotId != @OldSlotId
           OR @NewDoctorId != @OldDoctorId
           OR @NewAppointmentDate != @OldAppointmentDate
           OR @NewTimeSlot != @OldTimeSlot
        BEGIN
            SET @SlotChanged = 1;

            -- Validate new doctor exists and is active
            IF NOT EXISTS
            (
                SELECT 1 FROM DoctorMaster
                WHERE DoctorId = @NewDoctorId
                  AND IsActive = 1
            )
            BEGIN
                SELECT 0 AS Status, 0 AS IsSuccess,
                       'Doctor Does Not Exist' AS ResponseMessage;
                ROLLBACK; RETURN;
            END

            -- Validate new slot is free and matches doctor
            IF NOT EXISTS
            (
                SELECT 1 FROM AppointmentSlots
                WHERE SlotId   = @NewSlotId
                  AND DoctorId = @NewDoctorId
                  AND SlotDate = @NewAppointmentDate
                  AND TimeSlot = @NewTimeSlot
                  AND IsBooked = 0
            )
            BEGIN
                SELECT 0 AS Status, 0 AS IsSuccess,
                       'Slots Not Available' AS ResponseMessage;
                ROLLBACK; RETURN;
            END

            -- Check patient doesn't already have an appointment at the new time
            IF EXISTS
            (
                SELECT 1 FROM Appointments
                WHERE PatientId       = @PatientId
                  AND AppointmentDate = @NewAppointmentDate
                  AND TimeSlot        = @NewTimeSlot
                  AND AppointmentId  != @AppointmentId
                  AND Status         != 'Cancelled'
            )
            BEGIN
                SELECT 0 AS Status, 0 AS IsSuccess,
                       'Patient Already has an Appointment' AS ResponseMessage;
                ROLLBACK; RETURN;
            END

            -- Free the old slot
            UPDATE AppointmentSlots
            SET IsBooked = 0
            WHERE SlotId = @OldSlotId;

            -- Book the new slot
            UPDATE AppointmentSlots
            SET IsBooked = 1
            WHERE SlotId = @NewSlotId;
        END

        -- 6. Update appointment
        UPDATE Appointments
        SET
            DoctorId        = @NewDoctorId,
            SlotId          = @NewSlotId,
            AppointmentDate = @NewAppointmentDate,
            TimeSlot        = @NewTimeSlot,
            VisitPurpose    = ISNULL(@VisitPurpose, VisitPurpose),
            UpdatedDate     = GETDATE()
        WHERE AppointmentId = @AppointmentId;

        COMMIT;

        SELECT
            1               AS Status,
            1               AS IsSuccess,
            'Appointment Updated Successfully' AS ResponseMessage,
            @AppointmentId  AS ResponseId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SELECT 0 AS Status, 0 AS IsSuccess,
               ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END;

GO
/****** Object:  StoredProcedure [dbo].[USP_UpdatePatientDetails]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[USP_UpdatePatientDetails]
(
    -- Identity
    @PatientId              INT,
    -- Profile fields
    @FirstName              VARCHAR(100)    = NULL,
    @MiddleName             VARCHAR(100)    = NULL,
    @LastName               VARCHAR(100)    = NULL,
    @DateOfBirth            DATE            = NULL,
    @PhoneCountryCode       VARCHAR(10)     = NULL,
    @PhoneNumber            VARCHAR(20)     = NULL,
    @Email                  VARCHAR(200)    = NULL,
    @Gender                 VARCHAR(20)     = NULL,
    @AddressLine1           VARCHAR(200)    = NULL,
    @AddressLine2           VARCHAR(200)    = NULL,
    @CityId                 INT             = NULL,
    @ZipCode                VARCHAR(20)     = NULL,
    @StateId                INT             = NULL,
    @CountryId              INT             = NULL,
    @IsActive               BIT             = NULL,
    @CreatedBy              VARCHAR(100)    = NULL,
    @CreatedDate            DATETIME        = NULL,
    @UpdatedBy              VARCHAR(100)    = NULL,
    @UpdatedDate            DATETIME        = NULL,
    -- Credential fields (all optional — only updated when provided)
    @Username                 VARCHAR(150)  = NULL,
    @PasswordHash           VARBINARY(500)  = NULL,
    @PasswordSalt           VARBINARY(500)  = NULL,
    @SecurityQuestionId     INT             = NULL,
    @SecurityAnswerHash     VARBINARY(500)  = NULL,
    @SecurityAnswerSalt     VARBINARY(500)  = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Patient WHERE PatientId = @PatientId)
        BEGIN
            SELECT 0 AS [Status], 0 AS IsSuccess, 'Patient Does Not Exist' AS ResponseMessage;
            ROLLBACK; RETURN;
        END

        -- Update profile
        UPDATE dbo.Patient
        SET
            FirstName       = ISNULL(@FirstName,    FirstName),
            MiddleName      = ISNULL(@MiddleName,   MiddleName),
            LastName        = ISNULL(@LastName,     LastName),
            DateOfBirth     = ISNULL(@DateOfBirth,  DateOfBirth),
            PhoneCountryCode= ISNULL(@PhoneCountryCode, PhoneCountryCode),
            PhoneNumber     = ISNULL(@PhoneNumber,  PhoneNumber),
            Email           = ISNULL(@Email,        Email),
            Gender          = ISNULL(@Gender,       Gender),
            AddressLine1    = ISNULL(@AddressLine1, AddressLine1),
            AddressLine2    = ISNULL(@AddressLine2, AddressLine2),
            CityId          = ISNULL(@CityId,       CityId),
            ZipCode         = ISNULL(@ZipCode,      ZipCode),
            StateId         = ISNULL(@StateId,      StateId),
            CountryId       = ISNULL(@CountryId,    CountryId),
            IsActive        = ISNULL(@IsActive,     IsActive),
            UpdatedBy       = @UpdatedBy,
            UpdatedDate     = GETDATE()
        WHERE PatientId = @PatientId;

        -- Update credentials only if at least one credential param was passed
        IF @PasswordHash IS NOT NULL
           OR @SecurityQuestionId IS NOT NULL
           OR @SecurityAnswerHash IS NOT NULL
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM PatientLoginMaster WHERE PatientId = @PatientId)
            BEGIN
                SELECT 0 AS [Status], 0 AS IsSuccess, 'Patient login record not found' AS ResponseMessage;
                ROLLBACK; RETURN;
            END

            UPDATE PatientLoginMaster
            SET
                PasswordHash        = ISNULL(@PasswordHash,        PasswordHash),
                PasswordSalt        = ISNULL(@PasswordSalt,        PasswordSalt),
                SecurityQuestionId  = ISNULL(@SecurityQuestionId,  SecurityQuestionId),
                SecurityAnswerHash  = ISNULL(@SecurityAnswerHash,  SecurityAnswerHash),
                SecurityAnswerSalt  = ISNULL(@SecurityAnswerSalt,  SecurityAnswerSalt),
                UpdatedDate         = GETDATE()
            WHERE PatientId = @PatientId;
        END

        COMMIT;

        SELECT
            1           AS [Status],
            1           AS IsSuccess,
            'Patient updated successfully' AS ResponseMessage,
            @PatientId  AS ResponseId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        SELECT 0 AS [Status], 0 AS IsSuccess, ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_UpdatePatientOtpAttempts]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- USP_UpdatePatientOtpAttempts
-- =============================================
CREATE PROCEDURE [dbo].[USP_UpdatePatientOtpAttempts]
(
    @Email NVARCHAR(200)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @PatientId INT;

    SELECT @PatientId = PatientId 
    FROM Patient 
    WHERE Email = @Email;

    IF @PatientId IS NULL
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'Patient not found' AS ResponseMessage;
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM OtpMaster WHERE PatientId = @PatientId)
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 
               'OTP record not found' AS ResponseMessage;
        RETURN;
    END

    UPDATE OtpMaster
    SET
        OtpAttempts = OtpAttempts + 1,
        UpdatedDate = GETDATE()
    WHERE PatientId = @PatientId;

    SELECT
        CAST(1 AS BIT) AS IsSuccess,
        'OTP attempt updated successfully' AS ResponseMessage,
        OtpAttempts
    FROM OtpMaster
    WHERE PatientId = @PatientId;
END;
GO
/****** Object:  StoredProcedure [dbo].[USP_UserLogin]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- 2. USP_UserLogin
CREATE PROCEDURE [dbo].[USP_UserLogin]
(
    @Username VARCHAR(150)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT l.UserId, l.PasswordHash, l.PasswordSalt
    FROM   Login l
    INNER JOIN Users u ON l.UserId = u.UserId
    WHERE  l.Username = @Username;

    IF @@ROWCOUNT = 0
    BEGIN
        SELECT CAST(0 AS BIT) AS IsSuccess, 'User not found' AS ResponseMessage;
        RETURN;
    END
END
GO
/****** Object:  StoredProcedure [dbo].[USP_UserRegister]    Script Date: 6/8/2026 10:21:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- 1. USP_UserRegister
CREATE PROCEDURE [dbo].[USP_UserRegister]
(
    @FirstName      VARCHAR(100),
    @LastName       VARCHAR(100),
    @Email          VARCHAR(200),
    @PhoneNumber    VARCHAR(20)  = NULL,
    @RoleId         INT          = NULL,
    @DepartmentId   INT          = NULL,
    @Username       VARCHAR(150),
    @PasswordHash   VARBINARY(500),
    @PasswordSalt   VARBINARY(500),
    @CreatedBy      VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
        BEGIN
            SELECT 0 AS Status, 1 AS IsSuccess, 'Email already exists' AS ResponseMessage;
            ROLLBACK;
            RETURN;
        END

        IF EXISTS (SELECT 1 FROM Login WHERE Username = @Username)
        BEGIN
            SELECT 0 AS Status, 1 AS IsSuccess, 'Username already exists' AS ResponseMessage;
            ROLLBACK;
            RETURN;
        END

        INSERT INTO Users (FirstName, LastName, Email, RoleId, DepartmentId, PhoneNumber, CreatedBy, CreatedDate)
        VALUES            (@FirstName, @LastName, @Email, @RoleId, @DepartmentId, @PhoneNumber, @CreatedBy, GETDATE());

        DECLARE @UserId INT = SCOPE_IDENTITY();

        INSERT INTO Login (UserId, Username, PasswordHash, PasswordSalt, CreatedBy, CreatedDate)
        VALUES            (@UserId, @Username, @PasswordHash, @PasswordSalt, @CreatedBy, GETDATE());

        COMMIT;

        SELECT @UserId AS ResponseId, 1 AS IsSuccess, 'User registered successfully' AS ResponseMessage;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        SELECT 0 AS Status, 1 AS IsSuccess, ERROR_MESSAGE() AS ResponseMessage;
    END CATCH
END
GO
USE [master]
GO
ALTER DATABASE [db53801] SET  READ_WRITE 
GO
