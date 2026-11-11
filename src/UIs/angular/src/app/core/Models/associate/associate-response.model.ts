export interface IAssociateResponseModel {
  associateId: number;
  userId: string;
  tenantId: string;
  userType: string;
  profileImage: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  identityDocument: string;

  employeeId: string;
  phoneCountryCode: string;
  phoneNumber: string;
  emailId: string;

  residentialAddress: string;
  permanentAddress: string;

  cityId: number;
  stateId: number;
  countryId: number;
  zipCode: string;

  languagesSpoken: string;

  emergencyName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  emergencyCode: string;

  joiningDate: string;
  employeeType: string | null;
  associateType: string;
  isActive: boolean;

  departmentId: number;
  departmentName: string;

  roleId: number;
  roleName: string;

  specialityId: number;
  specialityName: string;

  designationId: number;
  designationName: string | null;

  isSuccess: number;
  status: number;
  responseMessage: string;

  qualifications: QualificationModel[];
  experiences: ExperienceModel[];

  schedule: AssociateScheduleModel;
}

export interface AssociateScheduleModel {
  scheduleId: number;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  breakTimeFrom: string;
  breakTimeTo: string;
  workingDays: string;
  consultationTime: number;
  averageCharge: number;
  otpMethod: string;
  doctorRoom: string;
}

export interface QualificationModel {
  [key: string]: unknown;
}

export interface ExperienceModel {
  [key: string]: unknown;
}
