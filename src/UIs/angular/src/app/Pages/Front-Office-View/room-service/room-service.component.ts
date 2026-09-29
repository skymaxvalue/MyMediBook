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

  attendingPhysician: string;
  attendingPhysicianDepartment: string;

  roomType: string;
  amenities: string[];

  cleaningTime: string;
  cleaningFrequency: string;
  housekeepingNotes: string;

  dietaryPreferences: string[];
  foodAllergies: string;

  breakfastMain: string;
  breakfastSide: string;
  breakfastBeverage: string;

  lunchMain: string;
  lunchSide: string;
  lunchBeverage: string;

  dinnerMain: string;
  dinnerSide: string;
  dinnerBeverage: string;

  foodNotes: string;

  clinicalServices: string[];
  hospitalityServices: string[];

  priorityLevel: string;
  careNotes: string;

  consentAccurate: boolean;
  consentArrangements: boolean;
  consentAuthorize: boolean;
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

  // =========================================================
  // CONSTANTS
  // =========================================================

  readonly totalSteps = 5;

  readonly patientsStorageKey = 'labServicePatients_v1';
  readonly draftStorageKey = 'roomServiceDraft_v1';
  readonly submittedStorageKey = 'roomServiceSubmitted_v1';

  readonly requestId = 'RSV-GU07BT';


  // =========================================================
  // STEP
  // =========================================================

  currentStep = 1;


  // =========================================================
  // PATIENT
  // =========================================================

  selectedPatient: Patient | null = null;

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];

  showPatientResults = false;


  // =========================================================
  // MODALS
  // =========================================================

  showDraftModal = false;
  showSubmitModal = false;

  submittedRequestId = '';
  submittedAt = '';


  // =========================================================
  // FORMS
  // =========================================================

  patientSearchForm!: FormGroup;
  roomServiceForm!: FormGroup;


  // =========================================================
  // ROOM TYPES
  // =========================================================

  roomTypes = [
    {
      value: 'Standard',
      title: 'Standard',
      description: 'Shared · 2 beds',
      image: '/assets/images/front-office/images/ic-users-blue.png'
    },
    {
      value: 'Semi-private',
      title: 'Semi-private',
      description: 'Shared · 1 partition',
      image: '/assets/images/front-office/images/ic-users-blue.png'
    },
    {
      value: 'Private',
      title: 'Private',
      description: 'Single occupancy',
      image: '/assets/images/front-office/images/ic-user-blue.png'
    },
    {
      value: 'Suite',
      title: 'Suite',
      description: 'VIP · lounge area',
      image: '/assets/images/front-office/images/ic-crown-blue.png'
    }
  ];


  // =========================================================
  // AMENITIES
  // =========================================================

  amenities = [
    {
      label: 'Wi-Fi access',
      value: 'Wi-Fi',
      image: '/assets/images/front-office/images/ic-wifi.png',
      data_Ic: 'wifi'
    },
    {
      label: 'Television',
      value: 'TV',
      image: '/assets/images/front-office/images/ic-tv.png',
      data_Ic: 'tv'
    },
    {
      label: 'Mini refrigerator',
      value: 'Refrigerator',
      image: '/assets/images/front-office/images/ic-chair.png',
      data_Ic: 'chair'
    },
    {
      label: 'Recliner chair',
      value: 'Recliner',
      image: '/assets/images/front-office/images/ic-fridge.png',
      data_Ic: 'fridge'

    },
    {
      label: 'Telephone',
      value: 'Telephone',
      image: '/assets/images/front-office/images/ic-phone.png',
      data_Ic: 'phone'

    },
    {
      label: 'Bedside lamp',
      value: 'Bedside Lamp',
      image: '/assets/images/front-office/images/ic-sun.png',
      data_Ic: 'sun'

    },
    {
      label: 'Visitor chair',
      value: 'Visitor Chair',
      image: '/assets/images/front-office/images/ic-lamp.png',
      data_Ic: 'lamp'

    },
    {
      label: 'Extra storage',
      value: 'Extra Storage',
      image: '/assets/images/front-office/images/ic-plug.png',
      data_Ic: 'plus'

    }
  ];


  private readonly roomAmenityMap: Record<string, string[]> = {
    Standard: [
      'Wi-Fi',
      'TV'
    ],

    'Semi-private': [
      'Wi-Fi',
      'TV',
      'Recliner'
    ],

    Private: [
      'Wi-Fi',
      'TV',
      'Refrigerator',
      'Recliner'
    ],

    Suite: [
      'Wi-Fi',
      'TV',
      'Refrigerator',
      'Recliner',
      'Telephone',
      'Bedside Lamp'
    ]
  };


  // =========================================================
  // DIETARY OPTIONS
  // =========================================================

  dietaryOptions = [

    {
      label: 'Low Sodium',
      value: 'Low Sodium',
      image: '/assets/images/front-office/images/ic-salt.png',
      data_Ic: 'salt'
    },
    {
      label: 'Diabetic',
      value: 'Diabetic',
      image: '/assets/images/front-office/images/ic-drop.png',
      data_Ic: 'drop'
    },
    {
      label: 'Halal',
      value: 'Halal',
      image: '/assets/images/front-office/images/ic-moon.png',
      data_Ic: 'moon'
    },
    {
      label: 'Vegetarian',
      value: 'Vegetarian',
      image: '/assets/images/front-office/images/ic-leaf.png',
      data_Ic: 'leaf'
    },

    {
      label: 'Gluten Free',
      value: 'Gluten Free',
      image: '/assets/images/front-office/images/ic-wheat.png',
      data_Ic: 'wheat'
    },

    {
      label: 'NPO (Nil per os)',
      value: 'NPO',
      image: '/assets/images/front-office/images/ic-npo.png',
      data_Ic: 'npo'
    },

    {
      label: 'Renal Diet',
      value: 'Renal diet',
      image: '/assets/images/front-office/images/ic-kidney.png',
      data_Ic: 'kidney'
    },
    {
      label: 'Heart healthy',
      value: 'Heart healthy',
      image: '/assets/images/front-office/images/ic-heart.png',
      data_Ic: 'heart'
    },
  ];


  // =========================================================
  // SERVICES
  // =========================================================

  clinicalServices = [
    {
      value: 'IV check',
      label: 'IV check',
      image: '/assets/images/front-office/images/ic-iv.png',
      data_Ic: 'iv'
    },
    {
      value: 'Vital signs',
      label: 'Vital signs',
      image: '/assets/images/front-office/images/ic-pulse.png',
      data_Ic: 'pulse'
    },
    {
      value: 'Medication assistance',
      label: 'Medication assistance',
      image: '/assets/images/front-office/images/ic-pill.png',
      data_Ic: 'pill'
    },
    {
      value: 'Mobility assistance',
      label: 'Mobility assistance',
      image: '/assets/images/front-office/images/ic-access.png',
      data_Ic: 'access'
    },
    {
      value: 'Wound care',
      label: 'Wound care',
      image: '/assets/images/front-office/images/ic-bandage.png',
      data_Ic: 'bandage'
    },
    {
      value: 'Respiratory therapy',
      label: 'Respiratory therapy',
      image: '/assets/images/front-office/images/ic-lungs.png',
      data_Ic: 'lungs'
    },
    {
      value: 'Other',
      label: 'Other (specify)',
      image: '/assets/images/front-office/images/ic-file.png',
      data_Ic: 'file'
    }

  ];


  hospitalityServices = [
    {
      value: 'Linen change',
      label: 'Linen Change',
      image: '/assets/images/front-office/images/ic-layers.png',
      data_Ic: 'layers'
    },
    {
      value: 'Bathing Assistance',
      label: 'Bathing Assistance',
      image: '/assets/images/front-office/images/ic-shower.png',
      data_Ic: 'shower'
    },
    {
      value: 'Entertainment',
      label: 'Entertainment',
      image: '/assets/images/front-office/images/ic-monitor.png',
      data_Ic: 'monitor'
    },
    {
      value: 'Chaplain visit',
      label: 'Chaplain Visit',
      image: '/assets/images/front-office/images/ic-cross.png',
      data_Ic: 'cross'
    },
    {
      value: 'Newspaper delivery',
      label: 'Newspaper Delivery',
      image: '/assets/images/front-office/images/ic-news.png',
      data_Ic: 'news'
    },

    {
      value: 'Family lounge access',
      label: 'Family Lounge Access',
      image: '/assets/images/front-office/images/ic-users.png',
      data_Ic: 'users'
    },
    // {
    //   value: 'Newspaper',
    //   label: 'Newspaper',
    //   image: '/assets/images/front-office/images/ic-news.png',
    //   data_Ic: 'news'
    // },
    // {
    //   value: 'Television',
    //   label: 'Television',
    //   image: '/assets/images/front-office/images/ic-monitor.png',
    //   data_Ic: 'monitor'
    // }
  ];


  // =========================================================
  // PRIORITY
  // =========================================================

  priorityLevels = [
    {
      value: 'Routine',
      label: 'Routine',
      image: '/assets/images/front-office/images/ic-clock.png',
      data_Ic: 'clock'
    },
    {
      value: 'Urgent',
      label: 'Urgent',
      image: '/assets/images/front-office/images/ic-warn.png',
      data_Ic: 'warn'
    },
    {
      value: 'Immediate',
      label: 'Immediate',
      image: '/assets/images/front-office/images/ic-siren.png',
      data_Ic: 'siren'
    }
  ];


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder
  ) { }


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.initializeForms();

    this.loadPatients();

    this.applyRoomDefaults('Standard');

    this.loadDraft();

    this.goToStep(1);
  }


  // =========================================================
  // FORM INITIALIZATION
  // =========================================================

  private initializeForms(): void {

    this.patientSearchForm = this.fb.group({

      lastName: [''],

      dob: [''],

      mobile: ['']

    });


    this.roomServiceForm = this.fb.group({

      // -----------------------------------------
      // Admission
      // -----------------------------------------

      admissionDate: [
        '',
        Validators.required
      ],

      expectedDischarge: [''],


      // -----------------------------------------
      // Contact
      // -----------------------------------------

      patientContact: [''],

      emergencyName: [''],

      emergencyPhone: [''],


      // -----------------------------------------
      // Physician
      // -----------------------------------------

      attendingPhysician: [''],

      attendingPhysicianDepartment: [''],


      // -----------------------------------------
      // Room
      // -----------------------------------------

      roomType: ['Standard'],

      amenities: [[]],


      // -----------------------------------------
      // Housekeeping
      // -----------------------------------------

      cleaningTime: [
        'Early morning (6–8 AM)'
      ],

      cleaningFrequency: [
        'Once daily'
      ],

      housekeepingNotes: [''],


      // -----------------------------------------
      // Dietary
      // -----------------------------------------

      dietaryPreferences: [[]],

      foodAllergies: [''],


      // -----------------------------------------
      // Breakfast
      // -----------------------------------------

      breakfastMain: [
        'Scrambled Eggs'
      ],

      breakfastSide: [
        'Hash Browns'
      ],

      breakfastBeverage: [
        'Orange Juice'
      ],


      // -----------------------------------------
      // Lunch
      // -----------------------------------------

      lunchMain: [
        'Grilled Chicken'
      ],

      lunchSide: [
        'Steamed Vegetables'
      ],

      lunchBeverage: [
        'Iced Tea'
      ],


      // -----------------------------------------
      // Dinner
      // -----------------------------------------

      dinnerMain: [
        'Baked Salmon'
      ],

      dinnerSide: [
        'Rice Pilaf'
      ],

      dinnerBeverage: [
        'Water'
      ],


      // -----------------------------------------
      // Meal Notes
      // -----------------------------------------

      foodNotes: [''],


      // -----------------------------------------
      // Services
      // -----------------------------------------

      clinicalServices: [[]],

      hospitalityServices: [[]],


      // -----------------------------------------
      // Priority
      // -----------------------------------------

      priorityLevel: [
        'Routine'
      ],


      // -----------------------------------------
      // Care Notes
      // -----------------------------------------

      careNotes: [''],


      // -----------------------------------------
      // Consent
      // -----------------------------------------

      consentAccurate: [
        false
      ],

      consentArrangements: [
        false
      ],

      consentAuthorize: [
        false
      ]

    });

  }


  // =========================================================
  // PATIENT DATA
  // =========================================================

  loadPatients(): void {

    try {

      const storedPatients =
        localStorage.getItem(
          this.patientsStorageKey
        );


      if (storedPatients) {

        this.patients =
          JSON.parse(storedPatients);

        return;
      }

    } catch (error) {

      console.error(
        'Unable to load patients:',
        error
      );

    }


    // Default demo patients

    this.patients = [

      {
        id: 'p1',
        mrn: 'MRN-000001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        dob: '1985-04-15',
        gender: 'Male',
        phone: '9876543210',
        insurance: 'HealthCare Plus',
        memberId: 'HC-100001'
      },

      {
        id: 'p2',
        mrn: 'MRN-000002',
        firstName: 'Harshit',
        lastName: 'Bhardwaj',
        dob: '1990-08-22',
        gender: 'Male',
        phone: '9876543211',
        insurance: 'MediAssist',
        memberId: 'MA-100002'
      },

      {
        id: 'p3',
        mrn: 'MRN-000003',
        firstName: 'Kavya',
        lastName: 'Bhardwaj',
        dob: '1994-11-10',
        gender: 'Female',
        phone: '9876543212',
        insurance: 'Care Insurance',
        memberId: 'CI-100003'
      }

    ];


    localStorage.setItem(
      this.patientsStorageKey,
      JSON.stringify(this.patients)
    );

  }


  // =========================================================
  // PATIENT SEARCH
  // =========================================================

  searchPatients(): void {

    const search =
      this.patientSearchForm.value;


    const lastName =
      String(search.lastName || '')
        .trim()
        .toLowerCase();


    const dob =
      String(search.dob || '')
        .trim();


    const mobile =
      String(search.mobile || '')
        .trim();


    if (
      !lastName &&
      !dob &&
      !mobile
    ) {

      this.filteredPatients = [];

      this.showPatientResults = false;

      return;
    }


    this.filteredPatients =
      this.patients.filter(patient => {

        const patientLastName =
          patient.lastName
            .toLowerCase();


        const patientPhone =
          patient.phone || '';


        const matchesMobile =
          mobile.length > 0 &&
          patientPhone.includes(mobile);


        const matchesNameAndDob =
          lastName.length > 0 &&
          patientLastName.includes(lastName) &&
          (
            !dob ||
            patient.dob === dob
          );


        return (
          matchesMobile ||
          matchesNameAndDob
        );

      });


    this.showPatientResults = true;

  }


  // =========================================================
  // SELECT PATIENT
  // =========================================================

  selectPatient(
    patient: Patient
  ): void {

    this.selectedPatient = patient;

    this.patientSearchForm.patchValue({

      lastName: patient.lastName,

      dob: patient.dob,

      mobile: patient.phone

    });


    this.showPatientResults = false;


    // Auto-fill patient contact

    this.roomServiceForm.patchValue({

      patientContact: patient.phone

    });

  }


  // =========================================================
  // SWITCH PATIENT
  // =========================================================

  switchPatient(): void {

    this.selectedPatient = null;

    this.filteredPatients = [];

    this.showPatientResults = false;


    this.patientSearchForm.reset({

      lastName: '',

      dob: '',

      mobile: ''

    });

  }


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  clearSearch(): void {

    this.patientSearchForm.reset({

      lastName: '',

      dob: '',

      mobile: ''

    });


    this.filteredPatients = [];

    this.showPatientResults = false;

  }


  // =========================================================
  // ROOM DEFAULTS
  // =========================================================

  applyRoomDefaults(
    roomType: string
  ): void {

    const defaultAmenities =
      this.roomAmenityMap[roomType] || [];


    this.roomServiceForm
      .get('amenities')
      ?.setValue([
        ...defaultAmenities
      ]);

  }


  // =========================================================
  // AMENITIES
  // =========================================================

  isAmenitySelected(
    value: string
  ): boolean {

    const selected =
      this.roomServiceForm
        .get('amenities')
        ?.value || [];


    return selected.includes(value);

  }


  toggleAmenity(
    value: string
  ): void {

    const control =
      this.roomServiceForm
        .get('amenities');


    if (!control) {
      return;
    }


    const current: string[] =
      control.value || [];


    if (current.includes(value)) {

      control.setValue(
        current.filter(
          item => item !== value
        )
      );

    } else {

      control.setValue([
        ...current,
        value
      ]);

    }

  }


  // =========================================================
  // ROOM TYPE CHANGE
  // =========================================================

  onRoomTypeChange(): void {

    const roomType =
      this.roomServiceForm
        .get('roomType')
        ?.value;


    this.applyRoomDefaults(
      roomType
    );

  }


  // =========================================================
  // DIETARY PREFERENCES
  // =========================================================

  isDietSelected(
    value: string
  ): boolean {

    const selected =
      this.roomServiceForm
        .get('dietaryPreferences')
        ?.value || [];


    return selected.includes(value);

  }


  toggleDiet(
    value: string
  ): void {

    const control =
      this.roomServiceForm
        .get('dietaryPreferences');


    if (!control) {
      return;
    }


    const current: string[] =
      control.value || [];


    if (current.includes(value)) {

      control.setValue(
        current.filter(
          item => item !== value
        )
      );

    } else {

      control.setValue([
        ...current,
        value
      ]);

    }

  }


  // =========================================================
  // CLINICAL SERVICES
  // =========================================================

  isClinicalServiceSelected(
    service: string
  ): boolean {

    const selected =
      this.roomServiceForm
        .get('clinicalServices')
        ?.value || [];


    return selected.includes(service);

  }


  toggleClinicalService(
    service: string
  ): void {

    const control =
      this.roomServiceForm
        .get('clinicalServices');


    if (!control) {
      return;
    }


    const current: string[] =
      control.value || [];


    if (current.includes(service)) {

      control.setValue(
        current.filter(
          item => item !== service
        )
      );

    } else {

      control.setValue([
        ...current,
        service
      ]);

    }

  }


  // =========================================================
  // HOSPITALITY SERVICES
  // =========================================================

  isHospitalityServiceSelected(
    service: string
  ): boolean {

    const selected =
      this.roomServiceForm
        .get('hospitalityServices')
        ?.value || [];


    return selected.includes(service);

  }


  toggleHospitalityService(
    service: string
  ): void {

    const control =
      this.roomServiceForm
        .get('hospitalityServices');


    if (!control) {
      return;
    }


    const current: string[] =
      control.value || [];


    if (current.includes(service)) {

      control.setValue(
        current.filter(
          item => item !== service
        )
      );

    } else {

      control.setValue([
        ...current,
        service
      ]);

    }

  }


  // =========================================================
  // SELECTED DATA GETTERS
  // =========================================================

  get selectedDietaryPreferences(): string[] {

    return (
      this.roomServiceForm
        ?.get('dietaryPreferences')
        ?.value || []
    );

  }


  get selectedClinicalServices(): string[] {

    return (
      this.roomServiceForm
        ?.get('clinicalServices')
        ?.value || []
    );

  }


  get selectedHospitalityServices(): string[] {

    return (
      this.roomServiceForm
        ?.get('hospitalityServices')
        ?.value || []
    );

  }


  // =========================================================
  // STEP NAVIGATION
  // =========================================================

  nextStep(): void {

    if (this.currentStep === 1) {

      if (!this.validatePatientStep()) {
        return;
      }

    }


    if (this.currentStep < this.totalSteps) {

      this.saveStepData();

      this.currentStep++;

      this.scrollToTop();

      return;
    }


    // Step 5

    this.submitRoomRequest();

  }


  // =========================================================
  // VALIDATE STEP 1
  // =========================================================

  private validatePatientStep(): boolean {

    if (!this.selectedPatient) {

      alert(
        'Please select a patient before continuing.'
      );

      return false;
    }


    const admissionDate =
      this.roomServiceForm
        .get('admissionDate');


    if (!admissionDate?.value) {

      admissionDate?.markAsTouched();


      alert(
        'Please select the admission date.'
      );

      return false;
    }


    return true;

  }


  // =========================================================
  // PREVIOUS STEP
  // =========================================================

  previousStep(): void {

    if (this.currentStep > 1) {

      this.saveStepData();

      this.currentStep--;

      this.scrollToTop();

    }

  }


  // =========================================================
  // GO TO STEP
  // =========================================================

  goToStep(
    step: number
  ): void {

    if (
      step < 1 ||
      step > this.totalSteps
    ) {
      return;
    }


    this.currentStep = step;

    this.scrollToTop();

  }


  // =========================================================
  // SAVE STEP / DRAFT
  // =========================================================

  saveStepData(): void {

    if (!this.roomServiceForm) {
      return;
    }


    const formValue =
      this.roomServiceForm.getRawValue();


    const draft: RoomServiceDraft = {

      patient: this.selectedPatient,

      admissionDate:
        formValue.admissionDate || '',

      expectedDischarge:
        formValue.expectedDischarge || '',

      patientContact:
        formValue.patientContact || '',

      emergencyName:
        formValue.emergencyName || '',

      emergencyPhone:
        formValue.emergencyPhone || '',

      attendingPhysician:
        formValue.attendingPhysician || '',

      attendingPhysicianDepartment:
        formValue.attendingPhysicianDepartment || '',

      roomType:
        formValue.roomType || 'Standard',

      amenities:
        formValue.amenities || [],

      cleaningTime:
        formValue.cleaningTime || '',

      cleaningFrequency:
        formValue.cleaningFrequency || '',

      housekeepingNotes:
        formValue.housekeepingNotes || '',

      dietaryPreferences:
        formValue.dietaryPreferences || [],

      foodAllergies:
        formValue.foodAllergies || '',

      breakfastMain:
        formValue.breakfastMain || '',

      breakfastSide:
        formValue.breakfastSide || '',

      breakfastBeverage:
        formValue.breakfastBeverage || '',

      lunchMain:
        formValue.lunchMain || '',

      lunchSide:
        formValue.lunchSide || '',

      lunchBeverage:
        formValue.lunchBeverage || '',

      dinnerMain:
        formValue.dinnerMain || '',

      dinnerSide:
        formValue.dinnerSide || '',

      dinnerBeverage:
        formValue.dinnerBeverage || '',

      foodNotes:
        formValue.foodNotes || '',

      clinicalServices:
        formValue.clinicalServices || [],

      hospitalityServices:
        formValue.hospitalityServices || [],

      priorityLevel:
        formValue.priorityLevel || 'Routine',

      careNotes:
        formValue.careNotes || '',

      consentAccurate:
        !!formValue.consentAccurate,

      consentArrangements:
        !!formValue.consentArrangements,

      consentAuthorize:
        !!formValue.consentAuthorize

    };


    localStorage.setItem(
      this.draftStorageKey,
      JSON.stringify(draft)
    );

  }


  // =========================================================
  // SAVE DRAFT BUTTON
  // =========================================================

  saveDraft(): void {

    this.saveStepData();

    this.showDraftModal = true;

  }


  // =========================================================
  // LOAD DRAFT
  // =========================================================

  loadDraft(): void {

    try {

      const storedDraft =
        localStorage.getItem(
          this.draftStorageKey
        );


      if (!storedDraft) {
        return;
      }


      const draft =
        JSON.parse(storedDraft) as Partial<RoomServiceDraft>;


      // -----------------------------------------
      // Patient
      // -----------------------------------------

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


      // -----------------------------------------
      // Room type
      // -----------------------------------------

      const roomType =
        draft.roomType || 'Standard';


      // -----------------------------------------
      // Form
      // -----------------------------------------

      this.roomServiceForm.patchValue({

        admissionDate:
          draft.admissionDate || '',

        expectedDischarge:
          draft.expectedDischarge || '',

        patientContact:
          draft.patientContact ||
          draft.patient?.phone ||
          '',

        emergencyName:
          draft.emergencyName || '',

        emergencyPhone:
          draft.emergencyPhone || '',

        attendingPhysician:
          draft.attendingPhysician || '',

        attendingPhysicianDepartment:
          draft.attendingPhysicianDepartment || '',

        roomType,

        cleaningTime:
          draft.cleaningTime ||
          'Early morning (6–8 AM)',

        cleaningFrequency:
          draft.cleaningFrequency ||
          'Once daily',

        housekeepingNotes:
          draft.housekeepingNotes || '',

        dietaryPreferences:
          draft.dietaryPreferences || [],

        foodAllergies:
          draft.foodAllergies || '',

        breakfastMain:
          draft.breakfastMain ||
          'Scrambled Eggs',

        breakfastSide:
          draft.breakfastSide ||
          'Hash Browns',

        breakfastBeverage:
          draft.breakfastBeverage ||
          'Orange Juice',

        lunchMain:
          draft.lunchMain ||
          'Grilled Chicken',

        lunchSide:
          draft.lunchSide ||
          'Steamed Vegetables',

        lunchBeverage:
          draft.lunchBeverage ||
          'Iced Tea',

        dinnerMain:
          draft.dinnerMain ||
          'Baked Salmon',

        dinnerSide:
          draft.dinnerSide ||
          'Rice Pilaf',

        dinnerBeverage:
          draft.dinnerBeverage ||
          'Water',

        foodNotes:
          draft.foodNotes || '',

        clinicalServices:
          draft.clinicalServices || [],

        hospitalityServices:
          draft.hospitalityServices || [],

        priorityLevel:
          draft.priorityLevel ||
          'Routine',

        careNotes:
          draft.careNotes || '',

        consentAccurate:
          !!draft.consentAccurate,

        consentArrangements:
          !!draft.consentArrangements,

        consentAuthorize:
          !!draft.consentAuthorize

      });


      // -----------------------------------------
      // Amenities
      // -----------------------------------------

      if (Array.isArray(draft.amenities)) {

        this.roomServiceForm
          .get('amenities')
          ?.setValue([
            ...draft.amenities
          ]);

      } else {

        this.applyRoomDefaults(
          roomType
        );

      }


      this.showPatientResults = false;

    } catch (error) {

      console.error(
        'Unable to load room service draft:',
        error
      );

    }

  }


  // =========================================================
  // CLOSE DRAFT MODAL
  // =========================================================

  closeDraftModal(): void {

    this.showDraftModal = false;

  }


  // =========================================================
  // SUBMIT REQUEST
  // =========================================================

  submitRoomRequest(): void {

    // -----------------------------------------
    // Validate patient
    // -----------------------------------------

    if (!this.selectedPatient) {

      alert(
        'Please select a patient.'
      );

      this.goToStep(1);

      return;
    }


    // -----------------------------------------
    // Validate admission
    // -----------------------------------------

    const admissionDate =
      this.roomServiceForm
        .get('admissionDate');


    if (!admissionDate?.value) {

      alert(
        'Please provide the admission date.'
      );

      this.goToStep(1);

      admissionDate?.markAsTouched();

      return;
    }


    // -----------------------------------------
    // Validate consent
    // -----------------------------------------

    const consentAccurate =
      this.roomServiceForm
        .get('consentAccurate');

    const consentArrangements =
      this.roomServiceForm
        .get('consentArrangements');

    const consentAuthorize =
      this.roomServiceForm
        .get('consentAuthorize');


    const allConsentsAccepted =
      !!consentAccurate?.value &&
      !!consentArrangements?.value &&
      !!consentAuthorize?.value;


    if (!allConsentsAccepted) {

      alert(
        'Please accept all consent and authorization statements before confirming the reservation.'
      );

      return;
    }


    // -----------------------------------------
    // Save current data
    // -----------------------------------------

    this.saveStepData();


    // -----------------------------------------
    // Create submitted request
    // -----------------------------------------

    const formValue =
      this.roomServiceForm.getRawValue();


    const submittedRequest = {

      requestId: this.requestId,

      patient: this.selectedPatient,

      room: {
        roomNumber: '402-B',
        bed: 'B',
        ward: 'Cardiology',
        floor: '4th Floor',
        roomType: formValue.roomType,
        amenities: formValue.amenities
      },

      admissionDate:
        formValue.admissionDate,

      expectedDischarge:
        formValue.expectedDischarge,

      meals: {

        dietaryPreferences:
          formValue.dietaryPreferences,

        foodAllergies:
          formValue.foodAllergies,

        breakfast: {
          main: formValue.breakfastMain,
          side: formValue.breakfastSide,
          beverage: formValue.breakfastBeverage
        },

        lunch: {
          main: formValue.lunchMain,
          side: formValue.lunchSide,
          beverage: formValue.lunchBeverage
        },

        dinner: {
          main: formValue.dinnerMain,
          side: formValue.dinnerSide,
          beverage: formValue.dinnerBeverage
        },

        notes:
          formValue.foodNotes

      },

      services: {

        clinical:
          formValue.clinicalServices,

        hospitality:
          formValue.hospitalityServices,

        priority:
          formValue.priorityLevel,

        careNotes:
          formValue.careNotes

      },

      status: 'Reserved',

      submittedAt:
        new Date().toISOString()

    };


    // -----------------------------------------
    // Store submitted request
    // -----------------------------------------

    try {

      const existing =
        localStorage.getItem(
          this.submittedStorageKey
        );


      const submittedRequests =
        existing
          ? JSON.parse(existing)
          : [];


      submittedRequests.push(
        submittedRequest
      );


      localStorage.setItem(
        this.submittedStorageKey,
        JSON.stringify(
          submittedRequests
        )
      );


      // Remove draft after successful submit

      localStorage.removeItem(
        this.draftStorageKey
      );


    } catch (error) {

      console.error(
        'Unable to save submitted request:',
        error
      );

    }


    // -----------------------------------------
    // Modal information
    // -----------------------------------------

    this.submittedRequestId =
      this.requestId;


    this.submittedAt =
      this.formatDateTime(
        new Date()
      );


    this.showSubmitModal = true;

  }


  // =========================================================
  // CLOSE SUBMIT MODAL
  // =========================================================

  closeSubmitModal(): void {

    this.showSubmitModal = false;

  }


  // =========================================================
  // FORMAT DATE/TIME
  // =========================================================

  private formatDateTime(
    date: Date
  ): string {

    return date.toLocaleString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // =========================================================
  // SCROLL
  // =========================================================

  private scrollToTop(): void {

    if (
      typeof window !== 'undefined'
    ) {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }

  }

}