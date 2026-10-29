export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
}

export interface PatientSummary {
  profileId: number;
  patientId?: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  dateOfBirth: string;
  gender?: string;
}

export interface Doctor {
  associateId: number;
  name: string;
  speciality: string;
}
export interface Slot {
  slotId: number;
  time: string;
  isAvailable: boolean;
}
export interface LookupItem {
  id: number;
  name: string;
}

export interface PatientSearchRequest {
  name?: string | null;
  dob?: string | null;
  associateId?: number | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface TimeSlotRequest {
  associateId: number;
  fromDate: string;
  toDate: string;
}

export type SearchTarget = "patient" | "responsible";
export type OtpChannel = "phone" | "email" | "none";
export type OtpModal = "closed" | "channel" | "otp";
export type RpStatus = "idle" | "found" | "notFound";

export interface ConfirmationSummary {
  consultationId: string;
  patient: string;
  physician: string;
  specialty: string;
  dateTime: string;
  mode: string;
  status: string;
}
