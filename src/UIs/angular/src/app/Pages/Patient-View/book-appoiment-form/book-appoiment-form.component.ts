import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { getAgeType, getRelationType } from 'src/app/Store/Appointments/appointment.actions';
import { selectAgeType, selectRelationShipType } from 'src/app/Store/Appointments/appointment.selcetors';
import { requestOTP } from 'src/app/Store/Auth/auth.actions';
import { selectRequestedOTP } from 'src/app/Store/Auth/auth.selectors';
import { getPetirntProfileListById, getProfileDataByProfileId } from 'src/app/Store/Patient/patient.action';
import { selectGetProfileDataByProfileId, selectGetProfileListByPatientId } from 'src/app/Store/Patient/patient.selectors';

@Component({
  selector: 'app-book-appoiment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './book-appoiment-form.component.html',
  styleUrl: './book-appoiment-form.component.css'
})
export class BookAppoimentFormComponent implements OnInit {
  isPatientDropdownOpen = false;
  selectedInsurance: any = null;
  selectedPatientName = signal<any | null>('Select Patient')
  @Output() backToAvailability = new EventEmitter<void>();
  patientSearch = signal('');
  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  relativeList = signal<any[]>([]);
  selectedMember = signal<any | null>(null);
  InsurenceValue: string = '';

  familyMembers = [
    {
      id: 1,
      name: 'Self',
      relation: 'Self'
    },
    {
      id: 2,
      name: 'Ramesh',
      relation: 'Father'
    },
    {
      id: 3,
      name: 'Sunita',
      relation: 'Mother'
    },
    {
      id: 4,
      name: 'Rahul',
      relation: 'Brother'
    },
    {
      id: 5,
      name: 'Raman',
      relation: 'Son'
    }
  ];

  selectedPayment: any = null;
  ageType: any[] = [];
  relations: any;
  selectedProfileData: any;
  selectMember(member: any) {
    this.selectedMember.set(member);
  }
  bookingForm!: FormGroup;
  patientType = '';
  showInsuranceModal = false;
  showPaymentModal = false;
  loginUser: any
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

  constructor(private fb: FormBuilder, private store: Store) {
    this.loginUser = JSON.parse(localStorage.getItem('user') || 'null')

  }

  ngOnInit(): void {
    this.initializeForm();
    this.handleInsuranceChange();
    this.handleDobChange();
    this.InitialApiCall();
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
      patientId: [this.loginUser.patientId],
      relationTypeId: [null, Validators.required],
      associateId: [this.doctor.associateId, Validators.required],
      slotId: [this.selectedSlot.slotId, Validators.required],
      profileId: [0],
      dateOfBirth: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      ageTypeId: [null, Validators.required],
      gender: ['', Validators.required],
      insurance: ['', Validators.required],

      insuranceData: this.fb.group({
        provider: [''],
        policy: [''],
        groupId: [0],
        holderName: [''],
        address: []
      }),

      paymentData: this.fb.group({
        paymentType: ['', Validators.required],

        cardHolder: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-zA-Z ]+$/)
          ]
        ],

        cardNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{13,19}$/),
            this.luhnValidator.bind(this)
          ]
        ],

        expiry: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
            this.expiryValidator.bind(this)
          ]
        ],

        cvv: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{3,4}$/)
          ]
        ]
      }),
      patientType: [this.patientType],

      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      visitPurpose: ['', [Validators.required, Validators.minLength(5)]],
      visitType: ['', Validators.required],
      otpMethod: ['', Validators.required],
      createdBy: [this.loginUser.roleName],
      associateRole: [this.doctor.department]
    });
  }

  formatCardNumber(event: Event): void {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 19);

    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';

    input.value = formatted;

    this.paymentForm
      .get('cardNumber')
      ?.setValue(formatted, { emitEvent: false });

    this.paymentForm
      .get('cardNumber')
      ?.updateValueAndValidity();
  }

  formatExpiry(event: Event): void {

    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }

    input.value = value;

    this.paymentForm
      .get('expiry')
      ?.setValue(value, { emitEvent: false });

    this.paymentForm
      .get('expiry')
      ?.updateValueAndValidity();
  }
  getPaymentError(controlName: string): string {

    const control = this.paymentForm.get(controlName);

    if (!control || !(control.touched || control.dirty)) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getPaymentLabel(controlName)} is required.`;
    }

    if (controlName === 'cardHolder') {

      if (control.hasError('minlength')) {
        return 'Card holder name must be at least 2 characters.';
      }

      if (control.hasError('pattern')) {
        return 'Card holder name can contain only letters.';
      }
    }

    if (controlName === 'cardNumber') {

      if (control.hasError('pattern')) {
        return 'Card number must contain 13 to 19 digits.';
      }

      if (control.hasError('invalidCardNumber')) {
        return 'Please enter a valid card number.';
      }
    }

    if (controlName === 'expiry') {

      if (control.hasError('pattern')) {
        return 'Expiry must be in MM/YY format.';
      }

      if (control.hasError('expiredCard')) {
        return 'Card has expired.';
      }

      if (control.hasError('invalidExpiry')) {
        return 'Please enter a valid expiry date.';
      }
    }

    if (controlName === 'cvv') {

      if (control.hasError('pattern')) {
        return 'CVV must contain 3 or 4 digits.';
      }
    }

    return '';
  }

  getPaymentLabel(controlName: string): string {

    const labels: any = {
      paymentType: 'Payment Type',
      cardHolder: 'Card Holder Name',
      cardNumber: 'Card Number',
      expiry: 'Expiry Date',
      cvv: 'CVV'
    };

    return labels[controlName] || controlName;
  }
  expiryValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const value = String(control.value).trim();

    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value)) {
      return { invalidExpiry: true };
    }

    const [monthString, yearString] = value.split('/');

    const month = Number(monthString);
    const year = 2000 + Number(yearString);

    const today = new Date();

    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    ) {
      return { expiredCard: true };
    }

    return null;
  }

  togglePatientDropdown() {
    this.isPatientDropdownOpen = !this.isPatientDropdownOpen;
  }
  InitialApiCall() {
    this.store.dispatch(getPetirntProfileListById({ patientId: this.loginUser.refId }));
    this.store.dispatch(getAgeType())
    this.store.dispatch(getRelationType())
    this.store.select(selectAgeType).subscribe((res: any) => {
      if (res) {
        console.log(res.data)
        this.ageType = res.data
      }
    })
    this.store.select(selectRelationShipType).subscribe((res: any) => {
      if (res) {
        console.log(res.data)
        this.relations = res.data
      }
    })
    this.store.select(selectGetProfileListByPatientId).subscribe((res: any) => {
      if (res) {
        console.log("Profile List", '============++++++++', res);
        console.log(res.data, "=======>")
        this.relativeList.set(res.data)

      }
    })
  }
  luhnValidator(control: AbstractControl): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const cardNumber = String(control.value).replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cardNumber)) {
      return null;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {

      let digit = parseInt(cardNumber.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0
      ? null
      : { invalidCardNumber: true };
  }

  // async onProfileChange(event: any) {
  //   await this.store.dispatch(getProfileDataByProfileId({ profileId: event.profileId }))
  //   this.store.select(selectGetProfileDataByProfileId).subscribe((res: any) => {
  //     if (res) {
  //       this.selectedProfileData = res.data
  //       console.log("Profile Data", '============++++++++', res);
  //       this.selectedPatientName.set(event.fullName)
  //       this.bookingForm.patchValue(event)
  //       this.bookingForm.get('phone')?.setValue(event.phoneNumber)
  //       this.bookingForm.get('insuranceData')?.setValue(res.data.insuranceData)
  //       const dob = event.dateOfBirth;

  //       const date = new Date(dob);

  //       const formattedDate =
  //         `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  //       this.bookingForm.patchValue({
  //         dateOfBirth: formattedDate
  //       });
  //       this.isPatientDropdownOpen = false
  //     }
  //   })


  // }
  async onProfileChange(event: any) {
    this.store.dispatch(
      getProfileDataByProfileId({ profileId: event.profileId })
    );

    this.store.select(selectGetProfileDataByProfileId).subscribe((res: any) => {
      if (!res?.data) {
        return;
      }

      this.selectedProfileData = res.data;

      console.log('Profile Data:', res.data);

      this.selectedPatientName.set(event.fullName);

      // Patch basic patient information
      this.bookingForm.patchValue({
        firstName: event.firstName,
        lastName: event.lastName,
        profileId: event.profileId,
        relationTypeId: event.relationTypeId,
        gender: event.gender,
        address: event.address,
        email: event.email,
        phone: event.phoneNumber
      });

      // DOB
      if (event.dateOfBirth) {
        const date = new Date(event.dateOfBirth);

        const formattedDate =
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        this.bookingForm.patchValue({
          dateOfBirth: formattedDate
        });
      }

      // ==============================
      // INSURANCE HANDLING
      // ==============================

      const insuranceData = res.data.insuranceData;

      if (insuranceData) {

        // Existing insurance details available
        console.log('Existing Insurance:', insuranceData);

        this.bookingForm.patchValue({
          insurance: null
        });

        this.insuranceForm.patchValue({
          provider: insuranceData.provider || '',
          policy: insuranceData.policy || '',
          groupId: insuranceData.groupId || 0,
          holderName: insuranceData.holderName || '',
          address: insuranceData.address || ''
        });

      } else {

        // No insurance details available
        console.log('No existing insurance details');

        this.bookingForm.patchValue({
          insurance: null
        });

        this.insuranceForm.reset({
          provider: '',
          policy: '',
          groupId: 0,
          holderName: '',
          address: ''
        });
      }

      this.isPatientDropdownOpen = false;
    });
  }



  get insuranceForm(): FormGroup {
    return this.bookingForm.get('insuranceData') as FormGroup;
  }

  get paymentForm(): FormGroup {
    return this.bookingForm.get('paymentData') as FormGroup;
  }

  selectInsurance(insurance: any): void {
    this.selectedInsurance = insurance;

    this.insuranceForm.patchValue({
      provider: insurance.provider || '',
      policy: insurance.policy || '',
      groupId: insurance.groupId || '',
      holderName: insurance.holderName || '',
      address: insurance.address || ''
    });
  }


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
  filteredPatients = computed(() => {

    const search = this.patientSearch().trim().toLowerCase();

    if (!search) {
      return this.relativeList();
    }

    return this.relativeList().filter(patient =>
      patient.fullName.toLowerCase().includes(search) ||
      patient.relationTypeName.toLowerCase().includes(search)
    );

  });

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
  selectPayment(payment: any): void {

    this.selectedPayment = payment;

    this.paymentForm.patchValue({
      paymentType: payment.paymentType || '',
      cardHolder: payment.cardHolder || '',
      cardNumber: payment.cardNumber || '',
      expiry: payment.expiry || '',
      cvv: ''
    });

  }


  maskCardNumber(cardNumber: string): string {

    if (!cardNumber) {
      return '-';
    }

    const value = String(cardNumber).replace(/\s/g, '');

    if (value.length <= 4) {
      return value;
    }

    return `**** **** **** ${value.slice(-4)}`;
  }
  handleInsuranceChange(): void {

    this.bookingForm.get('insurance')?.valueChanges.subscribe(value => {

      this.InsurenceValue = value;

      if (value === 'yes') {

        // User wants to CHANGE insurance
        this.showInsuranceModal = true;
        this.showPaymentModal = false;

        // Clear existing insurance details from form
        this.insuranceForm.reset({
          provider: '',
          policy: '',
          groupId: '',
          holderName: '',
          address: ''
        });

        // Insurance form required
        this.setRequiredValidators(this.insuranceForm);

        // Payment not required
        this.clearValidators(this.paymentForm);

      } else if (value === 'no') {

        // User does not want insurance change
        // → Payment modal
        this.showInsuranceModal = false;
        this.showPaymentModal = true;

        this.clearValidators(this.insuranceForm);
        this.setRequiredValidators(this.paymentForm);
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

  OnSelectRelationShip(event: any) {
    const select = event.target as HTMLSelectElement;
    console.log(select)


    // if (event.target.value === "Self") {
    //   this.bookingForm.get('firstName')?.setValue(this.loginUser.data.firstName);
    //   this.bookingForm.get('lastName')?.setValue(this.loginUser.data.lastName);
    //   this.bookingForm.get('email')?.setValue(this.loginUser.data.email);
    //   this.bookingForm.get('gender')?.setValue(this.loginUser.data.gender);
    //   this.bookingForm.get('phone')?.setValue(this.loginUser.data.phoneNumber);
    //   this.bookingForm.get('address')?.setValue(`${this.loginUser.data.addressLine1}  ${this.loginUser.data.addressLine2} `);
    //   const dob = this.loginUser.data.dateOfBirth
    //     ? new Date(this.loginUser.data.dateOfBirth).toISOString().split('T')[0]
    //     : null;

    //   this.bookingForm.patchValue({
    //     dateOfBirth: dob
    //   });
    //   // this.bookingForm.get('firstName')?.setValue(this.loginUser.data.firstName);


    //   console.log(this.loginUser.data)
    // }
  }
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
    let days = today.getDate() - dob.getDate();

    // Days adjust
    if (days < 0) {
      months--;

      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
    }

    // Months adjust
    if (months < 0) {
      years--;
      months += 12;
    }

    console.log({
      years,
      months,
      days
    });

    if (years > 0) {
      this.bookingForm.patchValue({
        age: years,
        ageTypeId: this.ageType[2].ageTypeId
      });
    } else if (months > 0) {
      this.bookingForm.patchValue({
        age: months,
        ageTypeId: this.ageType[1].ageTypeId
      });
    } else {
      this.bookingForm.patchValue({
        age: days,
        ageTypeId: this.ageType[0].ageTypeId
      });
    }

    this.bookingForm.get('age')?.disable();
    this.bookingForm.get('ageTypeId')?.disable();
  }

  allowOnlyText(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  async submitForm() {
    console.log(this.bookingForm, this.bookingForm.invalid)
    this.bookingForm.markAllAsTouched();

    if (this.bookingForm.invalid) {
      return;
    } else {
      const bookingPatient = this.bookingForm.getRawValue();
      delete bookingPatient.patientType
      if (bookingPatient.insurance === "yes") {
        bookingPatient.insurance = true
        // delete bookingPatient.paymentData
      }
      if (bookingPatient.insurance === "no") {

        bookingPatient.insurance = false
        // delete bookingPatient.insuranceData
      }
      await this.store.dispatch(requestOTP({ email: this.bookingForm.get('email')?.value }))
      await this.store.select(selectRequestedOTP).subscribe((res: any) => {
        if (res) {
          const otpDeviceDetails: any = { otpDevice: this.bookingForm.value.otpMethod, value: this.bookingForm.get('otpMethod')?.value === "mobile" ? this.bookingForm.get('phone')?.value : this.bookingForm.get('email')?.value, bookingPatient: bookingPatient }
          this.backToAvailability.emit(otpDeviceDetails);
          // { otpDevice: this.otpDevice, value: this.bookingForm.get('otp')?.value }
          console.log('Form Submitted:', this.bookingForm.getRawValue());
        }
      })


    }
  }


  clearForm(): void {
    this.bookingForm.reset();

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    this.bookingForm.get('age')?.enable();
    this.bookingForm.get('ageType')?.enable();
  }


}