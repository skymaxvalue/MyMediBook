import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { PrescriptionRefillFacade } from './store/prescription-refill.facade';

import {
  PatientSearchCriteria,
  Medication,
  Patient,
  Physician
} from './model/prescription-refill.model';

interface PatientProfile {
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal: string;
  lastVisit: string;
  physicianId: string;
  diagnoses: string[];
  monitoring: string[];
}

@Component({
  selector: "app-prescription-refill",
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: "./prescription-refill.component.css",
  templateUrl: "./prescription-refill.component.html",
})
export class PrescriptionRefillComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('signatureCanvas')


  signatureCanvas!: ElementRef<HTMLCanvasElement>;

  private readonly facade = inject(PrescriptionRefillFacade);

  private readonly destroy$ = new Subject<void>();

  searchResults$ = this.facade.searchResults$;
  searching$ = this.facade.searching$;
  noResults$ = this.facade.noResults$;

  details$ = this.facade.details$;
  loadingDetails$ = this.facade.loadingDetails$;

  medications$ = this.facade.medications$;
  physicians$ = this.facade.physicians$;

  selectedPatientId: string | null = null;

  private ctx!: CanvasRenderingContext2D;
  private debounceTimer: any;
  private activeModal = '';
  private lastFocused: HTMLElement | null = null;
  private drawing = false;
  private hasInk = false;

  readonly PATIENTS_KEY = 'labServicePatients_v1';
  readonly DRAFTS_KEY = 'prescriptionRefillDrafts_v1';
  readonly REQUESTS_KEY = 'prescriptionRefillRequests_v1';
  readonly DRAFT_COUNTER_KEY = 'prescriptionRefillDraftCounter_v1';
  readonly REQUEST_COUNTER_KEY = 'prescriptionRefillRequestCounter_v1';

  readonly REQUEST_STATUS = 'Pending Review';

  states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE',
    'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS',
    'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
    'WI', 'WY', 'West Bengal', 'Other'
  ];

  pharmacies = {
    hhp: {
      name: 'Health Haven Pharmacy',
      phone: '(212) 555-0189',
      address: '123 Medical Center Drive, New York, NY 10001'
    },
    other: {
      name: 'Other pharmacy',
      phone: '',
      address: ''
    }
  };

  physicians: Physician[] = [
    {
      id: 'dr-chen',
      name: 'Dr. Chen',
      department: 'Cardiology',
      phone: '(650) 123-4567'
    },
    {
      id: 'dr-mehta',
      name: 'Dr. Mehta',
      department: 'Internal Medicine',
      phone: ''
    },
    {
      id: 'dr-roy',
      name: 'Dr. Roy',
      department: 'Endocrinology',
      phone: ''
    }
  ];


  patients: Patient[] = [];

  filteredPatients: Patient[] = [];
  filteredPhysicians: Physician[] = [];

  patient: Patient | null = null;
  physician: Physician | null = null;

  selectedMedicationIds = new Set<string>();

  // Patient search
  search = {
    lastName: '',
    dob: '',
    mobile: ''
  };

  showSearchResults = false;

  // Patient information
  patientForm: any = {
    firstName: '',
    lastName: '',
    dob: '',
    age: '',
    gender: '',
    mrn: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: ''
  };

  profile: PatientProfile | null = null;

  // Pharmacy
  usePreferred = true;
  pharmacyKey: 'hhp' | 'other' = 'hhp';

  pharmacyForm = {
    phone: '',
    address: ''
  };

  // Refill reason
  refillReason = 'Refill remaining medication';
  notes = '';

  // Physician
  physicianSearch = '';

  // Signature
  signature = '';
  signatureModalError = false;

  // Date
  signDate = '';

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

  draftId = '';
  requestId = '';

  successData = {
    patient: '',
    medications: '',
    pharmacy: '',
    status: ''
  };


  activeMedications: Medication[] = [];

  get medications(): Medication[] {
    return this.activeMedications;
  }

  get selectedMedications(): Medication[] {
    return this.activeMedications.filter((m: Medication) =>
      this.selectedMedicationIds.has(m.id)
    );
  }

  get selectedCount(): number {
    return this.selectedMedicationIds.size;
  }

  get allSelected(): boolean {
    return this.activeMedications.length > 0 &&
      this.selectedCount === this.activeMedications.length;
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.facade.init();

    this.applyPharmacy();
    this.signDate = this.todayIso();

    // API search response
    this.searchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe((patients: Patient[]) => {
        this.filteredPatients = patients ?? [];
        this.showSearchResults = true;
      });

    this.medications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((medications: Medication[]) => {
        this.activeMedications = medications ?? [];
      });
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------- PATIENT DATA ----------------

  seedPatients(): Patient[] {
    return [
      {
        id: 'p1',
        mrn: 'MRN-000001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        dob: '1990-05-12',
        gender: 'Male',
        mobile: '9998887770',
        address1: '123 Main Street',
        address2: 'Apt 4A',
        city: 'Los Angeles',
        state: 'CA',
        postal: '90210',
        email: 'rajesh.sharma@example.com'
      },
      {
        id: 'p2',
        mrn: 'MRN-000002',
        firstName: 'Harshit',
        lastName: 'Bhardwaj',
        dob: '1997-02-10',
        gender: 'Male',
        mobile: '9123456780',
        address1: '456 Elm Street',
        address2: 'Apt 2B',
        city: 'New York',
        state: 'NY',
        postal: '10001',
        email: ''

      },
      {
        id: 'p3',
        mrn: 'MRN-000003',
        firstName: 'Kavya',
        lastName: 'Bhardwaj',
        dob: '2000-07-21',
        gender: 'Female',
        mobile: '9123456781',
        address1: '789 Oak Avenue',
        address2: 'Suite 5C',
        city: 'Los Angeles',
        state: 'CA',
        postal: '90210',
        email: ''
      },

    ];
  }

  loadPatients(): void {
    const raw = localStorage.getItem(this.PATIENTS_KEY);

    if (!raw) {
      this.patients = this.seedPatients();
      localStorage.setItem(
        this.PATIENTS_KEY,
        JSON.stringify(this.patients)
      );
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      this.patients = Array.isArray(parsed)
        ? parsed
        : this.seedPatients();
    } catch {
      this.patients = this.seedPatients();
    }
  }

  buildProfile(patient: Patient): PatientProfile {
    return {
      email: `${patient.firstName}.${patient.lastName}`
        .toLowerCase() + '@example.com',
      address1: '123 Medical Center Drive',
      address2: '',
      city: 'New York',
      state: 'NY',
      postal: '10001',
      lastVisit: '2026-05-14',
      physicianId: 'dr-chen',
      diagnoses: ['Hypertension', 'Hyperlipidemia'],
      monitoring: [
        'BP: 120/80 mmHg (May 14, 2026)',
        'Lipid Panel: Completed (May 12, 2026)'
      ]
    };
  }

  // ---------------- DATE HELPERS ----------------

  todayIso(): string {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  formatDate(value: string): string {
    if (!value) return '--';

    const date = new Date(value + 'T00:00:00');

    if (isNaN(date.getTime())) return '--';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatLongDate(value: string): string {
    if (!value) return '--';

    const date = new Date(value + 'T00:00:00');

    if (isNaN(date.getTime())) return '--';

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatAge(value: string): string {
    if (!value) return '';

    const dob = new Date(value + 'T00:00:00');
    const today = new Date();

    if (isNaN(dob.getTime()) || dob > today) return '';

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate()) months--;

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years <= 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    }

    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  // ---------------- PATIENT SEARCH ----------------

  // ---------------- PATIENT SEARCH ----------------

  onPatientSearch(): void {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.searchPatients();
    }, 300);
  }

  searchPatients(): void {
    const lastName = this.search.lastName.trim();
    const dob = this.search.dob;
    const mobile = this.search.mobile.trim();

    if (!lastName && !dob && !mobile) {
      this.facade.clearSearch();
      this.closeResults();
      return;
    }

    const criteria: PatientSearchCriteria = {
      lastName,
      dob,
      mobile
    };

    console.log('Search criteria:', criteria);
    this.showSearchResults = true;

    // API call 
    this.facade.searchPatients(criteria);
  }

  selectPatient(patient: Patient): void {

    this.patient = patient;
    this.selectedPatientId = patient.id;

    this.profile = this.buildProfile(patient);

    this.selectedMedicationIds.clear();

    // Clear previous patient medicines/details
    this.facade.selectPatient(patient.id);

    this.patientForm = {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dob: patient.dob,
      age: this.formatAge(patient.dob),
      gender: patient.gender,
      mrn: patient.mrn,
      phone: patient.mobile,
      email: this.profile.email,
      address1: this.profile.address1,
      address2: this.profile.address2,
      city: this.profile.city,
      state: this.profile.state,
      postal: this.profile.postal
    };

    this.search.lastName = patient.lastName;
    this.search.dob = patient.dob;
    this.search.mobile = patient.mobile;

    this.physician = this.physicians.find(
      p => p.id === this.profile?.physicianId
    ) || null;

    this.usePreferred = true;
    this.pharmacyKey = 'hhp';

    this.applyPharmacy();

    this.closeResults();
    this.clearErrors();
  }
  closeResults(): void {
    this.showSearchResults = false;
    this.filteredPatients = [];
  }

  clearSearch(): void {

    this.search = {
      lastName: '',
      dob: '',
      mobile: ''
    };

    this.patient = null;
    this.selectedPatientId = null;
    this.profile = null;
    this.physician = null;

    this.activeMedications = [];
    this.selectedMedicationIds.clear();

    this.facade.reset();

    this.patientForm = {
      firstName: '',
      lastName: '',
      dob: '',
      age: '',
      gender: '',
      mrn: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postal: ''
    };

    this.usePreferred = true;
    this.pharmacyKey = 'hhp';

    this.applyPharmacy();
    this.closeResults();
    this.clearErrors();
  }

  // ---------------- MEDICATIONS ----------------

  toggleMedication(id: string, checked: boolean): void {
    if (checked) {
      this.selectedMedicationIds.add(id);
    } else {
      this.selectedMedicationIds.delete(id);
    }

    delete this.errors['medications'];
  }

  toggleAllMedications(checked: boolean): void {
    this.selectedMedicationIds.clear();

    if (checked) {
      this.medications.forEach((m: Medication) => {
        this.selectedMedicationIds.add(m.id);
      });
    }

    delete this.errors['medications'];
  }

  // ---------------- PHARMACY ----------------

  applyPharmacy(): void {
    if (this.usePreferred) {
      this.pharmacyKey = 'hhp';
    }

    const pharmacy = this.pharmacies[this.pharmacyKey];

    if (this.pharmacyKey !== 'other') {
      this.pharmacyForm.phone = pharmacy.phone;
      this.pharmacyForm.address = pharmacy.address;
    } else if (this.usePreferred) {
      this.pharmacyForm.phone = '';
      this.pharmacyForm.address = '';
    }
  }

  onPreferredChange(): void {
    this.applyPharmacy();
  }

  onPharmacyChange(): void {
    this.applyPharmacy();
  }

  // ---------------- PHYSICIAN ----------------

  openPhysicianModal(): void {
    this.physicianSearch = '';
    this.filterPhysicians();
    this.openModal('physician');
  }

  filterPhysicians(): void {
    const query = this.physicianSearch.trim().toLowerCase();

    this.filteredPhysicians = this.physicians.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.department.toLowerCase().includes(query)
    );
  }

  selectPhysician(physician: Physician): void {
    this.physician = physician;
    this.closeModal('physician');
    delete this.errors['physician'];
  }

  // ---------------- REFILL REASON ----------------

  onReasonChange(): void {
    delete this.errors['reason'];
    delete this.errors['notes'];
  }

  // ---------------- MODALS ----------------

  openModal(name: string): void {
    this.lastFocused = document.activeElement as HTMLElement;
    this.activeModal = name;

    const modals: Record<string, string> = {
      history: 'showHistoryModal',
      physician: 'showPhysicianModal',
      signature: 'showSignatureModal',
      draft: 'showDraftModal',
      success: 'showSuccessModal',
      cancel: 'showCancelModal'
    };

    const property = modals[name] as keyof this;

    if (property) {
      (this[property] as boolean) = true;
    }
  }

  closeModal(name: string): void {
    const modals: Record<string, string> = {
      history: 'showHistoryModal',
      physician: 'showPhysicianModal',
      signature: 'showSignatureModal',
      draft: 'showDraftModal',
      success: 'showSuccessModal',
      cancel: 'showCancelModal'
    };

    const property = modals[name] as keyof this;

    if (property) {
      (this[property] as boolean) = false;
    }

    this.activeModal = '';

    if (name === 'success') {
      this.clearAll();
    }

    if (this.lastFocused) {
      this.lastFocused.focus();
      this.lastFocused = null;
    }
  }

  // ---------------- SIGNATURE ----------------

  openSignature(): void {
    this.openModal('signature');

    setTimeout(() => this.setupCanvas());
    this.signatureModalError = false;
  }

  setupCanvas(): void {
    if (!this.signatureCanvas) return;

    const canvas = this.signatureCanvas.nativeElement;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));

    this.ctx = canvas.getContext('2d')!;

    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.ctx.lineWidth = 2.2;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = '#183153';

    this.hasInk = false;
  }

  private canvasPoint(event: PointerEvent) {
    const rect = this.signatureCanvas.nativeElement.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
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

    this.signatureCanvas.nativeElement.setPointerCapture(
      event.pointerId
    );

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

    this.signature = this.signatureCanvas.nativeElement
      .toDataURL('image/png');

    this.closeModal('signature');
    delete this.errors['signature'];
  }

  clearSignature(): void {
    this.signature = '';
  }

  // ---------------- VALIDATION ----------------

  clearErrors(): void {
    this.errors = {};
  }

  validate(): boolean {
    this.clearErrors();

    if (!this.patient) {
      this.errors['patient'] =
        'Please search for and select a patient profile.';
    }

    const phone = this.patientForm.phone;
    const phoneDigits = phone.replace(/\D/g, '');

    if (!phone.trim()) {
      this.errors['phone'] = 'Phone number is required.';
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      this.errors['phone'] = 'Enter a valid phone number.';
    }

    const email = this.patientForm.email;

    if (email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      this.errors['email'] = 'Enter a valid email address.';
    }

    if (!this.patientForm.address1.trim()) {
      this.errors['address1'] = 'Address line 1 is required.';
    }

    if (!this.patientForm.city.trim()) {
      this.errors['city'] = 'City is required.';
    }

    const postal = this.patientForm.postal.trim();

    if (postal && !/^[A-Za-z0-9\- ]{3,10}$/.test(postal)) {
      this.errors['postal'] = 'Enter a valid postal / zip code.';
    }

    const selected = this.selectedMedications;

    if (!selected.length) {
      this.errors['medications'] =
        'Select at least one medication to request a refill.';
    }

    if (this.pharmacyKey === 'other' &&
      !this.pharmacyForm.phone.trim() &&
      !this.pharmacyForm.address.trim()) {
      this.errors['pharmacy'] =
        'Enter the pharmacy phone number or address.';
    }

    if (!this.refillReason) {
      this.errors['reason'] = 'Select a reason for the refill.';
    } else if (
      this.refillReason === 'Refill remaining medication' &&
      selected.some(m => m.refillsRemaining === 0)
    ) {
      this.errors['reason'] =
        'A selected medication has no refills remaining. Choose "No refills remaining" instead.';
    }

    if (this.refillReason === 'Other' && !this.notes.trim()) {
      this.errors['notes'] =
        'Please describe the reason in additional information.';
    }

    if (!this.physician) {
      this.errors['physician'] =
        'Prescribing physician is required.';
    }

    if (!this.signature) {
      this.errors['signature'] =
        'Physician signature is required.';
    }

    if (!this.signDate) {
      this.errors['signDate'] = 'Date signed is required.';
    } else if (this.signDate > this.todayIso()) {
      this.errors['signDate'] =
        'Date signed cannot be in the future.';
    }

    return Object.keys(this.errors).length === 0;
  }

  // ---------------- DATA COLLECTION ----------------

  pharmacyData() {
    return {
      name: this.pharmacies[this.pharmacyKey].name,
      phone: this.pharmacyForm.phone.trim(),
      address: this.pharmacyForm.address.trim(),
      preferred: this.usePreferred
    };
  }

  collectData(): any {
    return {
      patientId: this.patient?.id || '',
      patientName:
        `${this.patientForm.firstName} ${this.patientForm.lastName}`,
      mrn: this.patientForm.mrn,

      contact: {
        phone: this.patientForm.phone.trim(),
        email: this.patientForm.email.trim(),
        address1: this.patientForm.address1.trim(),
        address2: this.patientForm.address2.trim(),
        city: this.patientForm.city.trim(),
        state: this.patientForm.state,
        postal: this.patientForm.postal.trim()
      },

      medications: this.selectedMedications.map(m => ({
        id: m.id,
        name: m.name,
        strength: m.strength,
        refills: m.refillsRemaining
      })),

      pharmacy: this.pharmacyData(),
      reason: this.refillReason,
      notes: this.notes.trim(),

      physician: {
        name: this.physician?.name || '',
        department: this.physician?.department || '',
        phone: this.physician?.phone || ''
      },

      signature: this.signature,
      signedOn: this.signDate
    };
  }

  // ---------------- LOCAL STORAGE ----------------

  nextId(prefix: string, counterKey: string): string {
    const next =
      parseInt(localStorage.getItem(counterKey) || '0', 10) + 1;

    localStorage.setItem(counterKey, String(next));

    return `${prefix}-${String(next).padStart(6, '0')}`;
  }

  appendToList(key: string, entry: any): void {
    let list: any[] = [];

    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
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
      this.errors['patient'] =
        'Please search for and select a patient profile.';
      return;
    }

    this.draftId = this.nextId(
      'DFT',
      this.DRAFT_COUNTER_KEY
    );

    const draft = {
      ...this.collectData(),
      draftId: this.draftId,
      status: 'Draft',
      savedAt: new Date().toISOString()
    };

    this.appendToList(this.DRAFTS_KEY, draft);

    this.openModal('draft');
  }

  // ---------------- SUBMIT REQUEST ----------------

  submitRequest(): void {
    // event.preventDefault();

    if (this.submitting) return;

    if (!this.validate()) return;

    this.submitting = true;

    this.requestId = this.nextId(
      'RFL',
      this.REQUEST_COUNTER_KEY
    );

    const request = {
      ...this.collectData(),
      requestId: this.requestId,
      status: this.REQUEST_STATUS,
      submittedAt: new Date().toISOString()
    };

    this.appendToList(this.REQUESTS_KEY, request);

    this.successData = {
      patient: request.patientName,
      medications: request.medications
        .map((m: any) => m.name).join(', '),
      pharmacy: request.pharmacy.name,
      status: this.REQUEST_STATUS
    };

    this.openModal('success');
  }

  // ---------------- RESET ----------------

  clearAll(): void {
    this.clearSearch();

    this.refillReason = 'Refill remaining medication';
    this.notes = '';

    this.clearSignature();

    this.signDate = this.todayIso();

    this.clearErrors();

    this.submitting = false;
  }

  cancelRequest(): void {
    this.openModal('cancel');
  }

  discardRequest(): void {
    this.closeModal('cancel');
    this.clearAll();

    this.router.navigate(['/front-office/dashboard']);
  }

  // ---------------- HISTORY ----------------

  openHistory(): void {
    this.openModal('history');
  }

  // ---------------- PHYSICIAN PHONE ----------------

  get physicianPhone(): string {
    return this.physician?.phone || '';
  }

  set physicianPhone(value: string) {
    if (this.physician) {
      this.physician.phone = value;
    }
  }
}
