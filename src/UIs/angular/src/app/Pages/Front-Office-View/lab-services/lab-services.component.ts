import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  phone: string;
  insurance: string;
  memberId: string;
}

interface LabDraft {
  draftId: string;
  status: string;
  savedAt: string;
  patientId: string;
  patientName: string;
  mrn: string;
  specimen: string;
  tests: string[];
  priority: string;
  providerName: string;
  npi: string;
  collectionDateTime: string;
  collectedBy: string;
  clinicalNotes: string;
}

interface LabRequest {
  requestId: string;
  status: string;
  submittedAt: string;
  patientId: string;
  patientName: string;
  mrn: string;
  specimen: string;
  tests: string[];
  priority: string;
  providerName: string;
  npi: string;
  collectionDateTime: string;
  collectedBy: string;
  department: string;
  contactPhone: string;
  resultDelivery: string;
  clinicalNotes: string;
}

@Component({
  selector: 'app-lab-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lab-services.component.html',
  styleUrls: ['./lab-services.component.css']
})
export class LabServiceComponent implements OnInit {

  /* =========================
     STORAGE KEYS
  ========================== */

  private readonly PATIENTS_KEY = 'labServicePatients_v1';
  private readonly DRAFTS_KEY = 'labServiceDrafts_v1';
  private readonly REQUESTS_KEY = 'labServiceRequests_v1';


  /* =========================
     PATIENT DATA
  ========================== */

  allPatients: Patient[] = [];

  selectedPatientId: string | null = null;
  selectedPatientRecord: Patient | null = null;

  patientLastNameSearch = '';
  patientDobSearch = '';
  patientMobileSearch = '';

  patientSearchResults: Patient[] = [];
  showPatientResults = false;


  /* =========================
     PATIENT INFORMATION
  ========================== */

  patientFirstName = '';
  patientLastName = '';
  patientDob = '';
  patientGender = '';
  patientMrn = '';
  patientInsurance = '';
  patientMemberId = '';


  /* =========================
     SPECIMEN
  ========================== */

  specimenTypes = [
    {
      value: 'whole-blood',
      label: 'Whole blood'
    },
    {
      value: 'serum',
      label: 'Serum'
    },
    {
      value: 'plasma',
      label: 'Plasma'
    },
    {
      value: 'urine',
      label: 'Urine'
    },
    {
      value: 'sputum',
      label: 'Sputum'
    },
    {
      value: 'csf',
      label: 'CSF'
    },
    {
      value: 'other',
      label: 'Other'
    }
  ];

  selectedSpecimen = '';


  /* =========================
     SPECIMEN DETAILS
  ========================== */

  collectionDateTime = '';
  collectedBy = '';


  /* =========================
     TESTS
  ========================== */

  tests = [
    {
      value: 'cbc',
      name: 'CBC w/ diff',
      code: '85025',
      selected: false
    },
    {
      value: 'cmp',
      name: 'CMP',
      code: '80053',
      selected: false
    },
    {
      value: 'lipid',
      name: 'Lipid panel',
      code: '80061',
      selected: false
    },
    {
      value: 'hba1c',
      name: 'HbA1c',
      code: '83036',
      selected: false
    },
    {
      value: 'tsh',
      name: 'TSH',
      code: '84443',
      selected: false
    },
    {
      value: 'urinalysis',
      name: 'Urinalysis',
      code: '81003',
      selected: false
    },
    {
      value: 'pt-inr',
      name: 'PT / INR',
      code: '85610',
      selected: false
    },
    {
      value: 'culture',
      name: 'Culture & sens.',
      code: '87077',
      selected: false
    }
  ];

  customTests = '';


  /* =========================
     PRIORITY
  ========================== */

  priorities = [
    {
      value: 'routine',
      label: 'Routine',
      duration: '24–48 hrs',
      icon: 'assets/images/front-office/images/priority-routine-blue.png'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      duration: '4–8 hrs',
      icon: 'assets/images/front-office/images/priority-urgent-red.png'
    },
    {
      value: 'stat',
      label: 'STAT',
      duration: '< 1 hr',
      icon: 'assets/images/front-office/images/priority-stat-amber.png'
    }
  ];

  selectedPriority = '';


  /* =========================
     ORDERED BY
  ========================== */

  providerName = '';
  providerLocation = '';
  department = '';
  contactPhone = '';
  resultDelivery = 'Print / Pickup';
  clinicalNotes = '';


  /* =========================
     MODALS
  ========================== */

  showSelectPatientModal = false;
  showDraftModal = false;
  showReviewModal = false;
  showSuccessModal = false;

  draftId = '';
  requestId = '';


  /* =========================
     MODAL PATIENT SEARCH
  ========================== */

  modalPatientSearch = '';
  modalPatientDob = '';

  modalPatientResults: Patient[] = [];
  modalSelectedPatient: Patient | null = null;


  /* =========================
     INIT
  ========================== */

  ngOnInit(): void {

    this.allPatients = this.loadPatients();

    this.setTodayMaxDate();

  }


  /* =========================
     SEED PATIENTS
  ========================== */

  private seedPatients(): Patient[] {

    return [

      {
        id: 'p1',
        mrn: 'MRN-000001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        dob: '1990-05-12',
        gender: 'Male',
        phone: '9998887770',
        insurance: 'Star Health',
        memberId: 'SH-778215'
      },

      {
        id: 'p2',
        mrn: 'MRN-000002',
        firstName: 'Harshit',
        lastName: 'Bhardwaj',
        dob: '1997-02-10',
        gender: 'Male',
        phone: '9123456780',
        insurance: '',
        memberId: ''
      },

      {
        id: 'p3',
        mrn: 'MRN-000003',
        firstName: 'Kavya',
        lastName: 'Bhardwaj',
        dob: '2000-07-21',
        gender: 'Female',
        phone: '9123456781',
        insurance: '',
        memberId: ''
      },

      {
        id: 'p4',
        mrn: 'MRN-000004',
        firstName: 'Meera',
        lastName: 'Sharma',
        dob: '2016-11-04',
        gender: 'Female',
        phone: '9876543210',
        insurance: '',
        memberId: ''
      },

      {
        id: 'p5',
        mrn: 'MRN-000005',
        firstName: 'Kabir',
        lastName: 'Sharma',
        dob: '2012-01-19',
        gender: 'Male',
        phone: '9876543210',
        insurance: '',
        memberId: ''
      },

      {
        id: 'p6',
        mrn: 'MRN-000006',
        firstName: 'Priya',
        lastName: 'Sharma',
        dob: '1985-03-22',
        gender: 'Female',
        phone: '9876543210',
        insurance: 'Care Plus',
        memberId: 'CP-552310'
      }

    ];

  }


  /* =========================
     LOAD PATIENTS
  ========================== */

  private loadPatients(): Patient[] {

    const raw = localStorage.getItem(this.PATIENTS_KEY);

    if (!raw) {

      const seeded = this.seedPatients();

      localStorage.setItem(
        this.PATIENTS_KEY,
        JSON.stringify(seeded)
      );

      return seeded;
    }

    try {

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : this.seedPatients();

    } catch {

      return this.seedPatients();

    }

  }


  /* =========================
     TODAY
  ========================== */

  private setTodayMaxDate(): void {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    this.patientDobMax = `${year}-${month}-${day}`;

  }

  patientDobMax = '';


  /* =========================
     PHONE NORMALIZE
  ========================== */

  private normalizePhone(value: string): string {

    return String(value || '')
      .replace(/\D/g, '');

  }


  /* =========================
     PATIENT SEARCH
  ========================== */

  searchPatients(): void {

    const ln =
      this.patientLastNameSearch
        .trim()
        .toLowerCase();

    const dob =
      this.patientDobSearch;

    const phone =
      this.normalizePhone(
        this.patientMobileSearch
      );


    if (!ln && !dob && !phone) {

      this.patientSearchResults = [];

      this.showPatientResults = false;

      return;

    }


    this.patientSearchResults =
      this.allPatients.filter(patient => {

        const lastDobMatch =
          ln !== '' &&
          patient.lastName
            .toLowerCase()
            .includes(ln) &&
          (
            dob === '' ||
            patient.dob === dob
          );


        const phoneMatch =
          phone !== '' &&
          this.normalizePhone(
            patient.phone
          ).includes(phone);


        return lastDobMatch || phoneMatch;

      });


    this.showPatientResults = true;

  }


  /* =========================
     SELECT PATIENT
  ========================== */

  selectPatient(patient: Patient): void {

    this.selectedPatientId = patient.id;

    this.selectedPatientRecord = patient;


    this.patientLastNameSearch =
      patient.lastName;

    this.patientDobSearch =
      patient.dob;

    this.patientMobileSearch =
      patient.phone;


    this.patientFirstName =
      patient.firstName;

    this.patientLastName =
      patient.lastName;

    this.patientDob =
      patient.dob;

    this.patientGender =
      patient.gender;

    this.patientMrn =
      patient.mrn;

    this.patientInsurance =
      patient.insurance || '';

    this.patientMemberId =
      patient.memberId || '';


    this.showPatientResults = false;

  }


  /* =========================
     CLEAR PATIENT
  ========================== */

  clearPatient(): void {

    this.patientLastNameSearch = '';
    this.patientDobSearch = '';
    this.patientMobileSearch = '';

    this.selectedPatientId = null;
    this.selectedPatientRecord = null;

    this.patientFirstName = '';
    this.patientLastName = '';
    this.patientDob = '';
    this.patientGender = '';
    this.patientMrn = '';
    this.patientInsurance = '';
    this.patientMemberId = '';

    this.patientSearchResults = [];

    this.showPatientResults = false;

  }



  selectSpecimen(value: string): void {

    this.selectedSpecimen = value;

  }


  /* =========================
     TEST
  ========================== */

  toggleTest(test: any): void {

    test.selected = !test.selected;

  }


  getSelectedTests(): string[] {

    return this.tests
      .filter(test => test.selected)
      .map(test => test.name);

  }


  /* =========================
     PRIORITY
  ========================== */

  selectPriority(value: string): void {

    this.selectedPriority = value;

  }


  getSelectedPriorityLabel(): string {

    const priority =
      this.priorities.find(
        p => p.value === this.selectedPriority
      );

    return priority
      ? priority.label
      : '';

  }


  getSelectedSpecimenLabel(): string {

    const specimen =
      this.specimenTypes.find(
        s => s.value === this.selectedSpecimen
      );

    return specimen
      ? specimen.label
      : '';

  }


  /* =========================
     MODAL PATIENT SEARCH
  ========================== */

  openSelectPatientModal(): void {

    this.showSelectPatientModal = true;

    this.modalPatientSearch = '';

    this.modalPatientDob = '';

    this.modalPatientResults =
      [...this.allPatients];

    this.modalSelectedPatient = null;

  }


  closeSelectPatientModal(): void {

    this.showSelectPatientModal = false;

  }


  searchModalPatients(): void {

    const search =
      this.modalPatientSearch
        .trim()
        .toLowerCase();

    const dob =
      this.modalPatientDob;


    this.modalPatientResults =
      this.allPatients.filter(patient => {

        const fullName =
          `${patient.firstName} ${patient.lastName}`
            .toLowerCase();

        const nameMatch =
          !search ||
          fullName.includes(search);

        const dobMatch =
          !dob ||
          patient.dob === dob;

        return nameMatch && dobMatch;

      });

  }


  selectModalPatient(patient: Patient): void {

    this.modalSelectedPatient = patient;

  }


  confirmModalPatient(): void {

    if (!this.modalSelectedPatient) {
      return;
    }

    this.selectPatient(
      this.modalSelectedPatient
    );

    this.closeSelectPatientModal();

  }


  /* =========================
     VALIDATE PATIENT
  ========================== */

  private hasPatient(): boolean {

    return !!this.selectedPatientId;

  }


  /* =========================
     DRAFT
  ========================== */

  saveDraft(): void {

    if (!this.hasPatient()) {

      alert('Please select a patient.');

      return;

    }


    this.draftId =
      this.generateSequentialId(
        'DFT',
        'labServiceDraftCounter_v1'
      );


    const draft: LabDraft = {

      draftId: this.draftId,

      status: 'Draft',

      savedAt:
        new Date().toISOString(),

      patientId:
        this.selectedPatientId!,

      patientName:
        `${this.patientFirstName} ${this.patientLastName}`,

      mrn:
        this.patientMrn,

      specimen:
        this.getSelectedSpecimenLabel(),

      tests:
        this.getSelectedTests(),

      priority:
        this.getSelectedPriorityLabel(),

      providerName:
        this.providerName,

      npi:
        this.providerLocation,

      collectionDateTime:
        this.collectionDateTime,

      collectedBy:
        this.collectedBy,

      clinicalNotes:
        this.clinicalNotes

    };


    this.appendToStoredList(
      this.DRAFTS_KEY,
      draft
    );


    this.showDraftModal = true;

  }


  /* =========================
     SUBMIT
  ========================== */

  submitRequest(): void {

    if (!this.hasPatient()) {

      alert('Please select a patient.');

      return;

    }


    if (!this.selectedSpecimen) {

      alert('Please select specimen type.');

      return;

    }


    if (!this.collectionDateTime) {

      alert('Please select collection date and time.');

      return;

    }


    if (!this.collectedBy) {

      alert('Please enter collected by.');

      return;

    }


    if (!this.providerName) {

      alert('Please enter physician name.');

      return;

    }


    if (!this.providerLocation) {

      alert('Please enter physician facility location.');

      return;

    }


    this.showReviewModal = true;

  }


  /* =========================
     CONFIRM REQUEST
  ========================== */

  confirmRequest(): void {

    this.requestId =
      this.generateSequentialId(
        'LAB',
        'labServiceRequestCounter_v1'
      );


    const request: LabRequest = {

      requestId:
        this.requestId,

      status:
        'Pending Collection',

      submittedAt:
        new Date().toISOString(),

      patientId:
        this.selectedPatientId!,

      patientName:
        `${this.patientFirstName} ${this.patientLastName}`,

      mrn:
        this.patientMrn,

      specimen:
        this.getSelectedSpecimenLabel(),

      tests:
        this.getSelectedTests(),

      priority:
        this.getSelectedPriorityLabel(),

      providerName:
        this.providerName,

      npi:
        this.providerLocation,

      collectionDateTime:
        this.collectionDateTime,

      collectedBy:
        this.collectedBy,

      department:
        this.department,

      contactPhone:
        this.contactPhone,

      resultDelivery:
        this.resultDelivery,

      clinicalNotes:
        this.clinicalNotes

    };


    this.appendToStoredList(
      this.REQUESTS_KEY,
      request
    );


    this.showReviewModal = false;

    this.showSuccessModal = true;

  }


  /* =========================
     RESET FORM
  ========================== */

  resetForm(): void {

    this.clearPatient();

    this.selectedSpecimen = '';

    this.collectionDateTime = '';

    this.collectedBy = '';

    this.customTests = '';

    this.tests.forEach(
      test => test.selected = false
    );

    this.selectedPriority = '';

    this.providerName = '';

    this.providerLocation = '';

    this.department = '';

    this.contactPhone = '';

    this.resultDelivery =
      'Print / Pickup';

    this.clinicalNotes = '';

  }


  /* =========================
     ID GENERATOR
  ========================== */

  private generateSequentialId(
    prefix: string,
    counterKey: string
  ): string {

    const next =
      parseInt(
        localStorage.getItem(counterKey) || '0',
        10
      ) + 1;


    localStorage.setItem(
      counterKey,
      String(next)
    );


    return `${prefix}-${String(next).padStart(6, '0')}`;

  }


  /* =========================
     LOCAL STORAGE
  ========================== */

  private appendToStoredList(
    storageKey: string,
    entry: any
  ): void {

    const raw =
      localStorage.getItem(storageKey);

    let list: any[] = [];


    try {

      const parsed =
        raw ? JSON.parse(raw) : [];

      list =
        Array.isArray(parsed)
          ? parsed
          : [];

    } catch {

      list = [];

    }


    list.push(entry);

    localStorage.setItem(
      storageKey,
      JSON.stringify(list)
    );

  }


  /* =========================
     CLOSE MODALS
  ========================== */

  closeDraftModal(): void {

    this.showDraftModal = false;

  }


  closeReviewModal(): void {

    this.showReviewModal = false;

  }


  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.resetForm();

  }

}