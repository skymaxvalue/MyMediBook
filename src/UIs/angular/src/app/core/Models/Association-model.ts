export interface AssociateRequest {
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    identityDocument: string;
    identityFile: string;
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
    employeeType: string;
    departmentId: number;
    roleId: number;
    specialityId: number;
    createdBy: string;
    associateQualification: AssociateQualification;
    associateExperience: AssociateExperience;
}
export interface UpdateAssociateScheduleRequest {
    associateId: number;
    roleId: number;
    departmentId: number;
    specialityId: number;

    fromDate: null;
    toDate: null;

    fromTime: null;
    toTime: null;

    breakTimeFrom: null;
    breakTimeTo: null;

    workingDays: null;

    consultationTime: number;
    averageCharge: number;
    designationId?: number;

    updatedBy: null;
}

export interface AssociateQualification {
    highestDegree: string;
    specialization: string;
    institutionName: string;
    yearOfPassing: number;
    registrationNumber: string;
    licenseExpiry: string;
    additionalCertifications: string;
    qualificationDocuments: string;
}

export interface AssociateExperience {
    experienceYears: number;
    organizationName: string;
    designationRole: string;
    departmentWorked: string;
    keySkills: string;
}
export interface CreateScheduleRequest {
    associateId: number;
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
    createdBy: string;
}