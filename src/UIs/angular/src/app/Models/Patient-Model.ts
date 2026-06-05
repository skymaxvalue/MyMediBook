export interface PatientRegister {
    patientId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;

    phoneNumber: string;
    email: string;
    gender: string;

    addressLine1: string;
    addressLine2: string;
    cityId: number;
    zipCode: string;
    stateId: number;
    countryId: number;

    username: string;
    password: string;

    securityAnswer: string;
    securityQuestionId: number;

    isActive: boolean;

    createdBy: string;
    createdDate: string;

    updatedBy: string;
    updatedDate: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
export interface Country {
    countryId: number;
    countryName: string;
    countryCode: string;
    phoneCode: string
}