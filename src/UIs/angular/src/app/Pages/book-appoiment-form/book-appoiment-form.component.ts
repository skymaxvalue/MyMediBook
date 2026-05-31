import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-book-appoiment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-appoiment-form.component.html',
  styleUrl: './book-appoiment-form.component.css'
})
export class BookAppoimentFormComponent implements OnInit {
  @Output() backToAvailability = new EventEmitter<void>();
  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  InsurenceValue: string = '';

  bookingForm!: FormGroup;

  showInsuranceModal = false;
  showPaymentModal = false;

  validationMessages: any = {
    firstName: {
      required: 'First name is required.',
      minlength: 'First name must be at least 2 characters.',
      pattern: 'First name can contain only letters.'
    },
    lastName: {
      required: 'Last name is required.',
      minlength: 'Last name must be at least 2 characters.',
      pattern: 'Last name can contain only letters.'
    },
    dateOfBirth: {
      required: 'Date of birth is required.'
    },
    age: {
      required: 'Age is required.',
      min: 'Age must be greater than or equal to 0.'
    },
    ageType: {
      required: 'Please select age type.'
    },
    gender: {
      required: 'Please select gender.'
    },
    insurance: {
      required: 'Please select insurance option.'
    },
    address: {
      required: 'Address is required.',
      minlength: 'Address must be at least 5 characters.'
    },
    phone: {
      required: 'Contact number is required.',
      pattern: 'Contact number must be exactly 10 digits.'
    },
    email: {
      required: 'Email address is required.',
      email: 'Please enter a valid email address.'
    },
    visitPurpose: {
      required: 'Visit purpose is required.',
      minlength: 'Visit purpose must be at least 5 characters.'
    },
    visitType: {
      required: 'Please select type of visit.'
    },
    otpMethod: {
      required: 'Please select OTP verification method.'
    }
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleInsuranceChange();
    this.handleDobChange();
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z ]+$')
        ]
      ],
      dateOfBirth: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      ageType: ['', Validators.required],
      gender: ['', Validators.required],
      insurance: ['', Validators.required],

      insuranceData: this.fb.group({
        provider: [''],
        policy: [''],
        groupId: [''],
        holderName: [''],
        address: ['']
      }),

      paymentData: this.fb.group({
        paymentType: [''],
        cardHolder: [''],
        cardNumber: [''],
        expiry: [''],
        cvv: ['']
      }),

      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      visitPurpose: ['', [Validators.required, Validators.minLength(5)]],
      visitType: ['', Validators.required],
      otpMethod: ['', Validators.required]
    });
  }

  // =========================
  // Getters
  // =========================
  get insuranceForm(): FormGroup {
    return this.bookingForm.get('insuranceData') as FormGroup;
  }

  get paymentForm(): FormGroup {
    return this.bookingForm.get('paymentData') as FormGroup;
  }

  // =========================
  // Error Messages
  // =========================
  getErrorMessage(controlName: string): string {
    const control = this.bookingForm.get(controlName);

    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return '';
    }

    const messages = this.validationMessages[controlName];

    for (const errorKey of Object.keys(control.errors)) {
      if (messages?.[errorKey]) {
        return messages[errorKey];
      }
    }

    return '';
  }

  getNestedError(
    groupName: 'insuranceData' | 'paymentData',
    controlName: string,
    label: string
  ): string {
    const control = this.bookingForm.get(`${groupName}.${controlName}`);

    if (
      control &&
      control.invalid &&
      (control.touched || control.dirty) &&
      control.hasError('required')
    ) {
      return `${label} is required.`;
    }

    return '';
  }

  // =========================
  // Insurance / Payment Logic
  // =========================
  handleInsuranceChange(): void {
    this.bookingForm.get('insurance')?.valueChanges.subscribe(value => {
      this.InsurenceValue = value;
      if (value === 'yes') {
        this.showInsuranceModal = true;
        this.showPaymentModal = false;

        this.setRequiredValidators(this.insuranceForm);
        this.clearValidators(this.paymentForm);
      } else if (value === 'no') {
        this.showPaymentModal = true;
        this.showInsuranceModal = false;

        this.setRequiredValidators(this.paymentForm);
        this.clearValidators(this.insuranceForm);
      }
    });
  }

  setRequiredValidators(group: FormGroup): void {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.setValidators(Validators.required);
      group.get(key)?.updateValueAndValidity();
    });
  }

  clearValidators(group: FormGroup): void {
    Object.keys(group.controls).forEach(key => {
      group.get(key)?.clearValidators();
      group.get(key)?.updateValueAndValidity();
    });
  }

  confirmInsurance(): void {
    this.insuranceForm.markAllAsTouched();

    if (this.insuranceForm.invalid) {
      return;
    }

    this.showInsuranceModal = false;
  }

  confirmPayment(): void {
    this.paymentForm.markAllAsTouched();

    if (this.paymentForm.invalid) {
      return;
    }

    this.showPaymentModal = false;
  }

  closeInsuranceModal(): void {

    const insuranceDetailsFilled = false;
    this.bookingForm.get('insurance')?.setValue(null)


    this.showInsuranceModal = false;
  }

  closePaymentModal(): void {
    const insuranceDetailsFilled = false;
    this.bookingForm.get('insurance')?.setValue(null)


    this.showPaymentModal = false;
  }

  // =========================
  // DOB -> Age Calculation
  // =========================
  handleDobChange(): void {
    this.bookingForm.get('dateOfBirth')?.valueChanges.subscribe(() => {
      this.updateAgeFromDob();
    });
  }

  updateAgeFromDob(): void {
    const dobValue = this.bookingForm.get('dateOfBirth')?.value;
    if (!dobValue) return;

    const dob = new Date(dobValue);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years <= 0) {
      this.bookingForm.patchValue({
        age: months,
        ageType: 'months'
      });
    } else {
      this.bookingForm.patchValue({
        age: years,
        ageType: 'years'
      });
    }

    this.bookingForm.get('age')?.disable();
    this.bookingForm.get('ageType')?.disable();
  }

  // =========================
  // Form Submit
  // =========================
  submitForm(): void {
    this.bookingForm.markAllAsTouched();

    if (this.bookingForm.invalid) {
      return;
    }
    const bookingPatient = this.bookingForm.getRawValue();
    const otpDeviceDetails: any = { otpDevice: this.bookingForm.value.otpMethod, value: this.bookingForm.get('otpMethod')?.value === "mobile" ? this.bookingForm.get('phone')?.value : this.bookingForm.get('email')?.value, bookingPatient: bookingPatient }
    this.backToAvailability.emit(otpDeviceDetails);
    // { otpDevice: this.otpDevice, value: this.bookingForm.get('otp')?.value }
    console.log('Form Submitted:', this.bookingForm.getRawValue());
  }

  // =========================
  // Reset Form
  // =========================
  clearForm(): void {
    this.bookingForm.reset();

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    this.bookingForm.get('age')?.enable();
    this.bookingForm.get('ageType')?.enable();
  }


}