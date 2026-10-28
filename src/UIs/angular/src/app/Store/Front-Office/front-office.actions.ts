import { createAction, props } from "@ngrx/store";
import {
  ConfirmationSummary,
  Doctor,
  OtpChannel,
  PatientSearchRequest,
  PatientSummary,
  SearchTarget,
  Slot,
  TimeSlotRequest,
  LookupItem,
  Medication,
} from "../../core/Models/front-office/consultation.model";

// ---------- Navigation ----------
export const goToStep = createAction("[Consultation] Go To Step", props<{ step: number }>());
export const nextStep = createAction("[Consultation] Next Step");
export const previousStep = createAction("[Consultation] Previous Step");

// ---------- Draft sync (form -> store) ----------
export const patchDraft = createAction(
  "[Consultation] Patch Draft",
  props<{ value: Record<string, any> }>()
);
export const setPatientType = createAction(
  "[Consultation] Set Patient Type",
  props<{ patientType: "existing" | "new" }>()
);

// ---------- Single-choice UI state ----------
export const selectPainLevel = createAction(
  "[Consultation] Select Pain Level",
  props<{ level: number }>()
);
export const selectSpecialty = createAction(
  "[Consultation] Select Specialty",
  props<{ specialty: string }>()
);
export const selectUrgency = createAction(
  "[Consultation] Select Urgency",
  props<{ urgency: string }>()
);
export const selectAllergyStatus = createAction(
  "[Consultation] Select Allergy Status",
  props<{ status: string }>()
);

// ---------- Medications ----------
export const addMedication = createAction("[Consultation] Add Medication", props<{ id: string }>());
export const removeMedication = createAction(
  "[Consultation] Remove Medication",
  props<{ id: string }>()
);
export const updateMedication = createAction(
  "[Consultation] Update Medication",
  props<{ id: string; field: keyof Omit<Medication, "id">; value: string }>()
);
export const toggleNoMedications = createAction("[Consultation] Toggle No Medications");

// ---------- Masters ----------
export const loadMasters = createAction("[Consultation] Load Masters");
export const loadMastersSuccess = createAction(
  "[Consultation] Load Masters Success",
  props<{ ageTypes: LookupItem[]; relations: LookupItem[] }>()
);
export const loadMastersFailure = createAction(
  "[Consultation] Load Masters Failure",
  props<{ error: string }>()
);

// ---------- Patient / responsible-party search ----------
export const searchPatients = createAction(
  "[Consultation] Search Patients",
  props<{ target: SearchTarget; payload: PatientSearchRequest }>()
);
export const searchPatientsSuccess = createAction(
  "[Consultation] Search Patients Success",
  props<{ target: SearchTarget; patients: PatientSummary[] }>()
);
export const searchPatientsFailure = createAction(
  "[Consultation] Search Patients Failure",
  props<{ error: string }>()
);
export const selectPatient = createAction(
  "[Consultation] Select Patient",
  props<{ patient: PatientSummary }>()
);
export const clearPatient = createAction("[Consultation] Clear Patient");
export const resetResponsibleParty = createAction("[Consultation] Reset Responsible Party");

// ---------- Doctors / slots ----------
export const loadDoctors = createAction(
  "[Consultation] Load Doctors",
  props<{ department?: string }>()
);
export const loadDoctorsSuccess = createAction(
  "[Consultation] Load Doctors Success",
  props<{ doctors: Doctor[] }>()
);
export const loadDoctorsFailure = createAction(
  "[Consultation] Load Doctors Failure",
  props<{ error: string }>()
);

export const loadTimeSlots = createAction(
  "[Consultation] Load Time Slots",
  props<{ payload: TimeSlotRequest }>()
);
export const loadTimeSlotsSuccess = createAction(
  "[Consultation] Load Time Slots Success",
  props<{ slots: Slot[] }>()
);
export const loadTimeSlotsFailure = createAction(
  "[Consultation] Load Time Slots Failure",
  props<{ error: string }>()
);

// ---------- Responsible-party OTP ----------
export const openOtpChannel = createAction("[Consultation] Open OTP Channel");
export const closeOtp = createAction("[Consultation] Close OTP");
export const requestOtp = createAction(
  "[Consultation] Request OTP",
  props<{ channel: OtpChannel; email: string | null }>()
);
export const requestOtpSuccess = createAction(
  "[Consultation] Request OTP Success",
  props<{ channel: OtpChannel }>()
);
export const requestOtpFailure = createAction(
  "[Consultation] Request OTP Failure",
  props<{ error: string }>()
);
export const verifyOtp = createAction(
  "[Consultation] Verify OTP",
  props<{ email: string; otpCode: string }>()
);
export const verifyOtpSuccess = createAction("[Consultation] Verify OTP Success");
export const verifyOtpFailure = createAction(
  "[Consultation] Verify OTP Failure",
  props<{ error: string }>()
);

// ---------- Submit ----------
export const submitConsultation = createAction(
  "[Consultation] Submit",
  props<{ formValue: Record<string, any> }>()
);
export const submitConsultationSuccess = createAction(
  "[Consultation] Submit Success",
  props<{ confirmation: ConfirmationSummary }>()
);
export const submitConsultationFailure = createAction(
  "[Consultation] Submit Failure",
  props<{ error: string }>()
);

export const resetConsultation = createAction("[Consultation] Reset");
