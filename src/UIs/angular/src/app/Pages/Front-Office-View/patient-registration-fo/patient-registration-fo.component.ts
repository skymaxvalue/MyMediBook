import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Store/app.state';
import * as AuthActions from 'src/app/Store/Auth/auth.actions';
import { selectRequestedOTP } from 'src/app/Store/Auth/auth.selectors';


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
    ReactiveFormsModule,
    RouterModule],
  templateUrl: "./patient-registration-fo.component.html",
  styleUrl: "./patient-registration-fo.component.css",
})
export class PatientRegistrationFOComponent implements OnInit {
  registrationForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  maxDateOfBirth: string = '';
  permanentStates: any[] = [];
  permanentCities: any[] = [];
  addressType: 'present' | 'permanent' = 'present';



  showInsuranceModal = false;


  showPaymentModal = false;
  paymentError: string = "";
  paymentData: any = null;
  insuranceData: any;
  insuranceError: string = "";


  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setMaxDateOfBirth();
    this.createForm();

    this.initialAPICalls();
    this.store.select(
      state => state.auth.getStates
    ).subscribe((response: any) => {

      if (!response?.data) {
        return;
      }

      if (this.addressType === 'present') {

        this.states = response.data;

        const presentAddress =
          this.registrationForm.get(
            'contactInformation.presentAddress'
          ) as FormGroup;

        presentAddress.get('stateId')?.enable();

      } else {

        this.permanentStates = response.data;

        const permanentAddress =
          this.registrationForm.get(
            'contactInformation.permanentAddress'
          ) as FormGroup;

        permanentAddress.get('stateId')?.enable();

      }

    });

    this.store.select(
      state => state.auth.getCities
    ).subscribe((response: any) => {

      if (!response?.data) {
        return;
      }

      if (this.addressType === 'present') {

        this.cities = response.data;

        const presentAddress =
          this.registrationForm.get(
            'contactInformation.presentAddress'
          ) as FormGroup;

        presentAddress.get('cityId')?.enable();

      } else {

        this.permanentCities = response.data;

        const permanentAddress =
          this.registrationForm.get(
            'contactInformation.permanentAddress'
          ) as FormGroup;

        permanentAddress.get('cityId')?.enable();

      }

    });

    // this.store.select(
    //   state => state.auth.getStates
    // ).subscribe((response: any) => {

    //   if (!response?.data) {
    //     return;
    //   }


    //   if (this.addressType === 'present') {

    //     this.states = response.data;

    //     const presentAddress =
    //       this.registrationForm.get(
    //         'contactInformation.presentAddress'
    //       ) as FormGroup;

    //     presentAddress.get('stateId')?.enable();

    //   } else {

    //     this.permanentStates = response.data;

    //     const permanentAddress =
    //       this.registrationForm.get(
    //         'contactInformation.permanentAddress'
    //       ) as FormGroup;

    //     permanentAddress.get('stateId')?.enable();

    //   }

    // });

    // this.store.select(
    //   state => state.auth.getCities
    // ).subscribe((response: any) => {

    //   if (!response?.data) {
    //     return;
    //   }


    //   if (this.addressType === 'present') {

    //     this.cities = response.data;

    //     const presentAddress =
    //       this.registrationForm.get('presentAddress') as FormGroup;

    //     presentAddress.get('cityId')?.enable();

    //   } else {

    //     this.permanentCities = response.data;

    //     const permanentAddress =
    //       this.registrationForm.get('permanentAddress') as FormGroup;

    //     permanentAddress.get('cityId')?.enable();

    //   }

    // });

    // this.registrationForm = this.fb.group({

    //   // =========================
    //   // PERSONAL DETAILS
    //   // =========================

    //   personalDetails: this.fb.group({

    //     firstName: ['', Validators.required],

    //     lastName: ['', Validators.required],

    //     gender: ['', Validators.required],

    //     dateOfBirth: ['', Validators.required],

    //     age: [
    //       { value: '', disabled: true },
    //       Validators.required
    //     ],

    //     ageUnit: [
    //       { value: 'Years', disabled: true }
    //     ],

    //     insuranceChoice: ['', Validators.required]

    //   }),


    //   // =========================
    //   // PRESENT ADDRESS
    //   // =========================

    //   presentAddress: this.fb.group({

    //     address: ['', Validators.required],

    //     country: ['', Validators.required],

    //     state: [
    //       { value: '', disabled: true },
    //       Validators.required
    //     ],

    //     cityVillage: [
    //       { value: '', disabled: true },
    //       Validators.required
    //     ],

    //     pinCode: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.pattern(/^[0-9]{6}$/)
    //       ]
    //     ],

    //     phone: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.pattern(/^[0-9]{10}$/)
    //       ]
    //     ],

    //     email: [
    //       '',
    //       Validators.email
    //     ]

    //   }),


    //   // =========================
    //   // PERMANENT ADDRESS
    //   // =========================

    //   permanentAddress: this.fb.group({

    //     sameAsPresentAddress: [false],

    //     address: ['', Validators.required],

    //     country: ['', Validators.required],

    //     state: [
    //       { value: '', disabled: true },
    //       Validators.required
    //     ],

    //     cityVillage: [
    //       { value: '', disabled: true },
    //       Validators.required
    //     ],

    //     pinCode: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.pattern(/^[0-9]{6}$/)
    //       ]
    //     ]

    //   }),


    //   // =========================
    //   // VERIFICATION
    //   // =========================

    //   verification: this.fb.group({

    //     otpMethod: ['', Validators.required]

    //   }),


    //   // =========================
    //   // INSURANCE
    //   // =========================

    //   insuranceDetails: this.fb.group({

    //     provider: [''],

    //     policy: [''],

    //     groupId: [''],

    //     holderName: [''],

    //     insuranceAddress: ['']

    //   }),


    //   // =========================
    //   // PAYMENT
    //   // =========================

    //   paymentDetails: this.fb.group({

    //     paymentType: [''],

    //     cardHolder: [''],

    //     cardNumber: [''],

    //     expiry: [''],

    //     cvv: ['']

    //   })

    // });

  }



  createForm(): void {

    this.registrationForm = this.fb.group({

      // =========================
      // PERSONAL DETAILS
      // =========================

      personalDetails: this.fb.group({

        firstName: ['', Validators.required],

        lastName: ['', Validators.required],

        gender: ['', Validators.required],

        dateOfBirth: ['', Validators.required],

        age: [
          { value: '', disabled: true },
          Validators.required
        ],

        ageUnit: [
          { value: 'Years', disabled: true }
        ],

        insuranceChoice: ['', Validators.required]

      }),


      // =========================
      // CONTACT INFORMATION
      // =========================

      contactInformation: this.fb.group({

        // =========================
        // PRESENT ADDRESS
        // =========================

        presentAddress: this.fb.group({

          address: [
            '',
            Validators.required
          ],

          countryId: [
            '',
            Validators.required
          ],

          stateId: [
            { value: '', disabled: true },
            Validators.required
          ],

          cityId: [
            { value: '', disabled: true },
            Validators.required
          ],

          pinCode: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[0-9]{6}$/)
            ]
          ],
          phoneCode: [
            '',
            Validators.required
          ],

          phone: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[0-9]{10}$/)
            ]
          ],

          email: [
            '',
            Validators.email
          ]

        }),


        // =========================
        // PERMANENT ADDRESS
        // =========================

        permanentAddress: this.fb.group({

          sameAsPresentAddress: [
            false
          ],

          address: [
            '',
            Validators.required
          ],

          countryId: [
            '',
            Validators.required
          ],

          stateId: [
            { value: '', disabled: true },
            Validators.required
          ],

          cityId: [
            { value: '', disabled: true },
            Validators.required
          ],

          pinCode: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[0-9]{6}$/)
            ]
          ]

        })

      }),


      // =========================
      // VERIFICATION
      // =========================

      verification: this.fb.group({

        otpMethod: [
          '',
          Validators.required
        ]

      }),


      // =========================
      // INSURANCE DETAILS
      // =========================

      insuranceDetails: this.fb.group({

        provider: [
          '',
          Validators.required
        ],

        policy: [
          '',
          Validators.required
        ],

        groupId: [
          ''
        ],

        holderName: [
          '',
          Validators.required
        ],

        insuranceAddress: [
          '',
          Validators.required
        ]

      }),


      // =========================
      // PAYMENT DETAILS
      // =========================

      paymentDetails: this.fb.group({

        paymentType: [
          '',
          // Validators.required
        ],

        cardHolder: [
          '',
          // Validators.required
        ],

        cardNumber: [
          '',
          // Validators.required
        ],

        expiry: [
          '',
          // Validators.required
        ],

        cvv: [
          '',
          // Validators.required
        ]

      })

    });

  }
  initialAPICalls(): void {


    this.store.dispatch(
      AuthActions.getCountries()
    );


    this.store.select(
      state => state.auth.getCountries
    ).subscribe((response: any) => {

      if (!response?.data) {
        return;
      }

      console.log("Countries:", response.data);
      this.countries = response.data;

    });

  }

  onCountryChange(event: Event): void {

    const countryId = Number(
      (event.target as HTMLSelectElement).value
    );

    const presentAddress = this.registrationForm.get(
      'contactInformation.presentAddress'
    ) as FormGroup;

    // Present address select झाला आहे हे आधी set करा
    this.addressType = 'present';

    // Reset State & City
    presentAddress.patchValue({
      stateId: '',
      cityId: ''
    });

    // Clear dropdown arrays
    this.states = [];
    this.cities = [];

    // Disable dependent dropdowns
    presentAddress.get('stateId')?.disable();
    presentAddress.get('cityId')?.disable();

    if (!countryId) {
      return;
    }

    console.log('Present Country ID:', countryId);

    // Get States API
    this.store.dispatch(
      AuthActions.getStates({
        countryId
      })
    );
  }
  onPermanentCountryChange(event: Event): void {

    const countryId =
      Number((event.target as HTMLSelectElement).value);

    const permanentAddress =
      this.registrationForm.get(
        'contactInformation.permanentAddress'
      ) as FormGroup;

    permanentAddress.patchValue({
      stateId: '',
      cityId: ''
    });

    this.permanentStates = [];
    this.permanentCities = [];

    permanentAddress.get('stateId')?.disable();
    permanentAddress.get('cityId')?.disable();

    if (!countryId) {
      return;
    }

    this.addressType = 'permanent';

    this.store.dispatch(
      AuthActions.getStates({
        countryId
      })
    );

  }


  onStateChange(event: Event): void {

    const stateId =
      Number((event.target as HTMLSelectElement).value);

    const presentAddress =
      this.registrationForm.get(
        'contactInformation.presentAddress'
      ) as FormGroup;

    presentAddress.patchValue({
      cityId: ''
    });

    this.cities = [];

    presentAddress.get('cityId')?.disable();

    if (!stateId) {
      return;
    }

    this.addressType = 'present';

    this.store.dispatch(
      AuthActions.getCities({
        stateId
      })
    );

  }
  onPermanentStateChange(event: Event): void {

    const stateId =
      Number((event.target as HTMLSelectElement).value);

    const permanentAddress =
      this.registrationForm.get(
        'contactInformation.permanentAddress'
      ) as FormGroup;

    permanentAddress.patchValue({
      cityId: ''
    });

    this.permanentCities = [];

    permanentAddress.get('cityId')?.disable();

    if (!stateId) {
      return;
    }

    this.addressType = 'permanent';

    this.store.dispatch(
      AuthActions.getCities({
        stateId
      })
    );

  }


  updateAgeFromDob(): void {
    const dobValue = this.registrationForm.get(
      'personalDetails.dateOfBirth'
    )?.value;

    const ageControl = this.registrationForm.get(
      'personalDetails.age'
    );

    const ageUnitControl = this.registrationForm.get(
      'personalDetails.ageUnit'
    );

    if (!dobValue) {
      ageControl?.setValue('');
      ageUnitControl?.setValue('Years');
      return;
    }

    const dob = new Date(`${dobValue}T00:00:00`);
    const today = new Date();

    if (
      Number.isNaN(dob.getTime()) ||
      dob > today
    ) {
      ageControl?.setValue('');
      ageUnitControl?.setValue('Years');
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

      const totalMonths = Math.max(0, months);

      ageControl?.setValue(totalMonths);

      ageUnitControl?.setValue(
        totalMonths === 1
          ? 'Month'
          : 'Months'
      );

      return;
    }

    // One year or more
    ageControl?.setValue(years);

    ageUnitControl?.setValue(
      years === 1
        ? 'Year'
        : 'Years'
    );
  }
  onInsuranceChange(): void {

    this.insuranceError = '';

    const insuranceChoice =
      this.registrationForm.get(
        'personalDetails.insuranceChoice'
      )?.value;

    if (insuranceChoice === 'yes') {

      this.showPaymentModal = false;
      this.showInsuranceModal = true;

    } else if (insuranceChoice === 'no') {

      this.showInsuranceModal = false;
      this.showPaymentModal = true;
    }
  }

  confirmInsurance(): void {

    this.insuranceError = '';

    const insuranceForm =
      this.registrationForm.get(
        'insuranceDetails'
      );

    if (!insuranceForm) {
      return;
    }

    insuranceForm.markAllAsTouched();

    if (insuranceForm.invalid) {

      this.insuranceError =
        'Please fill all required insurance details.';

      return;
    }

    const data = insuranceForm.getRawValue();

    this.insuranceData = {
      provider: data.provider?.trim() || '',
      policy: data.policy?.trim() || '',
      groupId: data.groupId?.trim() || '',
      holderName: data.holderName?.trim() || '',
      insuranceAddress:
        data.insuranceAddress?.trim() || ''
    };

    this.showInsuranceModal = false;
  }
  closeInsuranceModal(): void {

    this.showInsuranceModal = false;

    this.registrationForm
      .get('personalDetails.insuranceChoice')
      ?.setValue('');

    this.registrationForm
      .get('insuranceDetails')
      ?.reset();

    this.insuranceData = null;

    this.insuranceError = '';
  }

  closePaymentModal(): void {

    this.showPaymentModal = false;

    this.registrationForm
      .get('personalDetails.insuranceChoice')
      ?.setValue('');

    this.registrationForm
      .get('paymentDetails')
      ?.reset();

    this.paymentData = null;

    this.paymentError = '';
  }

  // =========================
  // DOB → AGE
  // =========================

  setMaxDateOfBirth(): void {
    const today = new Date();

    today.setFullYear(today.getFullYear() - 18);

    this.maxDateOfBirth = today.toISOString().split('T')[0];
  }
  confirmPayment(): void {

    this.paymentError = '';

    const paymentForm =
      this.registrationForm.get(
        'paymentDetails'
      );

    if (!paymentForm) {
      return;
    }

    paymentForm.markAllAsTouched();

    if (paymentForm.invalid) {

      this.paymentError =
        'Please fill all required payment details.';

      return;
    }

    const data = paymentForm.getRawValue();

    this.paymentData = {

      paymentType:
        data.paymentType,

      cardHolder:
        data.cardHolder?.trim() || '',

      cardNumber:
        data.cardNumber?.trim() || '',

      expiry:
        data.expiry?.trim() || '',

      cvv:
        data.cvv?.trim() || ''
    };

    this.showPaymentModal = false;
  }

  // =========================
  // FORM SUBMIT
  // =========================

  async submitRegistration(): Promise<void> {

    if (this.registrationForm.invalid) {
      console.log(this.registrationForm)
      this.registrationForm.markAllAsTouched();
      return;
    }

    const formData = this.registrationForm.getRawValue();

    console.log('Registration Data:', formData);
    await this.store.dispatch(AuthActions.requestOTP({ email: formData.contactInformation.presentAddress.email }));
    await this.store.select(selectRequestedOTP).subscribe((res: any) => {
      if (res?.data) {
        this.router.navigate(['/front-office/otp-verification-for-appointment'], {
          state: {
            registrationData: formData,
            isBookAppointment: true
          }
        })
        // API call here
      }
    })
  }


  // =========================
  // CLEAR FORM
  // =========================

  clearForm(): void {

    this.registrationForm.reset();

    this.states = [];
    this.cities = [];
    this.permanentStates = [];
    this.permanentCities = [];

    this.registrationForm
      .get('contactInformation.presentAddress.stateId')
      ?.disable();

    this.registrationForm
      .get('contactInformation.presentAddress.cityId')
      ?.disable();

    this.registrationForm
      .get('contactInformation.permanentAddress.stateId')
      ?.disable();

    this.registrationForm
      .get('contactInformation.permanentAddress.cityId')
      ?.disable();

    this.registrationForm
      .get('personalDetails.ageUnit')
      ?.setValue('Years');

    this.registrationForm
      .get('personalDetails.age')
      ?.setValue('');

    this.insuranceData = null;
    this.paymentData = null;

    this.insuranceError = '';
    this.paymentError = '';

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    this.addressType = 'present';

  }

  onSameAsPresentAddressChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    const presentAddress = this.registrationForm.get(
      'contactInformation.presentAddress'
    ) as FormGroup;

    const permanentAddress = this.registrationForm.get(
      'contactInformation.permanentAddress'
    ) as FormGroup;

    if (checked) {

      const presentValue = presentAddress.getRawValue();

      console.log('Present Address:', presentValue);

      permanentAddress.patchValue({
        address: presentValue.address,
        countryId: presentValue.countryId,
        stateId: presentValue.stateId,
        cityId: presentValue.cityId,
        pinCode: presentValue.pinCode
      });

      // Enable controls if required
      permanentAddress.get('stateId')?.enable();
      permanentAddress.get('cityId')?.enable();

      // Optional: copy dropdown lists also
      this.permanentStates = [...this.states];
      this.permanentCities = [...this.cities];

      console.log(
        'Permanent Address After Patch:',
        permanentAddress.getRawValue()
      );

    } else {

      permanentAddress.patchValue({
        address: '',
        countryId: '',
        stateId: '',
        cityId: '',
        pinCode: ''
      });

      this.permanentStates = [];
      this.permanentCities = [];

      permanentAddress.get('stateId')?.disable();
      permanentAddress.get('cityId')?.disable();
    }
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

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value
      .replace(/\D/g, '')
      .slice(0, 16);

    value = value.replace(/(.{4})/g, '$1 ').trim();

    this.registrationForm
      .get('paymentDetails.cardNumber')
      ?.setValue(value, { emitEvent: false });
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value
      .replace(/\D/g, '')
      .slice(0, 4);

    if (value.length >= 3) {
      value =
        value.substring(0, 2) +
        ' / ' +
        value.substring(2);
    }

    this.registrationForm
      .get('paymentDetails.expiry')
      ?.setValue(value, { emitEvent: false });
  }
}
