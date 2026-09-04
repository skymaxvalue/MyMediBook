import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface Doctor {
  id?: number | string;
  name?: string;
  specialization?: string;
}

interface Patient {
  id: number | string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  ageType?: 'years' | 'months';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  permanentAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPinCode?: string;
}

interface ResponsibleParty {
  id?: number | string;
  name: string;
  phone?: string;
  email?: string;
  relation?: string;
  address?: string;
}

@Component({
  selector: 'app-booking-patient-information',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './booking-patient-information.component.html',
  styleUrl: './booking-patient-information.component.css'
})
export class BookingPatientInformationComponent
  implements OnInit, OnDestroy {

  @Input() doctor!: Doctor;

  @Input() selectedDate: string = '';

  @Input() selectedSlot: any;


  bookingForm!: FormGroup;

  patientSearchForm!: FormGroup;

  responsiblePartySearchForm!: FormGroup;

  responsiblePartyForm!: FormGroup;
  responsiblePartySearchError = '';

  insuranceForm!: FormGroup;

  paymentForm!: FormGroup;


  patientType: 'existing' | 'new' = 'existing';

  accountHolder: 'self' | 'other' | null = null;

  insuranceChoice: 'yes' | 'no' | null = null;

  otpMethod: 'mobile' | 'email' | 'none' | null = null;

  rpOtpChannel: 'phone' | 'email' | 'none' = 'phone';

  selectPatientModal = false;

  savedInfoModal = false;

  responsiblePartyChannelModal = false;

  responsiblePartyOtpModal = false;

  insuranceModal = false;

  paymentModal = false;


  patients: Patient[] = [];

  selectedPatient: Patient | null = null;

  highlightedPatient: Patient | null = null;


  responsiblePartyFound: ResponsibleParty | null = null;

  responsiblePartySearched = false;

  responsiblePartyNotFound = false;

  linkedAccountMessage = '';

  savedInfoType: 'phone' | 'email' | null = null;

  savedInfoPatient: Patient | null = null;

  otp = '';

  otpError = '';

  otpTimeRemaining = 60;

  private otpTimer?: ReturnType<typeof setInterval>;


  states: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi'
  ];


  constructor(
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {

    this.createForms();

    this.loadPatients();

    this.setupFormSubscriptions();

  }


  private createForms(): void {


    this.bookingForm = this.fb.group({

      patientType: ['existing', Validators.required],

      patientId: [null],

      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      gender: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      age: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      ageType: ['years', Validators.required],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      address: ['', Validators.required],

      city: ['', Validators.required],

      state: ['', Validators.required],

      pinCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ],

      sameAsPresentAddress: [false],

      permanentAddress: ['', Validators.required],

      permanentCity: ['', Validators.required],

      permanentState: ['', Validators.required],

      permanentPinCode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ],

      visitPurpose: ['', Validators.required],

      visitType: ['', Validators.required],

      otp: ['', Validators.required],

      insurance: ['', Validators.required],

      accountHolder: [''],

      accountHolderName: [''],

      relationToPatient: ['']

    });


    this.patientSearchForm = this.fb.group({

      search: [''],

      dob: ['']

    });


    this.responsiblePartySearchForm = this.fb.group({

      mobile: [
        '',
        Validators.pattern(/^[0-9]{10}$/)
      ],

      name: [''],

      dob: ['']

    });


    this.responsiblePartyForm = this.fb.group({

      accountHolder: ['', Validators.required],

      accountHolderName: [''],

      relationToPatient: ['']

    });


    this.insuranceForm = this.fb.group({

      provider: ['', Validators.required],

      policy: ['', Validators.required],

      groupId: ['', Validators.required],

      holderName: ['', Validators.required],

      address: ['', Validators.required]

    });


    this.paymentForm = this.fb.group({

      paymentType: ['', Validators.required],

      cardHolder: ['', Validators.required],

      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{12,19}$/)
        ]
      ],

      expiry: [
        '',
        Validators.required
      ],

      cvv: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{3,4}$/)
        ]
      ]

    });

  }


  private setupFormSubscriptions(): void {

    // Patient Type

    this.bookingForm
      .get('patientType')
      ?.valueChanges
      .subscribe(value => {

        this.patientType = value;

        if (value === 'existing') {

          this.openSelectPatientModal();

        } else {

          this.clearPatientDetails();

          this.closeSelectPatientModal();

        }

      });


    // Same Address

    this.bookingForm
      .get('sameAsPresentAddress')
      ?.valueChanges
      .subscribe(checked => {

        if (checked) {

          this.copyPresentAddress();

        }

      });


    // Insurance

    this.bookingForm
      .get('insurance')
      ?.valueChanges
      .subscribe(value => {

        this.insuranceChoice = value;

        if (value === 'yes') {

          // Yes → Open Insurance Modal
          this.openInsuranceModal();

        } else if (value === 'no') {

          // No → Open Payment Modal
          this.openPaymentModal();

        }

      });


    // Account holder

    this.bookingForm
      .get('accountHolder')
      ?.valueChanges
      .subscribe(value => {

        this.accountHolder = value;

      });

  }



  private loadPatients(): void {

    // Replace this with API call

    this.patients = [

      {
        id: 1,
        firstName: 'Rahul',
        lastName: 'Patil',
        gender: 'Male',
        dateOfBirth: '1995-05-12',
        age: 31,
        ageType: 'years',
        phone: '9876543210',
        email: 'rahul@example.com',
        address: 'Pimpri',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411018'
      },

      {
        id: 2,
        firstName: 'Sneha',
        lastName: 'Shinde',
        gender: 'Female',
        dateOfBirth: '1998-10-20',
        age: 27,
        ageType: 'years',
        phone: '9876501234',
        email: 'sneha@example.com',
        address: 'Wakad',
        city: 'Pune',
        state: 'Maharashtra',
        pinCode: '411057'
      }

    ];

  }



  get filteredPatients(): Patient[] {

    const search =
      this.patientSearchForm
        .get('search')
        ?.value
        ?.trim()
        ?.toLowerCase() || '';

    const dob =
      this.patientSearchForm
        .get('dob')
        ?.value || '';


    return this.patients.filter(patient => {

      const fullName =
        `${patient.firstName} ${patient.lastName}`
          .toLowerCase();

      const matchesName =
        !search ||
        fullName.includes(search);

      const matchesDob =
        !dob ||
        patient.dateOfBirth === dob;

      return matchesName && matchesDob;

    });

  }


  // ====================================================
  // EXISTING PATIENT MODAL
  // ====================================================

  openSelectPatientModal(): void {

    this.selectPatientModal = true;

    this.patientSearchForm.reset({
      search: '',
      dob: ''
    });

    this.highlightedPatient = null;

  }


  closeSelectPatientModal(): void {

    this.selectPatientModal = false;

  }


  selectPatient(patient: Patient): void {

    this.highlightedPatient = patient;

  }


  confirmPatientSelection(): void {

    if (!this.highlightedPatient) {
      return;
    }

    this.selectedPatient = this.highlightedPatient;

    this.bookingForm.patchValue({

      patientId: this.selectedPatient.id,

      firstName: this.selectedPatient.firstName,

      lastName: this.selectedPatient.lastName,

      gender: this.selectedPatient.gender,

      dateOfBirth: this.selectedPatient.dateOfBirth,

      age: this.selectedPatient.age,

      ageType: this.selectedPatient.ageType || 'years',

      phone: this.selectedPatient.phone,

      email: this.selectedPatient.email,

      address: this.selectedPatient.address,

      city: this.selectedPatient.city,

      state: this.selectedPatient.state,

      pinCode: this.selectedPatient.pinCode

    });

    this.closeSelectPatientModal();

  }


  // ====================================================
  // RESPONSIBLE PARTY
  // ====================================================

  searchResponsibleParty(): void {

    const form = this.responsiblePartySearchForm;

    const mobile = (form.get('mobile')?.value || '').trim();
    const name = (form.get('name')?.value || '').trim();
    const dob = form.get('dob')?.value || '';

    console.log('SEARCH CLICKED');
    console.log('Mobile:', mobile);
    console.log('Name:', name);
    console.log('DOB:', dob);

    // Reset previous result
    this.responsiblePartySearchError = '';
    this.responsiblePartyFound = null;
    this.responsiblePartyNotFound = false;
    this.responsiblePartySearched = false;


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!mobile && !name) {

      this.responsiblePartySearchError =
        'Please enter mobile number or patient full name.';

      return;
    }


    // Mobile validation
    if (mobile && !/^[0-9]{10}$/.test(mobile)) {

      this.responsiblePartySearchError =
        'Please enter a valid 10-digit mobile number.';

      return;
    }


    // ----------------------------------------
    // SEARCH
    // ----------------------------------------

    const result = this.patients.find(patient => {

      const patientFullName =
        `${patient.firstName} ${patient.lastName}`
          .trim()
          .toLowerCase();

      const enteredName =
        name.toLowerCase();

      // Search by mobile
      if (mobile) {
        return patient.phone === mobile;
      }

      // Search by name
      if (name) {

        const nameMatch =
          patientFullName === enteredName;

        // If DOB entered, check DOB also
        if (dob) {
          return (
            nameMatch &&
            patient.dateOfBirth === dob
          );
        }

        return nameMatch;
      }

      return false;

    });


    console.log('SEARCH RESULT:', result);


    this.responsiblePartySearched = true;


    // ----------------------------------------
    // FOUND
    // ----------------------------------------

    if (result) {

      this.responsiblePartyFound = {

        id: result.id,

        name:
          `${result.firstName} ${result.lastName}`,

        phone: result.phone,

        email: result.email

      };

      this.responsiblePartyNotFound = false;

      console.log(
        'Responsible Party Found:',
        this.responsiblePartyFound
      );

    }

    // ----------------------------------------
    // NOT FOUND
    // ----------------------------------------

    else {

      this.responsiblePartyFound = null;

      this.responsiblePartyNotFound = true;

      console.log('Responsible Party NOT Found');

    }

  }

  continueWithAccount(): void {

    if (!this.responsiblePartyFound) {
      return;
    }

    this.linkedAccountMessage =
      `Account linked with ${this.responsiblePartyFound.name}`;

    this.responsiblePartyChannelModal = true;

  }


  searchAgainResponsibleParty(): void {

    this.responsiblePartyFound = null;

    this.responsiblePartyNotFound = false;

    this.responsiblePartySearched = false;

    this.responsiblePartySearchError = '';

    this.responsiblePartySearchForm.reset();

  }

  // ====================================================
  // RESPONSIBLE PARTY OTP
  // ====================================================

  continueResponsiblePartyChannel(): void {

    this.responsiblePartyChannelModal = false;

    this.responsiblePartyOtpModal = true;

    this.startOtpTimer();

  }


  closeResponsiblePartyChannelModal(): void {

    this.responsiblePartyChannelModal = false;

  }


  closeResponsiblePartyOtpModal(): void {

    this.responsiblePartyOtpModal = false;

    this.stopOtpTimer();

  }


  changeRpOtpChannel(): void {

    this.responsiblePartyOtpModal = false;

    this.responsiblePartyChannelModal = true;

  }


  verifyResponsiblePartyOtp(): void {

    // Replace with API OTP verification

    if (this.otp === '1234') {

      this.responsiblePartyOtpModal = false;

      this.linkedAccountMessage =
        'Responsible party verified successfully.';

    } else {

      this.otpError =
        'Incorrect OTP. Please try again.';

    }

  }


  resendOtp(): void {

    this.otp = '';

    this.otpError = '';

    this.startOtpTimer();

  }


  startOtpTimer(): void {

    this.stopOtpTimer();

    this.otpTimeRemaining = 60;

    this.otpTimer =
      setInterval(() => {

        this.otpTimeRemaining--;

        if (this.otpTimeRemaining <= 0) {

          this.stopOtpTimer();

        }

      }, 1000);

  }


  stopOtpTimer(): void {

    if (this.otpTimer) {

      clearInterval(this.otpTimer);

      this.otpTimer = undefined;

    }

  }


  get otpTimerText(): string {

    const minutes =
      Math.floor(this.otpTimeRemaining / 60)
        .toString()
        .padStart(2, '0');

    const seconds =
      (this.otpTimeRemaining % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;

  }


  // ====================================================
  // INSURANCE
  // ====================================================

  openInsuranceModal(): void {

    this.insuranceModal = true;

  }


  closeInsuranceModal(): void {

    this.insuranceModal = false;

  }


  confirmInsurance(): void {

    if (this.insuranceForm.invalid) {

      this.insuranceForm.markAllAsTouched();

      return;

    }

    this.insuranceModal = false;

  }


  // ====================================================
  // PAYMENT
  // ====================================================

  openPaymentModal(): void {

    this.paymentModal = true;

  }


  closePaymentModal(): void {

    this.paymentModal = false;

  }


  confirmPayment(): void {

    if (this.paymentForm.invalid) {

      this.paymentForm.markAllAsTouched();

      return;

    }

    this.paymentModal = false;

  }


  // ====================================================
  // ADDRESS
  // ====================================================

  copyPresentAddress(): void {

    this.bookingForm.patchValue({

      permanentAddress:
        this.bookingForm.get('address')?.value,

      permanentCity:
        this.bookingForm.get('city')?.value,

      permanentState:
        this.bookingForm.get('state')?.value,

      permanentPinCode:
        this.bookingForm.get('pinCode')?.value

    });

  }


  // ====================================================
  // SAVED INFO
  // ====================================================

  closeSavedInfoModal(): void {

    this.savedInfoModal = false;

  }


  useSavedInfo(): void {

    if (!this.savedInfoPatient) {
      return;
    }

    this.bookingForm.patchValue(
      this.savedInfoPatient
    );

    this.savedInfoModal = false;

  }


  useNewInfo(): void {

    this.savedInfoModal = false;

  }


  // ====================================================
  // CLEAR
  // ====================================================

  clearPatientDetails(): void {

    this.selectedPatient = null;

    this.bookingForm.patchValue({

      patientId: null,

      firstName: '',

      lastName: '',

      gender: '',

      dateOfBirth: '',

      age: '',

      ageType: 'years'

    });

  }


  clearForm(): void {

    this.bookingForm.reset({

      patientType: 'existing',

      ageType: 'years',

      sameAsPresentAddress: false

    });

    this.selectedPatient = null;

    this.insuranceChoice = null;

    this.accountHolder = null;

  }


  // ====================================================
  // SUBMIT
  // ====================================================

  submitBooking(): void {

    if (this.bookingForm.invalid) {

      this.bookingForm.markAllAsTouched();

      return;

    }


    const payload = {

      doctor: this.doctor,

      appointmentDate: this.selectedDate,

      appointmentSlot: this.selectedSlot,

      patient: this.bookingForm.value,

      insurance: this.insuranceForm.value,

      payment: this.paymentForm.value

    };


    console.log(
      'Booking Payload:',
      payload
    );


    // Call your booking API here

  }


  // ====================================================
  // HELPERS
  // ====================================================

  isInvalid(controlName: string): boolean {

    const control =
      this.bookingForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }


  ngOnDestroy(): void {

    this.stopOtpTimer();

  }

}

