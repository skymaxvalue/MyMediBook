import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  NgForm
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


interface InsuranceData {
  provider: string;
  policy: string;
  groupId: string;
  holderName: string;
  insuranceAddress: string;
}

interface PaymentData {
  paymentType: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface Appointment {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  age: number | '';
  ageUnit: string;
  gender: string;
  address: string;
  cityVillage: string;
  state: string;
  pinCode: string;
  insurance: string;
  insuranceData: InsuranceData | null;
  paymentData: PaymentData | null;
  otpMethod: string;
}

@Component({
  selector: "app-patient-registration-fo",
  imports: [CommonModule,
    FormsModule,
    RouterModule],
  templateUrl: "./patient-registration-fo.component.html",
  styleUrl: "./patient-registration-fo.component.css",
})
export class PatientRegistrationFOComponent {


  firstName = '';
  lastName = '';
  phone = '';
  email = '';

  dateOfBirth = '';
  age: number | '' = '';
  ageUnit = 'Years';

  gender = '';

  address = '';
  cityVillage = '';
  state = '';
  pinCode = '';

  insuranceChoice = '';

  otpMethod = '';


  // =========================
  // INSURANCE
  // =========================

  showInsuranceModal = false;

  insuranceData: InsuranceData | null = null;

  provider = '';
  policy = '';
  groupId = '';
  holderName = '';
  insuranceAddress = '';

  insuranceError = '';


  // =========================
  // PAYMENT
  // =========================

  showPaymentModal = false;

  paymentData: PaymentData | null = null;

  paymentType = '';
  cardHolder = '';
  cardNumber = '';
  expiry = '';
  cvv = '';

  paymentError = '';


  constructor(
    private router: Router
  ) { }


  // =========================
  // DOB → AGE
  // =========================

  updateAgeFromDob(): void {

    if (!this.dateOfBirth) {
      this.age = '';
      this.ageUnit = 'Years';
      return;
    }

    const dob = new Date(this.dateOfBirth + 'T00:00:00');
    const today = new Date();

    if (
      Number.isNaN(dob.getTime()) ||
      dob > today
    ) {
      this.age = '';
      this.ageUnit = 'Years';
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

    if (years <= 0) {

      const totalMonths =
        Math.max(0, months);

      this.age = totalMonths;

      this.ageUnit =
        totalMonths === 1
          ? 'Month'
          : 'Months';

      return;
    }

    this.age = years;

    this.ageUnit =
      years === 1
        ? 'Year'
        : 'Years';
  }


  // =========================
  // INSURANCE
  // =========================

  onInsuranceChange(): void {

    this.insuranceError = '';

    if (this.insuranceChoice === 'yes') {

      this.showInsuranceModal = true;

    }

    if (this.insuranceChoice === 'no') {

      this.showPaymentModal = true;

    }
  }


  closeInsuranceModal(): void {

    this.showInsuranceModal = false;

    this.insuranceChoice = '';

    this.insuranceData = null;

    this.provider = '';
    this.policy = '';
    this.groupId = '';
    this.holderName = '';
    this.insuranceAddress = '';

    this.insuranceError = '';
  }


  confirmInsurance(): void {

    this.insuranceError = '';

    if (
      !this.provider.trim() ||
      !this.policy.trim() ||
      !this.holderName.trim() ||
      !this.insuranceAddress.trim()
    ) {

      this.insuranceError =
        'Please fill all required insurance details.';

      return;
    }

    this.insuranceData = {

      provider: this.provider.trim(),

      policy: this.policy.trim(),

      groupId: this.groupId.trim(),

      holderName:
        this.holderName.trim(),

      insuranceAddress:
        this.insuranceAddress.trim()
    };

    this.showInsuranceModal = false;
  }


  // =========================
  // PAYMENT
  // =========================

  closePaymentModal(): void {

    this.showPaymentModal = false;

    this.insuranceChoice = '';

    this.paymentData = null;

    this.paymentType = '';
    this.cardHolder = '';
    this.cardNumber = '';
    this.expiry = '';
    this.cvv = '';

    this.paymentError = '';
  }


  confirmPayment(): void {

    this.paymentError = '';

    if (
      !this.paymentType ||
      !this.cardHolder.trim() ||
      !this.cardNumber.trim() ||
      !this.expiry.trim() ||
      !this.cvv.trim()
    ) {

      this.paymentError =
        'Please fill all required payment details.';

      return;
    }

    this.paymentData = {

      paymentType:
        this.paymentType,

      cardHolder:
        this.cardHolder.trim(),

      cardNumber:
        this.cardNumber.trim(),

      expiry:
        this.expiry.trim(),

      cvv:
        this.cvv.trim()
    };

    this.showPaymentModal = false;
  }


  // =========================
  // FORM SUBMIT
  // =========================

  submitRegistration(form: NgForm): void {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;
    }

    // Insurance validation
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

    const appointment: Appointment = {

      firstName:
        this.firstName.trim(),

      lastName:
        this.lastName.trim(),

      phone:
        this.phone.trim(),

      email:
        this.email.trim(),

      dateOfBirth:
        this.dateOfBirth,

      age:
        this.age,

      ageUnit:
        this.ageUnit,

      gender:
        this.gender,

      address:
        this.address.trim(),

      cityVillage:
        this.cityVillage.trim(),

      state:
        this.state,

      pinCode:
        this.pinCode.trim(),

      insurance:
        this.insuranceChoice,

      insuranceData:
        this.insuranceData,

      paymentData:
        this.paymentData,

      otpMethod:
        this.otpMethod
    };


    // Save appointment
    localStorage.setItem(
      'tempAppointment',
      JSON.stringify(appointment)
    );


    // Navigation
    if (this.otpMethod === 'none') {

      this.router.navigate([
        '/patient-registration-success'
      ]);

      return;
    }


    this.router.navigate([
      '/registration-otp'
    ]);
  }


  // =========================
  // CLEAR FORM
  // =========================

  clearForm(form: NgForm): void {

    form.resetForm();

    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.email = '';

    this.dateOfBirth = '';
    this.age = '';
    this.ageUnit = 'Years';

    this.gender = '';

    this.address = '';
    this.cityVillage = '';
    this.state = '';
    this.pinCode = '';

    this.insuranceChoice = '';
    this.otpMethod = '';

    this.insuranceData = null;
    this.paymentData = null;

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    this.provider = '';
    this.policy = '';
    this.groupId = '';
    this.holderName = '';
    this.insuranceAddress = '';

    this.paymentType = '';
    this.cardHolder = '';
    this.cardNumber = '';
    this.expiry = '';
    this.cvv = '';
  }


  // =========================
  // INPUT HELPERS
  // =========================

  allowOnlyNumbers(event: KeyboardEvent): void {

    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab'
    ];

    if (
      allowedKeys.includes(event.key)
    ) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }


  formatCardNumber(): void {

    this.cardNumber =
      this.cardNumber
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
  }


  formatExpiry(): void {

    let value =
      this.expiry.replace(/\D/g, '');

    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    if (value.length >= 3) {

      this.expiry =
        value.substring(0, 2) +
        ' / ' +
        value.substring(2);

    } else {

      this.expiry = value;
    }
  }
}
