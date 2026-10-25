import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

type Num = number | string | null;
type ErrorList = [string, string][];
type EntryKind = "med" | "lab" | "plan";

type Medication = { name: string; dose: string; frequency: string; status: string; note: string };
type LabTest = { name: string; kind: string; date: string; result: string; status: string };
type PlanTest = { name: string; reason: string; expected: string; status: string };

interface EntryField {
  k: string;
  l: string;
  req?: boolean;
  max?: number;
  ph?: string;
  t?: "text" | "date" | "select";
  opts?: string[];
}

interface EntryConfig {
  noun: string;
  add: string;
  fields: EntryField[];
}

interface DialogState {
  open: boolean;
  mode: "entry" | "view" | "confirm" | "message";
  title: string;
  fields: EntryField[];
  values: Record<string, string>;
  errors: Record<string, string>;
  details: [string, string][];
  message: string;
  submitLabel: string;
  cancelLabel: string;
  danger: boolean;
}

interface ReviewCell {
  text: string;
  sub?: string;
  pill?: string;
  strong?: boolean;
}

interface ReviewBlock {
  rows?: [string, string][];
  table?: { head: string[]; rows: ReviewCell[][] };
  list?: string[];
}

interface ReviewEdit {
  step: number;
  label: string;
  aria?: string;
}

interface ReviewCard {
  icon: string;
  title: string;
  edits: ReviewEdit[];
  blocks: ReviewBlock[];
  span?: boolean;
}

interface FollowUpForm {
  fullName: string;
  dob: string;
  mrn: string;
  phone: string;
  contactMethod: string;
  patientConfirmed: boolean;

  visitDate: string;
  visitType: string;
  companion: string;
  referrer: string;
  insurance: string;

  sinceEvents: string;
  newEvents: string;

  condition: string;
  symptoms: string[];
  symptomOther: string;
  improvement: string;
  treatAdherence: string;
  treatAdherenceNote: string;
  notesProgress: string;

  noMedications: boolean;
  medChanges: string[];
  medChangeDetails: string;
  medAdherence: string;
  medAdherenceNote: string;
  refills: string;
  refillNotes: string;

  bpSys: Num;
  bpDia: Num;
  heartRate: Num;
  temp: Num;
  tempUnit: string;
  respRate: Num;
  height: Num;
  weight: Num;
  spo2: Num;

  examGeneral: string;
  examCardio: string;
  examResp: string;
  examAbdo: string;
  examOther: string;
  treatments: string;

  planInterval: string;
  planDate: string;
  planNotes: string;
  notesVitals: string;

  prefTime: string;
  nextVisitType: string;
  nextPhysician: string;
  nextReason: string;
  lifestyle: string[];
  nextInstructions: string;

  consentAccurate: boolean;
  consentSubmit: boolean;
}

/* =========================================================
   Constants
   ========================================================= */

const DASH = "\u2014";

// TODO(PHI): drafts and submissions below are stored in localStorage, as in the
// team's prototype. Replace storeDraft / fetchDraft / discardDraft / storeSubmission
// with API calls before this ships.
const DRAFT_KEY = "followUpVisitDraft_v2";
const LEGACY_DRAFT_KEY = "followUpVisitDraft";
const SUBMITTED_KEY = "followUpVisitSubmitted_v1";
const COUNTER_KEY = "followUpVisitCounter_v1";

const INTERVAL_STEP: Record<string, [number, number]> = {
  w1: [0, 7],
  w2: [0, 14],
  m1: [1, 0],
  m3: [3, 0],
  m6: [6, 0],
  m12: [12, 0],
};

const PILL: Record<string, string> = {
  Continuing: "ok",
  Reviewed: "ok",
  Completed: "ok",
  New: "info",
  Ordered: "info",
  Planned: "info",
  Scheduled: "info",
  "Dose changed": "warn",
  Pending: "warn",
  Stopped: "muted",
  Cancelled: "muted",
};

const ENTRY: Record<EntryKind, EntryConfig> = {
  med: {
    noun: "medication",
    add: "Add Medication",
    fields: [
      { k: "name", l: "Medication", req: true, max: 80 },
      { k: "dose", l: "Dose", req: true, max: 40, ph: "e.g. 10 mg" },
      {
        k: "frequency",
        l: "Frequency",
        req: true,
        max: 60,
        ph: "e.g. Once daily",
        opts: ["Once daily", "Twice daily", "Three times daily", "At bedtime", "As needed"],
      },
      {
        k: "status",
        l: "Status",
        t: "select",
        req: true,
        opts: ["Continuing", "New", "Dose changed", "Stopped"],
      },
      { k: "note", l: "Notes (optional)", max: 120 },
    ],
  },
  lab: {
    noun: "test or Imaging",
    add: "Add Test",
    fields: [
      { k: "name", l: "Test or imaging", req: true, max: 80 },
      { k: "kind", l: "Type", t: "select", req: true, opts: ["Blood test", "Imaging", "Other"] },
      { k: "date", l: "Date", t: "date", req: true },
      { k: "result", l: "Result", max: 120 },
      {
        k: "status",
        l: "Status",
        t: "select",
        req: true,
        opts: ["Ordered", "Pending", "Reviewed", "Cancelled"],
      },
    ],
  },
  plan: {
    noun: "Test or Assessment",
    add: "Add Test",
    fields: [
      { k: "name", l: "Test or assessment", req: true, max: 80 },
      { k: "reason", l: "Reason", max: 120 },
      {
        k: "expected",
        l: "Expected date",
        max: 60,
        ph: "e.g. At next visit",
        opts: ["At next visit", "Before next visit"],
      },
      {
        k: "status",
        l: "Status",
        t: "select",
        req: true,
        opts: ["Planned", "Scheduled", "Completed", "Cancelled"],
      },
    ],
  },
};

/** Maps an input's name attribute to the key its error is stored under. */
const ERROR_KEY: Record<string, string> = {
  bpSys: "bp",
  bpDia: "bp",
  tempUnit: "temp",
  noMedications: "meds",
  consentAccurate: "consent",
  consentSubmit: "consent",
  planInterval4: "planInterval",
  planInterval5: "planInterval",
  planDate4: "planDate",
  planDate5: "planDate",
};

const ON_FILE_FIELDS = ["dob", "mrn", "phone", "insurance"];

function blankForm(): FollowUpForm {
  return {
    fullName: "",
    dob: "",
    mrn: "",
    phone: "",
    contactMethod: "",
    patientConfirmed: false,

    visitDate: "",
    visitType: "",
    companion: "",
    referrer: "",
    insurance: "",

    sinceEvents: "",
    newEvents: "",

    condition: "",
    symptoms: [],
    symptomOther: "",
    improvement: "",
    treatAdherence: "",
    treatAdherenceNote: "",
    notesProgress: "",

    noMedications: false,
    medChanges: [],
    medChangeDetails: "",
    medAdherence: "",
    medAdherenceNote: "",
    refills: "",
    refillNotes: "",

    bpSys: "",
    bpDia: "",
    heartRate: "",
    temp: "",
    tempUnit: "F",
    respRate: "",
    height: "",
    weight: "",
    spo2: "",

    examGeneral: "",
    examCardio: "",
    examResp: "",
    examAbdo: "",
    examOther: "",
    treatments: "",

    planInterval: "",
    planDate: "",
    planNotes: "",
    notesVitals: "",

    prefTime: "",
    nextVisitType: "",
    nextPhysician: "",
    nextReason: "",
    lifestyle: [],
    nextInstructions: "",

    consentAccurate: false,
    consentSubmit: false,
  };
}

function blankDialog(): DialogState {
  return {
    open: false,
    mode: "entry",
    title: "",
    fields: [],
    values: {},
    errors: {},
    details: [],
    message: "",
    submitLabel: "",
    cancelLabel: "Cancel",
    danger: false,
  };
}

const BLANK_RECEIPT = {
  reference: "",
  patient: "",
  visitDate: "",
  nextVisit: "",
  submittedOn: "",
  status: "",
};

/* =========================================================
   Component
   ========================================================= */

@Component({
  selector: "app-follow-up-visits",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./follow-up-visits.component.html",
  styleUrl: "./follow-up-visits.component.css",
})
export class FollowUpVisitsComponent implements OnInit {
  readonly icons = "assets/images/front-office/images/";
  readonly today = this.formatDate(new Date());
  readonly totalSteps = 6;

  currentStep = 1;
  completed: Record<number, boolean> = {};

  form: FollowUpForm = blankForm();
  medications: Medication[] = [];
  labs: LabTest[] = [];
  planTests: PlanTest[] = [];

  errors: Record<string, string> = {};
  alert = { show: false, title: "", messages: [] as string[] };

  // Previous-visit tiles. TODO: fill from the visits API; stays empty (shows "—") until then.
  summary = { lastVisit: "", provider: "", diagnosis: "", status: "" };

  // Patient autocomplete. TODO: wire to a patient search source; empty = feature off.
  patientOptions: string[] = [];
  onFile: string[] = [];

  submitted = false;
  busy = false;
  status: "New" | "Draft" | "Submitted" = "New";
  reference: string | null = null;
  modal: "draft" | "submit" | null = null;
  draftMessage =
    "Your follow-up visit draft is saved in this browser. It has not been sent to a server.";
  receipt = { ...BLANK_RECEIPT };

  dialog: DialogState = blankDialog();
  reviewCards: ReviewCard[] = [];

  private dateManual = false;
  private lastUnit = "F";
  private lastFocus: HTMLElement | null = null;
  private dialogAction: (() => boolean) | null = null;

  readonly steps = [
    { number: 1, title: "Patient" },
    { number: 2, title: "Progress" },
    { number: 3, title: "Medications" },
    { number: 4, title: "Vitals" },
    { number: 5, title: "Next Visit" },
    { number: 6, title: "Review" },
  ];

  readonly symptomOptions = [
    "No Symptoms",
    "Chest Pain",
    "Shortness of Breath",
    "Palpitations",
    "Dizziness",
    "Fatigue",
    "Headache",
    "Swelling",
    "Nausea",
    "Vomiting",
    "Joint Pain",
    "Numbness / Tingling",
    "Vision Changes",
    "Weight Changes",
    "Appetite Changes",
    "Sleep Disturbance",
    "Anxiety / Low Mood",
    "Other",
  ];

  readonly improvementOptions = [
    "Much Better",
    "Somewhat Better",
    "No Change",
    "Somewhat Worse",
    "Much Worse",
  ];

  readonly medChangeOptions = [
    "No Changes",
    "Started New Medication",
    "Stopped a Medication",
    "Dose Changed",
    "Frequency Changed",
  ];

  readonly lifestyleOptions = [
    { value: "Continue Regular Exercise", sub: "Keep up regular physical activity" },
    { value: "Take Medications as Prescribed", sub: "Follow the prescribed schedule" },
    { value: "Maintain a Healthy Diet", sub: "Follow the dietary guidance given" },
    { value: "Maintain a Healthy Weight", sub: "Work toward the weight goal agreed" },
    { value: "Avoid Tobacco Use", sub: "Do not smoke or use tobacco products" },
    { value: "Limit Alcohol Consumption", sub: "Stay within the limits advised" },
  ];

  readonly intervalOptions = [
    { value: "w1", label: "1 week" },
    { value: "w2", label: "2 weeks" },
    { value: "m1", label: "1 month" },
    { value: "m3", label: "3 months" },
    { value: "m6", label: "6 months" },
    { value: "m12", label: "12 months" },
    { value: "asneeded", label: "As needed" },
  ];

  constructor(private host: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Old prototype key from the previous version of this page; it held patient data.
    localStorage.removeItem(LEGACY_DRAFT_KEY);

    this.form.visitDate = this.today;
    this.restoreDraft();
    this.loadSummary();
  }

  /* ---------------------------------------------------------
     Derived state
     --------------------------------------------------------- */

  get stepCounter(): string {
    return `Step ${this.currentStep} of ${this.totalSteps}`;
  }

  get badge(): string {
    if (this.reference) return this.reference;
    if (this.status === "Draft") return "";
    return "New visit";
  }

  get bmi(): string {
    const value = this.calcBmi(this.form.height, this.form.weight);
    return value === null ? "" : value.toFixed(1);
  }

  get showOtherSymptoms(): boolean {
    return this.form.symptoms.includes("Other");
  }

  get showTreatmentNote(): boolean {
    return this.form.treatAdherence === "No";
  }

  get showMedicationChangeDetails(): boolean {
    return this.form.medChanges.some((c) => c !== "No Changes");
  }

  get showMedicationAdherenceNote(): boolean {
    return this.form.medAdherence === "Mostly" || this.form.medAdherence === "No";
  }

  /* ---------------------------------------------------------
     Stepper / navigation
     --------------------------------------------------------- */

  private get reach(): number {
    let r = 1;
    while (this.completed[r] && r < this.totalSteps) r++;
    return r;
  }

  isDone(n: number): boolean {
    return n !== this.currentStep && !!this.completed[n];
  }

  isLocked(n: number): boolean {
    return n > this.reach;
  }

  stepLabel(s: { number: number; title: string }): string {
    const state =
      s.number === this.currentStep
        ? "current"
        : this.isDone(s.number)
          ? "completed"
          : this.isLocked(s.number)
            ? "locked"
            : "not completed";
    return `Step ${s.number}, ${s.title}, ${state}`;
  }

  onStepClick(target: number): void {
    if (target === this.currentStep) return;

    if (target < this.currentStep || this.submitted) {
      this.goToStep(target);
      return;
    }

    const fail = this.firstFailure(this.currentStep, target - 1);
    for (let s = this.currentStep; s < target && (!fail || s < fail.step); s++) {
      this.completed[s] = true;
    }

    if (fail) {
      this.goToStep(fail.step);
      this.showErrors(fail.errs);
      return;
    }

    this.goToStep(target);
  }

  onNext(): void {
    if (this.submitted) {
      this.resetForm();
      return;
    }

    if (this.currentStep === this.totalSteps) {
      this.submit();
      return;
    }

    if (!this.validateStep(this.currentStep)) return;

    this.completed[this.currentStep] = true;
    this.goToStep(this.currentStep + 1);
  }

  back(): void {
    if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
  }

  private goToStep(n: number): void {
    this.currentStep = n;
    this.clearErrors();
    if (n === this.totalSteps) this.buildReview();

    setTimeout(() => {
      this.host.nativeElement
        .querySelector(".rs-page-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  onReviewEdit(step: number): void {
    if (!this.submitted) this.goToStep(step);
  }

  /* ---------------------------------------------------------
     Field events (delegated from the <form>)
     --------------------------------------------------------- */

  onFieldEvent(e: Event): void {
    const el = e.target as HTMLInputElement | null;
    if (!el || !el.name) return;

    this.clearError(ERROR_KEY[el.name] ?? el.name);

    if (el.name === "noMedications" && el.checked && this.medications.length) {
      el.checked = false;
      this.form.noMedications = false;
    }

    if (el.name.startsWith("planInterval")) this.autoDate();

    if (el.name.startsWith("planDate")) {
      this.dateManual = this.form.planDate !== "";
      if (!this.dateManual) this.autoDate();
    }

    if (el.name === "visitDate") this.autoDate();
    if (el.name === "tempUnit") this.convertTemp(this.form.tempUnit);

    if (ON_FILE_FIELDS.includes(el.name) && e.type === "input") {
      this.onFile = this.onFile.filter((n) => n !== el.name);
    }

    if (el.name === "fullName" && e.type === "change") this.matchPatient();
  }

  toggleArrayValue(
    name: "symptoms" | "medChanges" | "lifestyle",
    value: string,
    checked: boolean
  ): void {
    let next = this.form[name].filter((x) => x !== value);
    if (checked) next = [...next, value];

    const none = name === "symptoms" ? "No Symptoms" : name === "medChanges" ? "No Changes" : null;
    if (none && checked) {
      next = value === none ? [none] : next.filter((x) => x !== none);
    }

    this.form[name] = next;
  }

  private autoDate(): void {
    if (this.dateManual) return;
    const base = this.parseISO(this.form.visitDate) ? this.form.visitDate : this.today;
    this.form.planDate = this.addInterval(base, this.form.planInterval);
  }

  private convertTemp(unit: string): void {
    const raw = this.form.temp;
    if (this.lastUnit !== unit && this.isNum(raw)) {
      const n = Number(raw);
      const converted = unit === "C" ? ((n - 32) * 5) / 9 : (n * 9) / 5 + 32;
      this.form.temp = Math.round(converted * 10) / 10;
    }
    this.lastUnit = unit;
  }

  /** TODO: look the typed name up in a patient source, fill dob/mrn/phone/insurance and set onFile. */
  private matchPatient(): void {
    /* autocomplete is off until a patient source exists */
  }

  /** TODO: load the previous visit for the selected patient from the API. */
  private loadSummary(): void {
    /* tiles show "—" until then */
  }

  /* ---------------------------------------------------------
     Table dialogs (add / edit / view / remove)
     --------------------------------------------------------- */

  pillKind(status: string): string {
    return PILL[status] ?? "info";
  }

  private listFor(kind: EntryKind): Record<string, string>[] {
    const lists = { med: this.medications, lab: this.labs, plan: this.planTests };
    return lists[kind] as Record<string, string>[];
  }

  openEntry(kind: EntryKind, index?: number): void {
    const cfg = ENTRY[kind];
    const editing = index !== undefined;
    const rec: Record<string, string> = editing ? this.listFor(kind)[index as number] : {};

    const values: Record<string, string> = {};
    cfg.fields.forEach((f) => (values[f.k] = rec[f.k] ?? ""));

    this.dialogAction = () => this.saveEntry(kind, index);
    this.openDialog({
      mode: "entry",
      title: `${editing ? "Edit" : "Add"} ${cfg.noun}`,
      fields: cfg.fields,
      values,
      submitLabel: editing ? "Save Changes" : cfg.add,
    });
  }

  private saveEntry(kind: EntryKind, index?: number): boolean {
    const cfg = ENTRY[kind];
    const errs: Record<string, string> = {};
    const next: Record<string, string> = {};

    cfg.fields.forEach((f) => {
      const v = (this.dialog.values[f.k] ?? "").trim();
      next[f.k] = v;
      if (f.req && !v) errs[f.k] = `${f.l} is required.`;
      else if (f.t === "date" && v && !this.parseISO(v)) errs[f.k] = "Enter a valid date.";
    });

    if (Object.keys(errs).length) {
      this.dialog.errors = errs;
      this.focusIn(".modal-overlay.show .fu-invalid");
      return false;
    }

    const list = this.listFor(kind);
    if (index !== undefined) list[index] = next;
    else list.push(next);

    if (kind === "med") {
      this.form.noMedications = false;
      this.clearError("meds");
    }
    return true;
  }

  openView(index: number): void {
    const r = this.labs[index];
    this.dialogAction = null;
    this.openDialog({
      mode: "view",
      title: "Test or imaging details",
      details: [
        ["Test or imaging", r.name],
        ["Type", r.kind],
        ["Date", this.fmtDate(r.date)],
        ["Result", r.result],
        ["Status", r.status],
      ],
      cancelLabel: "Close",
    });
  }

  confirmRemove(kind: EntryKind, index: number): void {
    const cfg = ENTRY[kind];
    const rec = this.listFor(kind)[index];
    this.dialogAction = () => {
      this.listFor(kind).splice(index, 1);
      return true;
    };
    this.openDialog({
      mode: "confirm",
      title: `Remove ${cfg.noun}`,
      message: `Remove "${rec["name"]}" from this follow-up visit?`,
      submitLabel: "Remove",
      danger: true,
    });
  }

  private openMessage(title: string, message: string): void {
    this.dialogAction = null;
    this.openDialog({ mode: "message", title, message, cancelLabel: "Close" });
  }

  private openDialog(partial: Partial<DialogState>): void {
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.dialog = { ...blankDialog(), ...partial, open: true };
    this.focusDialog(".modal-overlay.show");
  }

  submitDialog(): void {
    if (this.dialogAction && this.dialogAction() !== false) this.closeDialog();
  }

  closeDialog(): void {
    this.dialog = { ...this.dialog, open: false };
    this.dialogAction = null;
    this.restoreFocus();
  }

  openModal(kind: "draft" | "submit"): void {
    this.lastFocus = document.activeElement as HTMLElement | null;
    this.modal = kind;
    this.focusDialog(".modal-overlay.show");
  }

  closeModal(): void {
    this.modal = null;
    this.restoreFocus();
  }

  @HostListener("document:keydown", ["$event"])
  onKeydown(e: KeyboardEvent): void {
    const open = this.host.nativeElement.querySelector(".modal-overlay.show") as HTMLElement | null;
    if (!open) return;

    if (e.key === "Escape") {
      if (this.dialog.open) this.closeDialog();
      else this.closeModal();
      return;
    }

    if (e.key !== "Tab") return;

    const items = this.focusables(open);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  private focusables(root: HTMLElement): HTMLElement[] {
    return Array.from(
      root.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")
    ).filter((x) => !(x as HTMLButtonElement).disabled && x.offsetParent !== null);
  }

  private focusDialog(overlaySelector: string): void {
    setTimeout(() => {
      const root = this.host.nativeElement.querySelector(overlaySelector) as HTMLElement | null;
      if (!root) return;
      const items = this.focusables(root);
      const target = items.find((x) => x.matches("input, select, textarea")) ?? items[0];
      target?.focus();
    }, 0);
  }

  private focusIn(selector: string): void {
    setTimeout(() => {
      const first = this.host.nativeElement.querySelector(selector) as HTMLElement | null;
      if (!first) return;
      const target = first.matches("input, select, textarea")
        ? first
        : first.querySelector("input, select, textarea");
      (target as HTMLElement | null)?.focus();
    }, 0);
  }

  private restoreFocus(): void {
    if (this.lastFocus && document.contains(this.lastFocus)) this.lastFocus.focus();
  }

  /* ---------------------------------------------------------
     Validation
     --------------------------------------------------------- */

  /** Copy of the form with values of hidden conditional fields cleared. */
  private cleanData(): FollowUpForm {
    const d: FollowUpForm = {
      ...this.form,
      symptoms: [...this.form.symptoms],
      medChanges: [...this.form.medChanges],
      lifestyle: [...this.form.lifestyle],
    };

    if (!d.symptoms.includes("Other")) d.symptomOther = "";
    if (d.treatAdherence !== "No") d.treatAdherenceNote = "";
    if (!d.medChanges.length || d.medChanges.includes("No Changes")) d.medChangeDetails = "";
    if (!["Mostly", "No"].includes(d.medAdherence)) d.medAdherenceNote = "";
    return d;
  }

  private validate(step: number, d: FollowUpForm): ErrorList {
    const errs: ErrorList = [];
    const today = this.today;
    const s = (v: unknown) => this.str(v).trim();

    switch (step) {
      case 1: {
        const name = s(d.fullName);
        if (!name) errs.push(["fullName", "Enter the patient\u2019s full name."]);
        else if (name.length < 2)
          errs.push(["fullName", "Full name must be at least 2 characters."]);

        if (!d.dob) errs.push(["dob", "Enter the date of birth."]);
        else if (!this.parseISO(d.dob)) errs.push(["dob", "Enter a valid date of birth."]);
        else if (d.dob > today) errs.push(["dob", "Date of birth cannot be in the future."]);
        else if (d.dob < "1900-01-01")
          errs.push(["dob", "Date of birth must be on or after 1900."]);

        const mrn = s(d.mrn);
        if (!mrn) errs.push(["mrn", "Enter the medical record number."]);
        else if (!/^[A-Za-z0-9-]{3,20}$/.test(mrn)) {
          errs.push([
            "mrn",
            "MRN may contain letters, numbers and hyphens only (3\u201320 characters).",
          ]);
        }

        const phone = s(d.phone);
        const digits = phone.replace(/\D/g, "");
        if (!phone) errs.push(["phone", "Enter a phone number."]);
        else if (!/^[\d\s()+\-.]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
          errs.push(["phone", "Enter a valid phone number with 10 to 15 digits."]);
        }

        if (!d.contactMethod) errs.push(["contactMethod", "Select a preferred contact method."]);

        if (!d.visitDate) errs.push(["visitDate", "Enter the visit date."]);
        else if (!this.parseISO(d.visitDate)) errs.push(["visitDate", "Enter a valid visit date."]);
        else if (d.visitDate > today)
          errs.push(["visitDate", "Visit date cannot be in the future."]);
        else if (this.parseISO(d.dob) && d.visitDate < d.dob) {
          errs.push(["visitDate", "Visit date cannot be before the date of birth."]);
        }

        if (!d.visitType) errs.push(["visitType", "Select a visit type."]);
        if (!d.sinceEvents) {
          errs.push([
            "sinceEvents",
            "Select whether there were hospitalizations or emergency visits.",
          ]);
        }
        if (!d.patientConfirmed)
          errs.push(["patientConfirmed", "Confirm the patient details with the patient."]);
        break;
      }

      case 2:
        if (!s(d.condition))
          errs.push(["condition", "Describe how the patient has been since the last visit."]);
        if (!d.symptoms.length)
          errs.push(["symptoms", "Select at least one symptom option, or No Symptoms."]);
        if (d.symptoms.includes("Other") && !s(d.symptomOther)) {
          errs.push(["symptomOther", "Describe the other symptoms."]);
        }
        if (!d.improvement)
          errs.push(["improvement", "Select how the condition compares with the last visit."]);
        if (!d.treatAdherence)
          errs.push(["treatAdherence", "Select whether the treatment plan has been followed."]);
        if (d.treatAdherence === "No" && !s(d.treatAdherenceNote)) {
          errs.push(["treatAdherenceNote", "Specify why the treatment plan was not followed."]);
        }
        break;

      case 3:
        if (!this.medications.length && !d.noMedications) {
          errs.push(["meds", "Add a medication, or confirm the patient takes none."]);
        }
        if (this.medications.length && d.noMedications) {
          errs.push([
            "meds",
            "Medications are listed. Clear \u201Cnot taking any medications\u201D or remove them.",
          ]);
        }
        if (!d.medChanges.length) {
          errs.push(["medChanges", "Select the medication changes since the last visit."]);
        } else if (!d.medChanges.includes("No Changes") && !s(d.medChangeDetails)) {
          errs.push(["medChangeDetails", "Describe the medication changes."]);
        }
        if (!d.medAdherence)
          errs.push(["medAdherence", "Select how well the medication plan was followed."]);
        if (["Mostly", "No"].includes(d.medAdherence) && !s(d.medAdherenceNote)) {
          errs.push(["medAdherenceNote", "Tell us more about the missed medication."]);
        }
        if (!d.refills) errs.push(["refills", "Select a refill option."]);
        break;

      case 4: {
        const bpErrs: ErrorList = [];
        this.range(bpErrs, d.bpSys, "bp", "Systolic pressure", 40, 300, "mmHg", true);
        this.range(bpErrs, d.bpDia, "bp", "Diastolic pressure", 20, 200, "mmHg", true);
        const sysGiven = s(d.bpSys) !== "";
        const diaGiven = s(d.bpDia) !== "";

        if (bpErrs.length) errs.push(["bp", bpErrs.map((e) => e[1]).join(" ")]);
        else if (sysGiven !== diaGiven)
          errs.push(["bp", "Enter both systolic and diastolic pressure."]);
        else if (sysGiven && Number(d.bpSys) <= Number(d.bpDia)) {
          errs.push(["bp", "Systolic pressure must be higher than diastolic pressure."]);
        }

        this.range(errs, d.heartRate, "heartRate", "Heart rate", 20, 250, "bpm", true);
        if (d.tempUnit === "C") this.range(errs, d.temp, "temp", "Temperature", 27, 46, "\u00B0C");
        else this.range(errs, d.temp, "temp", "Temperature", 80, 115, "\u00B0F");
        this.range(errs, d.respRate, "respRate", "Respiratory rate", 4, 80, "per minute", true);
        this.range(errs, d.height, "height", "Height", 30, 250, "cm");
        this.range(errs, d.weight, "weight", "Weight", 1, 500, "kg");
        this.range(errs, d.spo2, "spo2", "Oxygen saturation", 50, 100, "%", true);

        this.checkPlanDate(errs, d);
        break;
      }

      case 5:
        if (!d.planInterval) errs.push(["planInterval", "Select a follow-up interval."]);
        if (d.planInterval !== "asneeded" && !d.planDate)
          errs.push(["planDate", "Enter the next visit date."]);
        this.checkPlanDate(errs, d);
        if (!d.nextVisitType) errs.push(["nextVisitType", "Select the next visit type."]);
        if (!s(d.nextReason)) errs.push(["nextReason", "Enter the reason for the next visit."]);
        break;
    }

    return errs;
  }

  private checkPlanDate(errs: ErrorList, d: FollowUpForm): void {
    if (!d.planDate) return;
    if (!this.parseISO(d.planDate)) errs.push(["planDate", "Enter a valid next visit date."]);
    else if (this.parseISO(d.visitDate) && d.planDate <= d.visitDate) {
      errs.push(["planDate", "Next visit date must be after the visit date."]);
    }
  }

  private range(
    errs: ErrorList,
    value: Num,
    key: string,
    label: string,
    min: number,
    max: number,
    unit: string,
    whole = false
  ): void {
    if (this.str(value).trim() === "") return;
    const n = Number(value);
    if (!this.isNum(value) || n < min || n > max || (whole && !Number.isInteger(n))) {
      errs.push([
        key,
        `${label} must be ${whole ? "a whole number " : ""}between ${min} and ${max} ${unit}.`,
      ]);
    }
  }

  private validateStep(step: number): boolean {
    const errs = this.validate(step, this.cleanData());
    if (errs.length) {
      this.showErrors(errs);
      return false;
    }
    this.clearErrors();
    return true;
  }

  private firstFailure(from: number, to: number): { step: number; errs: ErrorList } | null {
    const d = this.cleanData();
    for (let s = from; s <= to; s++) {
      const errs = this.validate(s, d);
      if (errs.length) return { step: s, errs };
    }
    return null;
  }

  private showErrors(errs: ErrorList): void {
    const map: Record<string, string> = {};
    errs.forEach(([key, msg]) => {
      if (!map[key]) map[key] = msg;
    });

    this.errors = map;
    this.alert = {
      show: true,
      title:
        errs.length === 1
          ? "Fix this before continuing:"
          : `Fix these ${errs.length} items before continuing:`,
      messages: errs.map((e) => e[1]),
    };

    this.focusIn(".rs-step-panel.active .fu-invalid");
  }

  private clearErrors(): void {
    this.errors = {};
    this.alert = { show: false, title: "", messages: [] };
  }

  private clearError(key: string): void {
    if (!this.errors[key]) return;
    const rest = { ...this.errors };
    delete rest[key];
    this.errors = rest;
    if (!Object.keys(rest).length) this.alert = { ...this.alert, show: false };
  }

  /* ---------------------------------------------------------
     Draft
     --------------------------------------------------------- */

  saveDraft(): void {
    if (this.submitted) return;

    const ok = this.storeDraft({
      v: 2,
      form: this.form,
      medications: this.medications,
      labs: this.labs,
      planTests: this.planTests,
      onFile: this.onFile,
      dateManual: this.dateManual,
      completed: this.completed,
      step: this.currentStep,
      savedAt: new Date().toISOString(),
    });

    if (!ok) {
      this.openMessage(
        "Draft not saved",
        "This browser blocked local storage, so the draft could not be saved. Your entries are still on the page."
      );
      return;
    }

    this.status = "Draft";
    this.openModal("draft");
  }

  private restoreDraft(): void {
    const draft = this.fetchDraft();
    if (!draft || draft["v"] !== 2 || typeof draft["form"] !== "object" || !draft["form"]) return;

    const saved = draft["form"] as Partial<FollowUpForm>;
    const form: FollowUpForm = { ...this.form, ...saved };
    form.symptoms = Array.isArray(saved.symptoms) ? saved.symptoms : [];
    form.medChanges = Array.isArray(saved.medChanges) ? saved.medChanges : [];
    form.lifestyle = Array.isArray(saved.lifestyle) ? saved.lifestyle : [];
    this.form = form;

    const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
    this.medications = arr<Medication>(draft["medications"]);
    this.labs = arr<LabTest>(draft["labs"]);
    this.planTests = arr<PlanTest>(draft["planTests"]);
    this.onFile = arr<string>(draft["onFile"]);
    this.dateManual = !!draft["dateManual"];
    this.completed = (draft["completed"] as Record<number, boolean>) ?? {};
    this.lastUnit = form.tempUnit || "F";
    this.status = "Draft";

    const step = Number(draft["step"]) || 1;
    this.currentStep = Math.min(Math.max(step, 1), this.totalSteps);
    if (this.currentStep === this.totalSteps) this.buildReview();
  }

  private storeDraft(payload: object): boolean {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  private fetchDraft(): Record<string, unknown> | null {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  private discardDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  }

  /* ---------------------------------------------------------
     Submit
     --------------------------------------------------------- */

  private submit(): void {
    const fail = this.firstFailure(1, 5);
    if (fail) {
      for (let s = 1; s < fail.step; s++) this.completed[s] = true;
      this.goToStep(fail.step);
      this.showErrors(fail.errs);
      return;
    }
    for (let s = 1; s <= 5; s++) this.completed[s] = true;

    const d = this.cleanData();
    if (!d.consentAccurate || !d.consentSubmit) {
      this.showErrors([["consent", "Accept both confirmations before submitting."]]);
      return;
    }
    this.clearErrors();

    this.busy = true;
    const submittedAt = new Date();

    try {
      const reference = this.storeSubmission({
        submittedAt: submittedAt.toISOString(),
        data: d,
        medications: this.medications,
        labs: this.labs,
        planTests: this.planTests,
        bmi: this.bmi,
      });

      this.discardDraft();
      this.submitted = true;
      this.reference = reference;
      this.status = "Submitted";
      this.currentStep = this.totalSteps;
      this.buildReview();

      this.receipt = {
        reference,
        patient: d.fullName,
        visitDate: d.visitDate ? this.fmtDate(d.visitDate) : "",
        nextVisit: d.planDate
          ? this.fmtDate(d.planDate)
          : d.planInterval === "asneeded"
            ? "As needed"
            : "",
        submittedOn: this.fmtDateTime(submittedAt),
        status: "Saved in this browser (not sent to a server)",
      };
      this.openModal("submit");
    } catch {
      this.openMessage(
        "Submission not saved",
        "This browser blocked local storage, so the follow-up visit could not be recorded. Nothing was submitted."
      );
    } finally {
      this.busy = false;
    }
  }

  /** TODO: replace with the API call. Must return the server-issued reference. */
  private storeSubmission(record: object): string {
    const n = Number(localStorage.getItem(COUNTER_KEY) || 0) + 1;
    const reference = `FUP-${String(n).padStart(6, "0")}`;

    const list = JSON.parse(localStorage.getItem(SUBMITTED_KEY) || "[]") as object[];
    list.push({ ...record, reference });
    localStorage.setItem(SUBMITTED_KEY, JSON.stringify(list));
    localStorage.setItem(COUNTER_KEY, String(n));
    return reference;
  }

  private resetForm(): void {
    this.form = blankForm();
    this.form.visitDate = this.today;
    this.medications = [];
    this.labs = [];
    this.planTests = [];
    this.completed = {};
    this.onFile = [];
    this.dateManual = false;
    this.lastUnit = "F";
    this.submitted = false;
    this.reference = null;
    this.status = "New";
    this.modal = null;
    this.receipt = { ...BLANK_RECEIPT };
    this.reviewCards = [];
    this.clearErrors();
    this.discardDraft();
    this.goToStep(1);
  }

  /* ---------------------------------------------------------
     Review cards (built once when step 6 opens)
     --------------------------------------------------------- */

  private buildReview(): void {
    const d = this.cleanData();
    const v = (x: unknown): string => this.str(x).trim() || DASH;
    const joined = (a: string[]): string => (a.length ? a.join(", ") : DASH);
    const dt = (s: string): string => (s ? this.fmtDate(s) : DASH);
    const withUnit = (x: Num, u: string): string =>
      this.str(x).trim() !== "" ? `${x} ${u}` : DASH;
    const pillCell = (status: string): ReviewCell => ({ text: status, pill: status });

    const visitRows: [string, string][] = [
      ["Visit date", dt(d.visitDate)],
      ["Visit type", v(d.visitType)],
      ["Accompanying person", v(d.companion)],
      ["Referring provider", v(d.referrer)],
      ["Insurance", v(d.insurance)],
      ["Hospital or ER visits", v(d.sinceEvents)],
      ["New diagnoses or events", v(d.newEvents)],
    ];
    if (this.summary.diagnosis) visitRows.unshift(["Diagnosis", this.summary.diagnosis]);
    if (this.summary.provider) visitRows.unshift(["Provider", this.summary.provider]);
    if (this.summary.lastVisit) visitRows.unshift(["Last visit", this.summary.lastVisit]);

    const medTable: ReviewBlock = this.medications.length
      ? {
          table: {
            head: ["Medication", "Dose", "Frequency", "Status"],
            rows: this.medications.map((m) => [
              { text: m.name, sub: m.note, strong: true },
              { text: m.dose },
              { text: m.frequency },
              pillCell(m.status),
            ]),
          },
        }
      : { rows: [["Medications", d.noMedications ? "Patient takes no medications" : DASH]] };

    const bp =
      this.str(d.bpSys).trim() !== "" && this.str(d.bpDia).trim() !== ""
        ? `${d.bpSys} / ${d.bpDia} mmHg`
        : DASH;
    const bmi = this.calcBmi(d.height, d.weight);
    const unit = d.tempUnit === "C" ? "\u00B0C" : "\u00B0F";

    const labBlock: ReviewBlock = this.labs.length
      ? {
          table: {
            head: ["Test / Imaging", "Date", "Result", "Status"],
            rows: this.labs.map((r) => [
              { text: r.name, sub: r.kind, strong: true },
              { text: this.fmtDate(r.date) },
              { text: r.result || DASH },
              pillCell(r.status),
            ]),
          },
        }
      : { rows: [["Tests and imaging", DASH]] };

    const planBlock: ReviewBlock = this.planTests.length
      ? {
          table: {
            head: ["Test / Assessment", "Reason", "Expected", "Status"],
            rows: this.planTests.map((r) => [
              { text: r.name, strong: true },
              { text: r.reason || DASH },
              { text: r.expected || DASH },
              pillCell(r.status),
            ]),
          },
        }
      : { rows: [["Tests and assessments", DASH]] };

    const interval = this.intervalOptions.find((o) => o.value === d.planInterval)?.label ?? "";

    this.reviewCards = [
      {
        icon: "patient-icon-blue.png",
        title: "Patient Information",
        edits: [{ step: 1, label: "Edit" }],
        blocks: [
          {
            rows: [
              ["Full name", v(d.fullName)],
              ["Date of birth", dt(d.dob)],
              ["MRN", v(d.mrn)],
              ["Phone", v(d.phone)],
              ["Preferred contact", v(d.contactMethod)],
            ],
          },
        ],
      },
      {
        icon: "calendar-blue.png",
        title: "Visit Details",
        edits: [{ step: 1, label: "Edit" }],
        blocks: [{ rows: visitRows }],
      },
      {
        icon: "ic-pulse-blue.png",
        title: "Progress and Symptoms",
        edits: [{ step: 2, label: "Edit" }],
        blocks: [
          {
            rows: [
              ["Current condition", v(d.condition)],
              ["Symptoms", joined(d.symptoms)],
              ["Other symptoms", v(d.symptomOther)],
              ["Improvement", v(d.improvement)],
              ["Treatment plan followed", v(d.treatAdherence)],
              ["Adherence details", v(d.treatAdherenceNote)],
              ["Notes", v(d.notesProgress)],
            ],
          },
        ],
      },
      {
        icon: "medical-icon-blue.png",
        title: "Current Medications and Changes",
        edits: [{ step: 3, label: "Edit" }],
        blocks: [
          medTable,
          {
            rows: [
              ["Changes", joined(d.medChanges)],
              ["Change details", v(d.medChangeDetails)],
              ["Adherence", v(d.medAdherence)],
              ["Adherence details", v(d.medAdherenceNote)],
              ["Refills", v(d.refills)],
              ["Refill notes", v(d.refillNotes)],
            ],
          },
        ],
      },
      {
        icon: "ic-heart-blue.png",
        title: "Vitals and Examination",
        edits: [{ step: 4, label: "Edit" }],
        blocks: [
          {
            rows: [
              ["Blood pressure", bp],
              ["Heart rate", withUnit(d.heartRate, "bpm")],
              ["Temperature", withUnit(d.temp, unit)],
              ["Respiratory rate", withUnit(d.respRate, "/min")],
              ["Height", withUnit(d.height, "cm")],
              ["Weight", withUnit(d.weight, "kg")],
              ["BMI", bmi === null ? DASH : `${bmi.toFixed(1)} kg/m\u00B2`],
              ["Oxygen saturation", withUnit(d.spo2, "%")],
              ["General appearance", v(d.examGeneral)],
              ["Cardiovascular", v(d.examCardio)],
              ["Respiratory", v(d.examResp)],
              ["Abdominal", v(d.examAbdo)],
              ["Other findings", v(d.examOther)],
            ],
          },
        ],
      },
      {
        icon: "ic-clipboard-blue.png",
        title: "Tests, Imaging, and Treatments",
        edits: [{ step: 4, label: "Edit" }],
        blocks: [labBlock, { rows: [["Treatments given", v(d.treatments)]] }],
      },
      {
        icon: "calendar-blue.png",
        title: "Follow-Up Plan",
        edits: [{ step: 5, label: "Edit" }],
        blocks: [
          {
            rows: [
              ["Follow-up interval", v(interval)],
              ["Next visit date", dt(d.planDate)],
              ["Preferred time", v(d.prefTime)],
              ["Visit type", v(d.nextVisitType)],
              ["Preferred physician", v(d.nextPhysician)],
              ["Reason", v(d.nextReason)],
              ["Clinical plan", v(d.planNotes)],
            ],
          },
          planBlock,
        ],
      },
      {
        icon: "ic-badge-blue.png",
        title: "Lifestyle Recommendations",
        edits: [{ step: 5, label: "Edit" }],
        blocks: [
          d.lifestyle.length ? { list: d.lifestyle } : { rows: [["Recommendations", DASH]] },
        ],
      },
      {
        icon: "ic-file-blue.png",
        title: "Additional Notes",
        span: true,
        edits: [
          { step: 2, label: "Progress", aria: "progress notes" },
          { step: 4, label: "Visit", aria: "visit notes" },
          { step: 5, label: "Next visit", aria: "next visit instructions" },
        ],
        blocks: [
          {
            rows: [
              ["Progress notes", v(d.notesProgress)],
              ["Visit notes", v(d.notesVitals)],
              ["Instructions for next visit", v(d.nextInstructions)],
            ],
          },
        ],
      },
    ];
  }

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */

  private str(value: unknown): string {
    return value === null || value === undefined ? "" : String(value);
  }

  private isNum(value: unknown): boolean {
    const t = this.str(value).trim();
    return t !== "" && Number.isFinite(Number(t));
  }

  private calcBmi(height: Num, weight: Num): number | null {
    if (!this.isNum(height) || !this.isNum(weight)) return null;
    const h = Number(height);
    const w = Number(weight);
    if (h < 30 || h > 250 || w < 1 || w > 500) return null;
    const m = h / 100;
    return Math.round((w / (m * m)) * 10) / 10;
  }

  private pad(n: number): string {
    return String(n).padStart(2, "0");
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
  }

  private parseISO(str: string): Date | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str || "")) return null;
    const [y, m, d] = str.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const ok = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
    return ok ? date : null;
  }

  fmtDate(str: string): string {
    const date = this.parseISO(str);
    if (!date) return str || "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  private fmtDateTime(date: Date): string {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /** Month math clamps to the last day (Jan 31 + 1 month = Feb 28/29, not Mar 3). */
  private addInterval(iso: string, code: string): string {
    const base = this.parseISO(iso);
    const step = INTERVAL_STEP[code];
    if (!base || !step) return "";

    const [months, days] = step;
    let result: Date;

    if (months) {
      result = new Date(base.getFullYear(), base.getMonth() + months, base.getDate());
      if (result.getDate() !== base.getDate()) {
        result = new Date(base.getFullYear(), base.getMonth() + months + 1, 0);
      }
    } else {
      result = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
    }

    return this.formatDate(result);
  }
}
