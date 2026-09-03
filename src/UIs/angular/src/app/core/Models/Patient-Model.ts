import { InsuranceData, PaymentData } from "./Appointment-Model";

export interface PatientRegister {
    patientId?: number;
    firstName: string;
    middleName: string;
    lastName: string;
    dateOfBirth: string;
    phoneCountryCode: string;
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

export interface MedicineOrder {
    orderId: number;
    patientId: number;
    profileId: number;
    associateId: number;

    patientName: string;
    dateOfBirth: string;
    gender: string;

    doctorName: string;

    pharmacyId: number;
    pharmacyName: string;
    pharmacistName: string;
    pharmacyMobile: string;
    pharmacyAddress: string;

    drugName: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions: string;

    expiryDate: string;
    orderStatus: string;

    cancelReason: string | null;
    cancelledDate: string;
    createdDate: string;
    updatedDate: string;

    isSuccess: number;
    status: number;
    responseMessage: string;

    // UI fields
    refill?: boolean;
    image?: string;
}
interface Appointment {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    dateOfBirth: string;
    age: number | '';
    ageUnit: string;
    gender: string;

    // Present Address
    address: string;
    country: string;
    state: string;
    cityVillage: string;
    pinCode: string;

    // Permanent Address
    sameAsPresentAddress: boolean;
    permanentAddress: string;
    permanentCountry: string;
    permanentState: string;
    permanentCityVillage: string;
    permanentPinCode: string;

    insurance: string;
    insuranceData: InsuranceData | null;
    paymentData: PaymentData | null;
    otpMethod: string;
}