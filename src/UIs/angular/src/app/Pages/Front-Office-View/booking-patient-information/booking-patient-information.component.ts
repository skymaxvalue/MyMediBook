import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  relation: string;
  dob: string;
  age: string;
  ageType: 'years' | 'months';
  gender: string;
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
export class BookingPatientInformationComponent implements OnInit {



  @Output() backToAvailability = new EventEmitter<any>();

  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  bookingForm!: FormGroup;
  insuranceForm!: FormGroup;
  paymentForm!: FormGroup;
  patientType: 'existing' | 'new' = 'existing';

  allPatients: Patient[] = [];
  filteredPatients: Patient[] = [];

  selectedPatientId: string | null = null;

  showPatientDropdown = false;
  searchText = '';

  showInsuranceModal = false;
  showPaymentModal = false;

  insuranceChoice: 'yes' | 'no' | null = null;

  insuranceData: any = null;
  paymentData: any = null;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.createForm();
    this.createInsuranceForm();
    this.createPaymentForm();

    this.allPatients = this.loadPatients();
    this.filteredPatients = [...this.allPatients];

    this.bookingForm
      .get('dateOfBirth')
      ?.valueChanges
      .subscribe(() => {
        this.updateAgeFromDob();
      });
  }

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  createForm(): void {

    this.bookingForm = this.fb.group({

      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      relation: ['', Validators.required],

      dateOfBirth: ['', Validators.required],

      age: ['', Validators.required],

      ageType: ['', Validators.required],

      gender: ['', Validators.required],

      address: ['', Validators.required],

      phone: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      visitPurpose: ['', Validators.required],

      visitType: ['', Validators.required],

      otp: ['', Validators.required]

    });
  }

  // --------------------------------------------------
  // PATIENT DATA
  // --------------------------------------------------

  seedPatients(): Patient[] {

    return [
      {
        id: 'p1',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        relation: 'Self',
        dob: '1990-05-12',
        age: '35',
        ageType: 'years',
        gender: 'Male'
      },
      {
        id: 'p2',
        firstName: 'Harshit',
        lastName: 'Bhardwaj',
        relation: 'Sibling',
        dob: '1997-02-10',
        age: '28',
        ageType: 'years',
        gender: 'Male'
      },
      {
        id: 'p3',
        firstName: 'K',
        lastName: 'Bhardwaj',
        relation: 'Sibling',
        dob: '2000-07-21',
        age: '25',
        ageType: 'years',
        gender: 'Female'
      },
      {
        id: 'p4',
        firstName: 'Sonia',
        lastName: 'Verma',
        relation: 'Mother',
        dob: '1962-03-03',
        age: '63',
        ageType: 'years',
        gender: 'Female'
      },
      {
        id: 'p5',
        firstName: 'Amit',
        lastName: 'Kumar',
        relation: 'Father',
        dob: '1958-11-19',
        age: '67',
        ageType: 'years',
        gender: 'Male'
      },
      {
        id: 'p6',
        firstName: 'Sonia',
        lastName: 'Kumar',
        relation: 'Father',
        dob: '1990-01-15',
        age: '35',
        ageType: 'years',
        gender: 'Female'
      }
    ];
  }

  loadPatients(): Patient[] {

    const raw = localStorage.getItem('savedPatients');

    if (!raw) {

      const seeded = this.seedPatients();

      localStorage.setItem(
        'savedPatients',
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

  savePatients(list: Patient[]): void {

    localStorage.setItem(
      'savedPatients',
      JSON.stringify(list)
    );
  }

  // --------------------------------------------------
  // PATIENT TYPE
  // --------------------------------------------------

  onPatientTypeChange(type: 'existing' | 'new'): void {

    this.patientType = type;

    if (type === 'new') {

      this.selectedPatientId = null;

      this.closePatientDropdown();

      this.clearPatientDetails();

    } else {

      this.bookingForm.reset();

      this.patientType = 'existing';
    }
  }

  clearPatientDetails(): void {

    this.bookingForm.patchValue({
      firstName: '',
      lastName: '',
      relation: '',
      dateOfBirth: '',
      age: '',
      ageType: '',
      gender: ''
    });

    this.selectedPatientId = null;
  }

  // --------------------------------------------------
  // PATIENT DROPDOWN
  // --------------------------------------------------

  createPaymentForm(): void {

    this.paymentForm = this.fb.group({

      paymentType: ['', Validators.required],

      cardHolder: ['', Validators.required],

      cardNumber: ['', Validators.required],

      cardExpiry: this.fb.group({

        expiry: ['', Validators.required],

        cvv: ['', Validators.required]

      })

    });

  }
  togglePatientDropdown(): void {

    this.showPatientDropdown =
      !this.showPatientDropdown;

    if (this.showPatientDropdown) {

      this.searchText = '';

      this.filteredPatients =
        [...this.allPatients];
    }
  }

  closePatientDropdown(): void {

    this.showPatientDropdown = false;
  }

  searchPatients(): void {

    const q =
      this.searchText
        .trim()
        .toLowerCase();

    this.filteredPatients =
      this.allPatients.filter(patient =>

        `${patient.firstName} ${patient.lastName}`
          .toLowerCase()
          .includes(q)

        ||

        patient.relation
          .toLowerCase()
          .includes(q)
      );
  }

  selectPatient(patient: Patient): void {

    this.selectedPatientId = patient.id;

    this.bookingForm.patchValue({

      firstName: patient.firstName,

      lastName: patient.lastName,

      relation: patient.relation,

      dateOfBirth: patient.dob,

      age: patient.age,

      ageType: patient.ageType,

      gender: patient.gender

    });

    this.closePatientDropdown();
  }

  // --------------------------------------------------
  // AGE CALCULATION
  // --------------------------------------------------

  updateAgeFromDob(): void {

    const dobValue =
      this.bookingForm.get('dateOfBirth')?.value;

    if (!dobValue) {

      this.bookingForm.patchValue({
        age: '',
        ageType: ''
      });

      return;
    }

    const dob =
      new Date(`${dobValue}T00:00:00`);

    const today = new Date();

    if (dob > today) {

      this.bookingForm.patchValue({
        age: '',
        ageType: ''
      });

      return;
    }

    let years =
      today.getFullYear() -
      dob.getFullYear();

    let months =
      today.getMonth() -
      dob.getMonth();

    const days =
      today.getDate() -
      dob.getDate();

    if (days < 0) {
      months--;
    }

    if (months < 0) {

      years--;

      months += 12;
    }

    // Less than one year
    if (years <= 0) {

      let totalMonths = months;

      if (days < 0 && totalMonths > 0) {
        totalMonths--;
      }

      this.bookingForm.patchValue({

        age: Math.max(totalMonths, 0),

        ageType: 'months'

      });

      return;
    }

    // One year or more
    this.bookingForm.patchValue({

      age: years,

      ageType: 'years'

    });
  }

  // --------------------------------------------------
  // FORM SUBMIT
  // --------------------------------------------------

  confirm(): void {

    if (this.bookingForm.invalid) {

      this.bookingForm.markAllAsTouched();

      return;
    }

    if (this.patientType === 'new') {

      this.addNewPatient();
    }

    this.confirmBooking();
  }

  addNewPatient(): void {

    const formValue =
      this.bookingForm.getRawValue();

    const newPatient: Patient = {

      id: 'p' + Date.now(),

      firstName: formValue.firstName,

      lastName: formValue.lastName,

      relation: formValue.relation,

      dob: formValue.dateOfBirth,

      age: formValue.age,

      ageType: formValue.ageType,

      gender: formValue.gender

    };

    this.allPatients.push(newPatient);

    this.savePatients(this.allPatients);

    this.selectedPatientId =
      newPatient.id;
  }

  // --------------------------------------------------
  // INSURANCE
  // --------------------------------------------------

  selectInsurance(choice: 'yes' | 'no'): void {

    this.insuranceChoice = choice;

    if (choice === 'yes') {

      this.showInsuranceModal = true;

    } else {

      this.showPaymentModal = true;
    }
  }

  closeInsuranceModal(): void {

    this.showInsuranceModal = false;
  }

  closePaymentModal(): void {

    this.showPaymentModal = false;
  }
  createInsuranceForm(): void {

    this.insuranceForm = this.fb.group({

      provider: ['', Validators.required],

      policy: ['', Validators.required],

      groupId: ['', Validators.required],

      holderName: ['', Validators.required],

      insuranceAddress: ['', Validators.required]

    });

  }

  confirmInsurance(): void {

    const provider =
      document.getElementById('provider') as HTMLInputElement;

    const policy =
      document.getElementById('policy') as HTMLInputElement;

    if (!provider?.value || !policy?.value) {

      return;
    }

    this.insuranceData = {

      provider: provider.value,

      policy: policy.value

    };

    this.closeInsuranceModal();
  }

  confirmPayment(): void {

    const card =
      document.getElementById('cardNumber') as HTMLInputElement;

    const cvv =
      document.getElementById('cvv') as HTMLInputElement;

    if (!card?.value || !cvv?.value) {

      return;
    }

    this.paymentData = {

      card: card.value,

      cvv: cvv.value

    };

    this.closePaymentModal();
  }

  // --------------------------------------------------
  // BOOKING
  // --------------------------------------------------

  confirmBooking(): void {

    if (!this.insuranceChoice) {

      return;
    }

    if (
      this.insuranceChoice === 'yes' &&
      !this.insuranceData
    ) {

      this.showInsuranceModal = true;

      return;
    }

    if (
      this.insuranceChoice === 'no' &&
      !this.paymentData
    ) {

      this.showPaymentModal = true;

      return;
    }

    const formValue =
      this.bookingForm.getRawValue();

    const appointment = {

      ...formValue,

      patientId: this.selectedPatientId,

      date: this.selectedDate,

      time: this.selectedSlot?.time || '',

      slotId: this.selectedSlot?.slotId || null,

      insurance: this.insuranceData,

      payment: this.paymentData

    };

    localStorage.setItem(
      'latestAppointment',
      JSON.stringify(appointment)
    );

    localStorage.setItem(
      'tempAppointment',
      JSON.stringify(appointment)
    );

    // Send data to parent / OTP component
    this.backToAvailability.emit({

      bookingPatient: appointment,

      otpDevice: {
        otpDevice: formValue.otp === 'mobile'
          ? 'mobile'
          : 'email',

        value: formValue.otp
      }

    });
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  isInvalid(controlName: string): boolean {

    const control =
      this.bookingForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      control.touched
    );
  }
}