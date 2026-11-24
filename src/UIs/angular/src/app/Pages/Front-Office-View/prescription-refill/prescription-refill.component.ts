import { Component, ElementRef, ViewChild, OnInit, OnDestroy, inject } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { Subject, takeUntil } from "rxjs";

import { PrescriptionRefillFacade } from "./store/prescription-refill.facade";
import { CommonFacade } from "../../../Store/Common/common.facade";
import { SharedPatientSearchComponent } from "../../../shared/Components/shared-patient-search/shared-patient-search.component";
import { LoadStatus } from "../../../utils/enum/load-status.enum";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../../core/Models/common/search-patient.model";

import { Medication, Physician } from "./model/prescription-refill.model";

interface PatientProfile {
  firstName: string;
  lastName: string;
  email: string;
  lastVisit: string;
  physicianId: string;
  diagnoses: string[];
  monitoring: string[];
}

type ModalName = "history" | "physician" | "signature" | "draft" | "success" | "cancel";

@Component({
  selector: "app-prescription-refill",
  standalone: true,
  imports: [CommonModule, FormsModule, SharedPatientSearchComponent],
  styleUrl: "./prescription-refill.component.css",
  templateUrl: "./prescription-refill.component.html",
})
export class PrescriptionRefillComponent implements OnInit, OnDestroy {
  @ViewChild("signatureCanvas")
  signatureCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly facade = inject(PrescriptionRefillFacade);
  private readonly commonFacade = inject(CommonFacade);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // ---------------- PATIENT SEARCH (shared component) ----------------

  patients$ = this.commonFacade.searchedPatient$;
  isSearching$ = this.commonFacade.patientSearchLoadingStatus$;
  readonly LoadStatus = LoadStatus;

  // ---------------- STORE STREAMS ----------------

  medications$ = this.facade.medications$;
  physicians$ = this.facade.physicians$;

  // ---------------- STATE ----------------

  selectedPatientId: string | null = null;

  private ctx!: CanvasRenderingContext2D;
  private lastFocused: HTMLElement | null = null;
  private drawing = false;
  private hasInk = false;

  readonly DRAFTS_KEY = "prescriptionRefillDrafts_v1";
  readonly REQUESTS_KEY = "prescriptionRefillRequests_v1";
  readonly DRAFT_COUNTER_KEY = "prescriptionRefillDraftCounter_v1";
  readonly REQUEST_COUNTER_KEY = "prescriptionRefillRequestCounter_v1";

  readonly REQUEST_STATUS = "Pending Review";

  states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
    "West Bengal",
    "Other",
  ];

  pharmacies = {
    hhp: {
      name: "Health Haven Pharmacy",
      phone: "(212) 555-0189",
      address: "123 Medical Center Drive, New York, NY 10001",
    },
    other: {
      name: "Other pharmacy",
      phone: "",
      address: "",
    },
  };

  physicians: Physician[] = [
    { id: "dr-chen", name: "Dr. Chen", department: "Cardiology", phone: "(650) 123-4567" },
    { id: "dr-mehta", name: "Dr. Mehta", department: "Internal Medicine", phone: "" },
    { id: "dr-roy", name: "Dr. Roy", department: "Endocrinology", phone: "" },
  ];

  filteredPhysicians: Physician[] = [];

  patient: ISearchPatientResponseModel | null = null;
  physician: Physician | null = null;

  selectedMedicationIds = new Set<string>();

  // Patient information
  patientForm: any = this.emptyPatientForm();

  profile: PatientProfile | null = null;

  // Pharmacy
  usePreferred = true;
  pharmacyKey: "hhp" | "other" = "hhp";

  pharmacyForm = {
    phone: "",
    address: "",
  };

  // Refill reason
  refillReason = "Refill remaining medication";
  notes = "";

  // Physician
  physicianSearch = "";

  // Signature
  signature = "";
  signatureModalError = false;

  // Date
  signDate = "";

  // Modal states
  showHistoryModal = false;
  showPhysicianModal = false;
  showSignatureModal = false;
  showDraftModal = false;
  showSuccessModal = false;
  showCancelModal = false;

  // Validation
  errors: Record<string, string> = {};

  // Request
  submitting = false;

  draftId = "";
  requestId = "";

  successData = {
    patient: "",
    medications: "",
    pharmacy: "",
    status: "",
  };

  activeMedications: Medication[] = [];

  // ---------------- GETTERS ----------------

  get medications(): Medication[] {
    return this.activeMedications;
  }

  get selectedMedications(): Medication[] {
    return this.activeMedications.filter((m) => this.selectedMedicationIds.has(m.id));
  }

  get selectedCount(): number {
    return this.selectedMedicationIds.size;
  }

  get allSelected(): boolean {
    return (
      this.activeMedications.length > 0 && this.selectedCount === this.activeMedications.length
    );
  }

  get someSelected(): boolean {
    return this.selectedCount > 0 && !this.allSelected;
  }

  get historyMedications(): Medication[] {
    return this.patient ? this.activeMedications : [];
  }

  get currentDate(): string {
    return this.todayIso();
  }

  get physicianPhone(): string {
    return this.physician?.phone || "";
  }

  set physicianPhone(value: string) {
    if (this.physician) {
      this.physician.phone = value;
    }
  }

  // ---------------- LIFECYCLE ----------------

  ngOnInit(): void {
    this.facade.init();

    this.applyPharmacy();
    this.signDate = this.todayIso();

    this.medications$.pipe(takeUntil(this.destroy$)).subscribe((medications: Medication[]) => {
      this.activeMedications = medications ?? [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------- HELPERS ----------------

  private emptyPatientForm() {
    return {
      firstName: "",
      lastName: "",
      dob: "",
      age: "",
      gender: "",
      mrn: "",
      phone: "",
      email: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postal: "",
    };
  }

  // TODO: replace mock data with a patient-details API call
  buildProfile(patient: ISearchPatientResponseModel): PatientProfile {
    return {
      firstName: patient.firstName || "",
      lastName: patient.lastName || "",
      email: patient.email || "",
      lastVisit: "2026-05-14",
      physicianId: "dr-chen",
      diagnoses: ["Hypertension", "Hyperlipidemia"],
      monitoring: ["BP: 120/80 mmHg (May 14, 2026)", "Lipid Panel: Completed (May 12, 2026)"],
    };
  }

  // ---------------- DATE HELPERS ----------------

  todayIso(): string {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }

  formatDate(value: string): string {
    if (!value) return "--";

    const date = new Date(value + "T00:00:00");
    if (isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  formatLongDate(value: string): string {
    if (!value) return "--";

    const date = new Date(value + "T00:00:00");
    if (isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  formatAge(value: string): string {
    if (!value) return "";

    const dob = new Date(value.substring(0, 10) + "T00:00:00");
    const today = new Date();

    if (isNaN(dob.getTime()) || dob > today) return "";

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate()) months--;

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years <= 0) {
      return `${months} ${months === 1 ? "month" : "months"}`;
    }

    return `${years} ${years === 1 ? "year" : "years"}`;
  }

  // ---------------- PATIENT SEARCH HANDLERS ----------------

  searchPatientRequest(payload: ISearchPatientRequestModel): void {
    this.commonFacade.searchPatient(payload);
  }

  clearPatientSearch(): void {
    this.commonFacade.clearPatientSearch();
  }

  onPatientSelected(p: ISearchPatientResponseModel): void {
    this.patient = p;
    this.selectedPatientId = String(p.profileId);

    this.profile = this.buildProfile(p);
    this.selectedMedicationIds.clear();

    this.facade.selectPatient(this.selectedPatientId);

    this.patientForm = {
      firstName: p.firstName ?? "",
      lastName: p.lastName ?? "",
      dob: p.dateOfBirth,
      age: p.age,
      gender: p.gender ?? "",
      mrn: (p as any).mrn ?? "",
      phone: p.phoneNumber ?? "",
      email: this.profile.email,
    };

    this.physician = this.physicians.find((x) => x.id === this.profile?.physicianId) ?? null;

    this.usePreferred = true;
    this.pharmacyKey = "hhp";
    this.applyPharmacy();

    this.clearErrors();
  }

  onSwitchPatientProfile(): void {
    this.resetPatientState();

    // Re-run an empty search so the list reloads
    this.commonFacade.searchPatient({
      name: null,
      dob: null,
      mobileNo: null,
      fromDate: null,
      toDate: null,
    });
  }

  private resetPatientState(): void {
    this.patient = null;
    this.selectedPatientId = null;
    this.profile = null;
    this.physician = null;

    this.activeMedications = [];
    this.selectedMedicationIds.clear();

    this.facade.reset();

    this.patientForm = this.emptyPatientForm();

    this.usePreferred = true;
    this.pharmacyKey = "hhp";
    this.applyPharmacy();

    this.clearErrors();
  }

  // ---------------- MEDICATIONS ----------------

  toggleMedication(id: string, checked: boolean): void {
    if (checked) {
      this.selectedMedicationIds.add(id);
    } else {
      this.selectedMedicationIds.delete(id);
    }

    delete this.errors["medications"];
  }

  toggleAllMedications(checked: boolean): void {
    this.selectedMedicationIds.clear();

    if (checked) {
      this.medications.forEach((m) => this.selectedMedicationIds.add(m.id));
    }

    delete this.errors["medications"];
  }

  // ---------------- PHARMACY ----------------

  applyPharmacy(): void {
    if (this.usePreferred) {
      this.pharmacyKey = "hhp";
    }

    if (this.pharmacyKey === "other") {
      // Clear Health Haven values so the user can enter their own
      this.pharmacyForm.phone = "";
      this.pharmacyForm.address = "";
      return;
    }

    const pharmacy = this.pharmacies[this.pharmacyKey];
    this.pharmacyForm.phone = pharmacy.phone;
    this.pharmacyForm.address = pharmacy.address;
  }

  onPreferredChange(): void {
    this.applyPharmacy();
  }

  onPharmacyChange(): void {
    this.applyPharmacy();
  }

  // ---------------- PHYSICIAN ----------------

  openPhysicianModal(): void {
    this.physicianSearch = "";
    this.filterPhysicians();
    this.openModal("physician");
  }

  filterPhysicians(): void {
    const query = this.physicianSearch.trim().toLowerCase();

    this.filteredPhysicians = this.physicians.filter(
      (p) => p.name.toLowerCase().includes(query) || p.department.toLowerCase().includes(query)
    );
  }

  selectPhysician(physician: Physician): void {
    this.physician = physician;
    this.closeModal("physician");
    delete this.errors["physician"];
  }

  // ---------------- REFILL REASON ----------------

  onReasonChange(): void {
    delete this.errors["reason"];
    delete this.errors["notes"];
  }

  // ---------------- MODALS ----------------

  private setModal(name: ModalName, value: boolean): void {
    switch (name) {
      case "history":
        this.showHistoryModal = value;
        break;
      case "physician":
        this.showPhysicianModal = value;
        break;
      case "signature":
        this.showSignatureModal = value;
        break;
      case "draft":
        this.showDraftModal = value;
        break;
      case "success":
        this.showSuccessModal = value;
        break;
      case "cancel":
        this.showCancelModal = value;
        break;
    }
  }

  openModal(name: ModalName): void {
    this.lastFocused = document.activeElement as HTMLElement;
    this.setModal(name, true);
  }

  closeModal(name: ModalName): void {
    this.setModal(name, false);

    if (name === "success") {
      this.clearAll();
    }

    if (this.lastFocused) {
      this.lastFocused.focus();
      this.lastFocused = null;
    }
  }

  // ---------------- SIGNATURE ----------------

  openSignature(): void {
    this.openModal("signature");
    this.signatureModalError = false;

    setTimeout(() => this.setupCanvas());
  }

  setupCanvas(): void {
    if (!this.signatureCanvas) return;

    const canvas = this.signatureCanvas.nativeElement;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));

    this.ctx = canvas.getContext("2d")!;

    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.lineWidth = 2.2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#183153";

    this.hasInk = false;
  }

  private canvasPoint(event: PointerEvent) {
    const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  onPointerDown(event: PointerEvent): void {
    this.drawing = true;

    const point = this.canvasPoint(event);

    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    this.ctx.lineTo(point.x + 0.01, point.y + 0.01);
    this.ctx.stroke();

    this.hasInk = true;
    this.signatureModalError = false;

    this.signatureCanvas.nativeElement.setPointerCapture(event.pointerId);

    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.drawing) return;

    const point = this.canvasPoint(event);

    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    event.preventDefault();
  }

  onPointerUp(): void {
    this.drawing = false;
  }

  clearCanvas(): void {
    this.setupCanvas();
    this.signatureModalError = false;
  }

  applySignature(): void {
    if (!this.hasInk) {
      this.signatureModalError = true;
      return;
    }

    this.signature = this.signatureCanvas.nativeElement.toDataURL("image/png");

    this.closeModal("signature");
    delete this.errors["signature"];
  }

  clearSignature(): void {
    this.signature = "";
  }

  // ---------------- VALIDATION ----------------

  clearErrors(): void {
    this.errors = {};
  }

  validate(): boolean {
    this.clearErrors();

    if (!this.patient) {
      this.errors["patient"] = "Please search for and select a patient profile.";
    }

    const phone: string = this.patientForm.phone ?? "";
    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone.trim()) {
      this.errors["phone"] = "Phone number is required.";
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      this.errors["phone"] = "Enter a valid phone number.";
    }

    const email: string = this.patientForm.email ?? "";

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      this.errors["email"] = "Enter a valid email address.";
    }

    if (!(this.patientForm.address1 ?? "").trim()) {
      this.errors["address1"] = "Address line 1 is required.";
    }

    if (!(this.patientForm.city ?? "").trim()) {
      this.errors["city"] = "City is required.";
    }

    const postal: string = (this.patientForm.postal ?? "").trim();

    if (postal && !/^[A-Za-z0-9\- ]{3,10}$/.test(postal)) {
      this.errors["postal"] = "Enter a valid postal / zip code.";
    }

    const selected = this.selectedMedications;

    if (!selected.length) {
      this.errors["medications"] = "Select at least one medication to request a refill.";
    }

    if (
      this.pharmacyKey === "other" &&
      !this.pharmacyForm.phone.trim() &&
      !this.pharmacyForm.address.trim()
    ) {
      this.errors["pharmacy"] = "Enter the pharmacy phone number or address.";
    }

    if (!this.refillReason) {
      this.errors["reason"] = "Select a reason for the refill.";
    } else if (
      this.refillReason === "Refill remaining medication" &&
      selected.some((m) => m.refillsRemaining === 0)
    ) {
      this.errors["reason"] =
        'A selected medication has no refills remaining. Choose "No refills remaining" instead.';
    }

    if (this.refillReason === "Other" && !this.notes.trim()) {
      this.errors["notes"] = "Please describe the reason in additional information.";
    }

    if (!this.physician) {
      this.errors["physician"] = "Prescribing physician is required.";
    }

    if (!this.signature) {
      this.errors["signature"] = "Physician signature is required.";
    }

    if (!this.signDate) {
      this.errors["signDate"] = "Date signed is required.";
    } else if (this.signDate > this.todayIso()) {
      this.errors["signDate"] = "Date signed cannot be in the future.";
    }

    return Object.keys(this.errors).length === 0;
  }

  // ---------------- DATA COLLECTION ----------------

  pharmacyData() {
    return {
      name: this.pharmacies[this.pharmacyKey].name,
      phone: this.pharmacyForm.phone.trim(),
      address: this.pharmacyForm.address.trim(),
      preferred: this.usePreferred,
    };
  }

  collectData(): any {
    return {
      patientId: this.patient?.patientId ?? "",
      patientName: `${this.patientForm.firstName} ${this.patientForm.lastName}`,
      mrn: this.patientForm.mrn,

      contact: {
        phone: (this.patientForm.phone ?? "").trim(),
        email: (this.patientForm.email ?? "").trim(),
        address1: (this.patientForm.address1 ?? "").trim(),
        address2: (this.patientForm.address2 ?? "").trim(),
        city: (this.patientForm.city ?? "").trim(),
        state: this.patientForm.state,
        postal: (this.patientForm.postal ?? "").trim(),
      },

      medications: this.selectedMedications.map((m) => ({
        id: m.id,
        name: m.name,
        strength: m.strength,
        refills: m.refillsRemaining,
      })),

      pharmacy: this.pharmacyData(),
      reason: this.refillReason,
      notes: this.notes.trim(),

      physician: {
        name: this.physician?.name || "",
        department: this.physician?.department || "",
        phone: this.physician?.phone || "",
      },

      signature: this.signature,
      signedOn: this.signDate,
    };
  }

  // ---------------- LOCAL STORAGE (temporary, replace with API) ----------------

  nextId(prefix: string, counterKey: string): string {
    const next = parseInt(localStorage.getItem(counterKey) || "0", 10) + 1;

    localStorage.setItem(counterKey, String(next));

    return `${prefix}-${String(next).padStart(6, "0")}`;
  }

  appendToList(key: string, entry: any): void {
    let list: any[] = [];

    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      list = Array.isArray(parsed) ? parsed : [];
    } catch {
      list = [];
    }

    list.push(entry);
    localStorage.setItem(key, JSON.stringify(list));
  }

  // ---------------- SAVE DRAFT ----------------

  saveDraft(): void {
    this.clearErrors();

    if (!this.patient) {
      this.errors["patient"] = "Please search for and select a patient profile.";
      return;
    }

    this.draftId = this.nextId("DFT", this.DRAFT_COUNTER_KEY);

    const draft = {
      ...this.collectData(),
      draftId: this.draftId,
      status: "Draft",
      savedAt: new Date().toISOString(),
    };

    this.appendToList(this.DRAFTS_KEY, draft);

    this.openModal("draft");
  }

  // ---------------- SUBMIT REQUEST ----------------

  submitRequest(): void {
    if (this.submitting) return;
    if (!this.validate()) return;

    this.submitting = true;

    this.requestId = this.nextId("RFL", this.REQUEST_COUNTER_KEY);

    const request = {
      ...this.collectData(),
      requestId: this.requestId,
      status: this.REQUEST_STATUS,
      submittedAt: new Date().toISOString(),
    };

    this.appendToList(this.REQUESTS_KEY, request);

    this.successData = {
      patient: request.patientName,
      medications: request.medications.map((m: any) => m.name).join(", "),
      pharmacy: request.pharmacy.name,
      status: this.REQUEST_STATUS,
    };

    this.openModal("success");
  }

  // ---------------- RESET ----------------

  clearAll(): void {
    this.resetPatientState();
    this.commonFacade.clearPatientSearch();

    this.refillReason = "Refill remaining medication";
    this.notes = "";

    this.clearSignature();

    this.signDate = this.todayIso();

    this.clearErrors();

    this.submitting = false;
  }

  cancelRequest(): void {
    this.openModal("cancel");
  }

  discardRequest(): void {
    this.closeModal("cancel");
    this.clearAll();

    this.router.navigate(["/front-office/dashboard"]);
  }

  // ---------------- HISTORY ----------------

  openHistory(): void {
    this.openModal("history");
  }
}
