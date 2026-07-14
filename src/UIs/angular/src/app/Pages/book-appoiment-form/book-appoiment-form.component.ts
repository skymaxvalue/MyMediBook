import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import { getAgeType, getRelationType } from 'src/app/Store/Appointments/appointment.actions';
import { selectAgeType, selectRelationShipType } from 'src/app/Store/Appointments/appointment.selcetors';
import { getProfileDataByProfileId } from 'src/app/Store/Patient/patient.action';
import { selectGetProfileDataByProfileId, selectGetProfileListByPatientId } from 'src/app/Store/Patient/patient.selectors';

@Component({
  selector: 'app-book-appoiment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './book-appoiment-form.component.html',
  styleUrl: './book-appoiment-form.component.css'
})
export class BookAppoimentFormComponent implements OnInit {
  isPatientDropdownOpen = false;
  selectedPatientName = signal<any | null>(null)
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

  ageType: any[] = [];
  relations: any;
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
        address: ['']
      }),

      paymentData: this.fb.group({
        paymentType: [''],
        cardHolder: [''],
        cardNumber: [''],
        expiry: [''],
        cvv: ['']
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

  togglePatientDropdown() {
    this.isPatientDropdownOpen = !this.isPatientDropdownOpen;
  }
  InitialApiCall() {
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
        console.log(res.data, "=======>")
        this.relativeList.set(res.data)

      }
    })
  }

  async onProfileChange(event: any) {


    this.bookingForm.patchValue(event)
    this.bookingForm.get('phone')?.setValue(event.phoneNumber)
    const dob = event.dateOfBirth;

    const date = new Date(dob);

    const formattedDate =
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    this.bookingForm.patchValue({
      dateOfBirth: formattedDate
    });

  }



  get insuranceForm(): FormGroup {
    return this.bookingForm.get('insuranceData') as FormGroup;
  }

  get paymentForm(): FormGroup {
    return this.bookingForm.get('paymentData') as FormGroup;
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

  submitForm(): void {
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
      const otpDeviceDetails: any = { otpDevice: this.bookingForm.value.otpMethod, value: this.bookingForm.get('otpMethod')?.value === "mobile" ? this.bookingForm.get('phone')?.value : this.bookingForm.get('email')?.value, bookingPatient: bookingPatient }
      this.backToAvailability.emit(otpDeviceDetails);
      // { otpDevice: this.otpDevice, value: this.bookingForm.get('otp')?.value }
      console.log('Form Submitted:', this.bookingForm.getRawValue());

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