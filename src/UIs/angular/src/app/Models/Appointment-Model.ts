export interface AppointmentBooking {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    age: number;
    ageType: string;
    gender: string;
    insurance: string;

    insuranceData: InsuranceData;

    paymentData: PaymentData;

    address: string;
    phone: string;
    email: string;
    visitPurpose: string;
    visitType: string;
    otpMethod: string;
}

export interface InsuranceData {
    provider: string;
    policy: string;
    groupId: string;
    holderName: string;
    address: string;
}

export interface PaymentData {
    paymentType: string;
    cardHolder: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}