import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as A from "./front-office.actions";
import * as S from "./front-office.selectors";
import {
  Medication,
  OtpChannel,
  PatientSearchRequest,
  PatientSummary,
  SearchTarget,
  TimeSlotRequest,
} from "../../core/Models/front-office/consultation.model";

@Injectable({ providedIn: "root" })
export class ConsultationFacade {
  constructor(private store: Store) {}

  currentStep$ = this.store.pipe(select(S.selectCurrentStep));
  stepLabel$ = this.store.pipe(select(S.selectStepLabel));
  isFirstStep$ = this.store.pipe(select(S.selectIsFirstStep));
  draft$ = this.store.pipe(select(S.selectDraft));
  patientType$ = this.store.pipe(select(S.selectPatientType));

  painLevel$ = this.store.pipe(select(S.selectPainLevel));
  selectedSpecialty$ = this.store.pipe(select(S.selectSelectedSpecialty));
  selectedUrgency$ = this.store.pipe(select(S.selectSelectedUrgency));
  allergyStatus$ = this.store.pipe(select(S.selectAllergyStatus));
  showAllergyDetails$ = this.store.pipe(select(S.selectShowAllergyDetails));
  medications$ = this.store.pipe(select(S.selectMedications));
  noCurrentMedications$ = this.store.pipe(select(S.selectNoCurrentMedications));

  ageTypes$ = this.store.pipe(select(S.selectAgeTypes));
  relations$ = this.store.pipe(select(S.selectRelations));
  doctors$ = this.store.pipe(select(S.selectDoctors));
  slots$ = this.store.pipe(select(S.selectAvailableSlots));

  patientResults$ = this.store.pipe(select(S.selectPatientResults));
  searchedPatient$ = this.store.pipe(select(S.selectSearchedPatient));
  selectedPatient$ = this.store.pipe(select(S.selectSelectedPatient));

  responsibleParty$ = this.store.pipe(select(S.selectResponsibleParty));
  rpStatus$ = this.store.pipe(select(S.selectRpStatus));
  otpModal$ = this.store.pipe(select(S.selectOtpModal));
  otpChannel$ = this.store.pipe(select(S.selectOtpChannel));
  otpVerified$ = this.store.pipe(select(S.selectOtpVerified));
  otpError$ = this.store.pipe(select(S.selectOtpError));
  accountStepBlocked$ = this.store.pipe(select(S.selectAccountStepBlocked));

  triageAlert$ = this.store.pipe(select(S.selectTriageAlert));
  isLoading$ = this.store.pipe(select(S.selectIsLoading));
  isSubmitting$ = this.store.pipe(select(S.selectIsSubmitting));
  error$ = this.store.pipe(select(S.selectError));
  confirmation$ = this.store.pipe(select(S.selectConfirmation));

  goToStep(step: number) {
    this.store.dispatch(A.goToStep({ step }));
  }
  nextStep() {
    this.store.dispatch(A.nextStep());
  }
  previousStep() {
    this.store.dispatch(A.previousStep());
  }
  patchDraft(value: Record<string, any>) {
    this.store.dispatch(A.patchDraft({ value }));
  }
  setPatientType(patientType: "existing" | "new") {
    this.store.dispatch(A.setPatientType({ patientType }));
  }

  selectPainLevel(level: number) {
    this.store.dispatch(A.selectPainLevel({ level }));
  }
  selectSpecialty(specialty: string) {
    this.store.dispatch(A.selectSpecialty({ specialty }));
    this.store.dispatch(A.loadDoctors({ department: specialty }));
  }
  selectUrgency(urgency: string) {
    this.store.dispatch(A.selectUrgency({ urgency }));
  }
  selectAllergyStatus(status: string) {
    this.store.dispatch(A.selectAllergyStatus({ status }));
  }

  addMedication() {
    this.store.dispatch(A.addMedication({ id: crypto.randomUUID() }));
  }
  removeMedication(id: string) {
    this.store.dispatch(A.removeMedication({ id }));
  }
  updateMedication(id: string, field: keyof Omit<Medication, "id">, value: string) {
    this.store.dispatch(A.updateMedication({ id, field, value }));
  }
  toggleNoMedications() {
    this.store.dispatch(A.toggleNoMedications());
  }

  loadMasters() {
    this.store.dispatch(A.loadMasters());
  }
  loadDoctors(department?: string) {
    this.store.dispatch(A.loadDoctors({ department }));
  }
  loadTimeSlots(payload: TimeSlotRequest) {
    this.store.dispatch(A.loadTimeSlots({ payload }));
  }

  searchPatients(target: SearchTarget, payload: PatientSearchRequest & { mobile?: string }) {
    this.store.dispatch(A.searchPatients({ target, payload }));
  }
  selectPatient(patient: PatientSummary) {
    this.store.dispatch(A.selectPatient({ patient }));
  }
  clearPatient() {
    this.store.dispatch(A.clearPatient());
  }
  resetResponsibleParty() {
    this.store.dispatch(A.resetResponsibleParty());
  }

  openOtpChannel() {
    this.store.dispatch(A.openOtpChannel());
  }
  closeOtp() {
    this.store.dispatch(A.closeOtp());
  }
  requestOtp(channel: OtpChannel, email: string | null) {
    this.store.dispatch(A.requestOtp({ channel, email }));
  }
  verifyOtp(email: string, otpCode: string) {
    this.store.dispatch(A.verifyOtp({ email, otpCode }));
  }

  submit(formValue: Record<string, any>) {
    this.store.dispatch(A.submitConsultation({ formValue }));
  }
  reset() {
    this.store.dispatch(A.resetConsultation());
  }
}
