export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dob: string; // yyyy-MM-dd
  gender: "Male" | "Female" | "Other";
  mrn: string;
  mobile: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal: string;
}

export interface Medication {
  id: string;
  name: string;
  drugClass: string;
  strength: string;
  form: string;
  directions: string;
  lastFilled: string;
  refillsRemaining: number;
  status: "Active" | "Inactive";
  pharmacy: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  phone: string;
  address: string;
}

export interface Physician {
  id: string;
  name: string;
  department: string;
  phone: string;
}

export interface ClinicalInfo {
  lastVisit: string;
  physicianId: string;
  diagnosis: string[];
  monitoring: string[];
}

export interface PatientDetails {
  patient: Patient;
  medications: Medication[];
  preferredPharmacyId: string;
  clinical: ClinicalInfo;
}

export interface PatientSearchCriteria {
  lastName: string;
  mobile: string;
  dob: string;
}

export interface RefillRequestPayload {
  patientId: string;
  patientName: string;
  phone: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal: string;
  };
  medicationIds: string[];
  medicationNames: string[];
  pharmacyId: string;
  pharmacyName: string;
  reason: string;
  notes: string;
  physicianId: string;
  physicianName: string;
  physicianPhone: string;
  signature: string; // PNG data URL
  signDate: string;
}

export interface RefillResult {
  id: string;
  status: string;
  patientName: string;
  medications: string[];
  pharmacy: string;
}

export interface DraftResult {
  id: string;
  status: string;
}
