export interface AppointmentRequestModel {
  profileId: number;
  associateId: number;
  slotId: number;

  firstName: string;
  lastName: string;
  age: number;
  ageTypeId: number;
  dateOfBirth: string;

  email: string;
  gender: string;
  phone: string;
  relationTypeId: number;

  visitPurposeId: number | null;
  visitTypeId: number | null;
  otpMethod: string;

  insuranceData: InsuranceData;
  paymentData: PaymentData;
  insurance: boolean;

  createdBy: string;
  associateRole: string;
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
}
