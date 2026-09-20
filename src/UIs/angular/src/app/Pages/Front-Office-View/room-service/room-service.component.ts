import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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

interface RoomServiceDraft {
  patient: Patient | null;

  admissionDate: string;
  expectedDischarge: string;
  patientContact: string;
  emergencyName: string;
  emergencyPhone: string;
  physician: string;

  roomType: string;
  amenities: string[];

  cleaningTime: string;
  cleaningFrequency: string;
  housekeepingNotes: string;

  dietType: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  foodNotes: string;
}

@Component({
  selector: 'app-room-service',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './room-service.component.html',
  styleUrl: './room-service.component.css'
})
export class RoomServiceComponent implements OnInit {

  currentStep = 1;

  readonly totalSteps = 5;

  selectedPatient: Patient | null = null;

  showPatientResults = false;
  showDraftModal = false;

  patientSearchForm!: FormGroup;
  roomServiceForm!: FormGroup;

  patients: Patient[] = [];

  filteredPatients: Patient[] = [];

  amenities = [
    { label: 'Wi-Fi access', value: 'Wi-Fi' },
    { label: 'Television', value: 'TV' },
    { label: 'Recliner / chair', value: 'Recliner' },
    { label: 'Mini-fridge', value: 'Fridge' },
    { label: 'Bedside phone', value: 'Phone' },
    { label: 'Blackout blinds', value: 'Blinds' },
    { label: 'Reading lamp', value: 'Lamp' },
    { label: 'Extra outlets', value: 'Outlets' }
  ];

  roomTypes = [
    {
      value: 'Standard',
      title: 'Standard',
      description: 'Shared · 2 beds',
      image: 'images/bed-icon.png'
    },
    {
      value: 'Semi-private',
      title: 'Semi-private',
      description: 'Shared · 1 partition',
      image: 'images/bed-icon.png'
    },
    {
      value: 'Private',
      title: 'Private',
      description: 'Single occupancy',
      image: 'images/bed-icon.png'
    },
    {
      value: 'Suite',
      title: 'Suite',
      description: 'VIP · lounge area',
      image: 'images/sofa-icon.png'
    }
  ];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.initializeForms();

    this.loadPatients();

    this.loadDraft();

    this.goToStep(1);
  }

  // =====================================================
  // INITIALIZATION
  // =====================================================

  initializeForms(): void {

    this.patientSearchForm = this.fb.group({
      lastName: [''],
      dob: [''],
      mobile: ['']
    });

    this.roomServiceForm = this.fb.group({

      admissionDate: ['', Validators.required],
      expectedDischarge: [''],
      patientContact: [''],
      emergencyName: [''],
      emergencyPhone: [''],
      attendingPhysician: [''],

      roomType: ['Standard'],

      amenities: [[]],

      cleaningTime: ['Early morning (6–8 AM)'],

      cleaningFrequency: ['Once daily'],

      housekeepingNotes: [''],

      dietType: [''],
      breakfastTime: [''],
      lunchTime: [''],
      dinnerTime: [''],
      snackTime: [''],
      foodNotes: ['']

    });
  }

  // =====================================================
  // PATIENT DATA
  // =====================================================

  loadPatients(): void {

    const storedPatients =
      localStorage.getItem('labServicePatients_v1');

    if (storedPatients) {

      this.patients = JSON.parse(storedPatients);

    } else {

      this.patients = this.seedPatients();

      localStorage.setItem(
        'labServicePatients_v1',
        JSON.stringify(this.patients)
      );
    }
  }

  seedPatients(): Patient[] {

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
        insurance: 'Star Health',
        memberId: 'SH-778215'
      },

      {
        id: 'p3',
        mrn: 'MRN-000003',
        firstName: 'Kavya',
        lastName: 'Bhardwaj',
        dob: '2000-07-21',
        gender: 'Female',
        phone: '9123456781',
        insurance: 'Care Plus',
        memberId: 'CP-552310'
      }

    ];
  }

  // =====================================================
  // PATIENT SEARCH
  // =====================================================

  searchPatients(): void {

    const lastName =
      this.patientSearchForm
        .get('lastName')
        ?.value
        ?.trim()
        ?.toLowerCase() || '';

    const dob =
      this.patientSearchForm
        .get('dob')
        ?.value || '';

    const mobile =
      (
        this.patientSearchForm
          .get('mobile')
          ?.value || ''
      ).replace(/\D/g, '');

    if (!lastName && !dob && !mobile) {

      this.filteredPatients = [];

      this.showPatientResults = false;

      return;
    }

    this.filteredPatients = this.patients.filter(patient => {

      const lastNameMatch =
        lastName !== '' &&
        patient.lastName
          .toLowerCase()
          .includes(lastName) &&
        (!dob || patient.dob === dob);

      const phoneMatch =
        mobile !== '' &&
        patient.phone.includes(mobile);

      return lastNameMatch || phoneMatch;
    });

    this.showPatientResults = true;
  }

  selectPatient(patient: Patient): void {

    this.selectedPatient = patient;

    this.patientSearchForm.patchValue({
      lastName: patient.lastName,
      dob: patient.dob,
      mobile: patient.phone
    });

    this.showPatientResults = false;
  }

  clearSearch(): void {

    this.patientSearchForm.reset();

    this.filteredPatients = [];

    this.showPatientResults = false;

    this.selectedPatient = null;
  }

  // =====================================================
  // ROOM SERVICE FORM
  // =====================================================

  toggleAmenity(value: string): void {

    const currentAmenities =
      this.roomServiceForm
        .get('amenities')
        ?.value || [];

    const exists =
      currentAmenities.includes(value);

    const updatedAmenities = exists
      ? currentAmenities.filter(
        (item: string) => item !== value
      )
      : [...currentAmenities, value];

    this.roomServiceForm
      .get('amenities')
      ?.setValue(updatedAmenities);
  }

  isAmenitySelected(value: string): boolean {

    const selected =
      this.roomServiceForm
        .get('amenities')
        ?.value || [];

    return selected.includes(value);
  }

  // =====================================================
  // MULTI STEP
  // =====================================================

  nextStep(): void {

    if (this.currentStep === 1) {

      if (!this.selectedPatient) {

        alert('Please select a patient profile.');

        return;
      }

      if (
        this.roomServiceForm
          .get('admissionDate')
          ?.invalid
      ) {

        this.roomServiceForm
          .get('admissionDate')
          ?.markAsTouched();

        alert('Please select admission date.');

        return;
      }
    }

    this.saveStepData();

    if (this.currentStep < this.totalSteps) {

      this.goToStep(
        this.currentStep + 1
      );

    } else {

      this.submitRoomRequest();
    }
  }

  previousStep(): void {

    if (this.currentStep > 1) {

      this.goToStep(
        this.currentStep - 1
      );
    }
  }

  goToStep(step: number): void {

    if (
      step < 1 ||
      step > this.totalSteps
    ) {
      return;
    }

    this.currentStep = step;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // =====================================================
  // DRAFT
  // =====================================================

  saveStepData(): void {

    const draft: RoomServiceDraft = {

      patient: this.selectedPatient,

      admissionDate:
        this.roomServiceForm
          .get('admissionDate')
          ?.value || '',

      expectedDischarge:
        this.roomServiceForm
          .get('expectedDischarge')
          ?.value || '',

      patientContact:
        this.roomServiceForm
          .get('patientContact')
          ?.value || '',

      emergencyName:
        this.roomServiceForm
          .get('emergencyName')
          ?.value || '',

      emergencyPhone:
        this.roomServiceForm
          .get('emergencyPhone')
          ?.value || '',

      physician:
        this.roomServiceForm
          .get('attendingPhysician')
          ?.value || '',

      roomType:
        this.roomServiceForm
          .get('roomType')
          ?.value || '',

      amenities:
        this.roomServiceForm
          .get('amenities')
          ?.value || [],

      cleaningTime:
        this.roomServiceForm
          .get('cleaningTime')
          ?.value || '',

      cleaningFrequency:
        this.roomServiceForm
          .get('cleaningFrequency')
          ?.value || '',

      housekeepingNotes:
        this.roomServiceForm
          .get('housekeepingNotes')
          ?.value || '',

      dietType:
        this.roomServiceForm
          .get('dietType')
          ?.value || '',

      breakfast:
        this.roomServiceForm
          .get('breakfastTime')
          ?.value || '',

      lunch:
        this.roomServiceForm
          .get('lunchTime')
          ?.value || '',

      dinner:
        this.roomServiceForm
          .get('dinnerTime')
          ?.value || '',

      snack:
        this.roomServiceForm
          .get('snackTime')
          ?.value || '',

      foodNotes:
        this.roomServiceForm
          .get('foodNotes')
          ?.value || ''
    };

    localStorage.setItem(
      'roomServiceDraft_v1',
      JSON.stringify(draft)
    );
  }

  saveDraft(): void {

    this.saveStepData();

    this.showDraftModal = true;
  }

  loadDraft(): void {

    const raw =
      localStorage.getItem(
        'roomServiceDraft_v1'
      );

    if (!raw) {
      return;
    }

    try {

      const draft: RoomServiceDraft =
        JSON.parse(raw);

      if (draft.patient) {

        this.selectedPatient =
          draft.patient;

        this.patientSearchForm.patchValue({
          lastName:
            draft.patient.lastName,

          dob:
            draft.patient.dob,

          mobile:
            draft.patient.phone
        });
      }

      this.roomServiceForm.patchValue({

        admissionDate:
          draft.admissionDate || '',

        expectedDischarge:
          draft.expectedDischarge || '',

        patientContact:
          draft.patientContact || '',

        emergencyName:
          draft.emergencyName || '',

        emergencyPhone:
          draft.emergencyPhone || '',

        attendingPhysician:
          draft.physician || '',

        roomType:
          draft.roomType || 'Standard',

        amenities:
          draft.amenities || [],

        cleaningTime:
          draft.cleaningTime ||
          'Early morning (6–8 AM)',

        cleaningFrequency:
          draft.cleaningFrequency ||
          'Once daily',

        housekeepingNotes:
          draft.housekeepingNotes || '',

        dietType:
          draft.dietType || '',

        breakfastTime:
          draft.breakfast || '',

        lunchTime:
          draft.lunch || '',

        dinnerTime:
          draft.dinner || '',

        snackTime:
          draft.snack || '',

        foodNotes:
          draft.foodNotes || ''
      });

    } catch (error) {

      console.error(
        'Unable to load room service draft',
        error
      );
    }
  }

  closeDraftModal(): void {

    this.showDraftModal = false;
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  submitRoomRequest(): void {

    this.saveStepData();

    const request = {

      patientId:
        this.selectedPatient?.id,

      patient:
        this.selectedPatient,

      ...this.roomServiceForm.value

    };

    console.log(
      'Room Service Request:',
      request
    );

    alert(
      'Room Service Request Submitted!'
    );
  }
}