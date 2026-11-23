import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import * as AuthActions from "src/app/Store/Auth/auth.actions";
import { selectRequestedOTP } from "src/app/Store/Auth/auth.selectors";

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
  age: number | "";
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
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./patient-registration-fo.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./patient-registration-fo.component.css",
})
export class PatientRegistrationFOComponent implements OnInit {
  registrationForm!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  maxDateOfBirth: string = "";
  permanentStates: any[] = [];
  permanentCities: any[] = [];
  addressType: "present" | "permanent" = "present";

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
    this.restoreRegistrationData();
    this.store
      .select((state) => state.auth.getStates)
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        if (this.addressType === "present") {
          this.states = response;

          const presentAddress = this.registrationForm.get(
            "contactInformation.presentAddress"
          ) as FormGroup;

          presentAddress.get("stateId")?.enable();
        } else {
          this.permanentStates = response;

          const permanentAddress = this.registrationForm.get(
            "contactInformation.permanentAddress"
          ) as FormGroup;

          permanentAddress.get("stateId")?.enable();
        }
      });

    this.store
      .select((state) => state.auth.getCities)
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        if (this.addressType === "present") {
          this.cities = response;

          const presentAddress = this.registrationForm.get(
            "contactInformation.presentAddress"
          ) as FormGroup;

          presentAddress.get("cityId")?.enable();
        } else {
          this.permanentCities = response.data;

          const permanentAddress = this.registrationForm.get(
            "contactInformation.permanentAddress"
          ) as FormGroup;

          permanentAddress.get("cityId")?.enable();
        }
      });

  }

  createForm(): void {
    this.registrationForm = this.fb.group({
      // =========================
      // PERSONAL DETAILS
      // =========================

      personalDetails: this.fb.group({
        firstName: ["", Validators.required],

        lastName: ["", Validators.required],

        gender: ["", Validators.required],

        dateOfBirth: ["", Validators.required],

        age: [{ value: "", disabled: true }, Validators.required],

        ageUnit: [{ value: "Years", disabled: true }],

        insuranceChoice: ["", Validators.required],
      }),

      // =========================
      // CONTACT INFORMATION
      // =========================

      contactInformation: this.fb.group({
        // =========================
        // CONTACT DETAILS
        // =========================

        phoneCode: ["", Validators.required],

        phone: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

        email: ["", Validators.email],

        // =========================
        // PRESENT ADDRESS
        // =========================

        presentAddress: this.fb.group({
          address: ["", Validators.required],

          countryId: ["", Validators.required],

          stateId: [{ value: "", disabled: true }, Validators.required],

          cityId: [{ value: "", disabled: true }, Validators.required],

          pinCode: ["", [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        }),

        // =========================
        // PERMANENT ADDRESS
        // =========================

        permanentAddress: this.fb.group({
          sameAsPresentAddress: [false],

          address: ["", Validators.required],

          countryId: ["", Validators.required],

          stateId: [{ value: "", disabled: true }, Validators.required],

          cityId: [{ value: "", disabled: true }, Validators.required],

          pinCode: ["", [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
        }),
      }),

      // =========================
      // VERIFICATION
      // =========================

      verification: this.fb.group({
        otpMethod: ["", Validators.required],
      }),

      // =========================
      // INSURANCE DETAILS
      // =========================

      insuranceDetails: this.fb.group({
        provider: ["", Validators.required],

        policy: ["", Validators.required],

        groupId: [""],

        holderName: ["", Validators.required],

        insuranceAddress: ["", Validators.required],
      }),

      // =========================
      // PAYMENT DETAILS
      // =========================

      paymentDetails: this.fb.group({
        paymentType: [''],

        cardHolder: [''],

        cardNumber: [
          '',
          [

            Validators.pattern(/^(\d{4} ){3}\d{4}$/)
          ]
        ],

        expiry: [
          '',
          [

            Validators.pattern(/^(0[1-9]|1[0-2]) \/ \d{2}$/)
          ]
        ],

        cvv: [
          '',
          [

            Validators.pattern(/^[0-9]{3}$/)
          ]
        ]
      }),
    });
  }
  initialAPICalls(): void {
    console.log("Dispatching getCountries action");
    this.store.dispatch(AuthActions.getCountries());

    this.store
      .select((state) => state.auth.getCountries)
      .subscribe((response: any) => {
        if (!response) {
          return;
        }

        this.countries = response;
      });
  }

  onCountryChange(event: Event): void {
    const countryId = Number((event.target as HTMLSelectElement).value);

    const presentAddress = this.registrationForm.get(
      "contactInformation.presentAddress"
    ) as FormGroup;


    this.addressType = "present";

    // Reset State & City
    presentAddress.patchValue({
      stateId: "",
      cityId: "",
    });

    // Clear dropdown arrays
    this.states = [];
    this.cities = [];

    // Disable dependent dropdowns
    presentAddress.get("stateId")?.disable();
    presentAddress.get("cityId")?.disable();

    if (!countryId) {
      return;
    }


    // Get States API
    this.store.dispatch(
      AuthActions.getStates({
        countryId,
      })
    );
  }
  onPermanentCountryChange(event: Event): void {
    const countryId = Number((event.target as HTMLSelectElement).value);

    const permanentAddress = this.registrationForm.get(
      "contactInformation.permanentAddress"
    ) as FormGroup;

    permanentAddress.patchValue({
      stateId: "",
      cityId: "",
    });

    this.permanentStates = [];
    this.permanentCities = [];

    permanentAddress.get("stateId")?.disable();
    permanentAddress.get("cityId")?.disable();

    if (!countryId) {
      return;
    }

    this.addressType = "permanent";

    this.store.dispatch(
      AuthActions.getStates({
        countryId,
      })
    );
  }

  restoreRegistrationData(): void {
    const state = history.state;

    if (!state?.restoreRegistration || !state?.registrationData) {
      return;
    }

    const savedData = state.registrationData;

    this.registrationForm.patchValue(savedData);

    // Present Address
    const presentAddress = this.registrationForm.get(
      "contactInformation.presentAddress"
    ) as FormGroup;

    // Permanent Address
    const permanentAddress = this.registrationForm.get(
      "contactInformation.permanentAddress"
    ) as FormGroup;

    if (presentAddress.get("stateId")?.value) {
      presentAddress.get("stateId")?.enable();
    }

    if (presentAddress.get("cityId")?.value) {
      presentAddress.get("cityId")?.enable();
    }

    if (permanentAddress.get("stateId")?.value) {
      permanentAddress.get("stateId")?.enable();
    }

    if (permanentAddress.get("cityId")?.value) {
      permanentAddress.get("cityId")?.enable();
    }


    this.updateAgeFromDob();

    this.addressType = "present";
    history.replaceState(
      { ...state, restoreRegistration: false, registrationData: null },
      ""
    );
  }
  onStateChange(event: Event): void {
    const stateId = Number((event.target as HTMLSelectElement).value);

    const presentAddress = this.registrationForm.get(
      "contactInformation.presentAddress"
    ) as FormGroup;

    presentAddress.patchValue({
      cityId: "",
    });

    this.cities = [];

    presentAddress.get("cityId")?.disable();

    if (!stateId) {
      return;
    }

    this.addressType = "present";

    this.store.dispatch(
      AuthActions.getCities({
        stateId,
      })
    );
  }
  onPermanentStateChange(event: Event): void {
    const stateId = Number((event.target as HTMLSelectElement).value);

    const permanentAddress = this.registrationForm.get(
      "contactInformation.permanentAddress"
    ) as FormGroup;

    permanentAddress.patchValue({
      cityId: "",
    });

    this.permanentCities = [];

    permanentAddress.get("cityId")?.disable();

    if (!stateId) {
      return;
    }

    this.addressType = "permanent";

    this.store.dispatch(
      AuthActions.getCities({
        stateId,
      })
    );
  }

  logInvalidControls(formGroup: FormGroup, parentKey = ''): void {

    Object.keys(formGroup.controls).forEach(key => {

      const control = formGroup.get(key);
      const controlName = parentKey ? `${parentKey}.${key}` : key;

      if (control instanceof FormGroup) {

        this.logInvalidControls(control, controlName);

      } else if (control?.invalid) {

        console.log('Invalid Field:', controlName);
        console.log('Errors:', control.errors);
        console.log('Value:', control.value);

      }

    });

  }

  updateAgeFromDob(): void {
    const dobValue = this.registrationForm.get("personalDetails.dateOfBirth")?.value;

    const ageControl = this.registrationForm.get("personalDetails.age");

    const ageUnitControl = this.registrationForm.get("personalDetails.ageUnit");

    if (!dobValue) {
      ageControl?.setValue("");
      ageUnitControl?.setValue("Years");
      return;
    }

    const dob = new Date(`${dobValue}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(dob.getTime()) || dob > today) {
      ageControl?.setValue("");
      ageUnitControl?.setValue("Years");
      return;
    }

    let years = today.getFullYear() - dob.getFullYear();

    let months = today.getMonth() - dob.getMonth();

    const days = today.getDate() - dob.getDate();

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

      ageUnitControl?.setValue(totalMonths === 1 ? "Month" : "Months");

      return;
    }

    // One year or more
    ageControl?.setValue(years);

    ageUnitControl?.setValue(years === 1 ? "Year" : "Years");
  }
  onInsuranceChange(): void {

    const insuranceChoice = this.registrationForm.get(
      'personalDetails.insuranceChoice'
    )?.value;

    const insuranceGroup = this.registrationForm.get(
      'insuranceDetails'
    ) as FormGroup;

    const requiredFields = [
      'provider',
      'policy',
      'holderName',
      'insuranceAddress'
    ];

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    if (insuranceChoice === 'yes') {

      this.updatePaymentValidators(false);

      requiredFields.forEach(field => {
        insuranceGroup.get(field)?.setValidators([
          Validators.required
        ]);
        insuranceGroup.get(field)?.updateValueAndValidity();
      });

      this.insuranceError = '';
      this.showInsuranceModal = true;

    } else if (insuranceChoice === 'no') {

      requiredFields.forEach(field => {
        insuranceGroup.get(field)?.clearValidators();
        insuranceGroup.get(field)?.updateValueAndValidity();
      });

      insuranceGroup.reset();

      this.insuranceError = '';

      this.updatePaymentValidators(true);

      this.showPaymentModal = true;

    }

  }

  updatePaymentValidators(isRequired: boolean): void {

    const paymentGroup = this.registrationForm.get(
      'paymentDetails'
    ) as FormGroup;

    Object.keys(paymentGroup.controls).forEach(field => {

      const control = paymentGroup.get(field);

      if (isRequired) {

        if (field === 'cardNumber') {
          control?.setValidators([
            Validators.required,
            Validators.pattern(/^(\d{4} ){3}\d{4}$/)
          ]);
        }
        else if (field === 'expiry') {
          control?.setValidators([
            Validators.required,
            Validators.pattern(/^(0[1-9]|1[0-2]) \/ \d{2}$/)
          ]);
        }
        else if (field === 'cvv') {
          control?.setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]{3}$/)
          ]);
        }
        else {
          control?.setValidators([Validators.required]);
        }

      } else {

        control?.clearValidators();
        control?.setErrors(null);

      }

      control?.updateValueAndValidity();

    });

  }

  confirmInsurance(): void {
    const insuranceGroup = this.registrationForm.get(
      'insuranceDetails'
    ) as FormGroup;

    if (insuranceGroup.invalid) {
      insuranceGroup.markAllAsTouched();
      this.insuranceError = 'Please fill all required insurance details.';
      return;
    }

    this.insuranceError = '';
    this.showInsuranceModal = false;
    // this.showPaymentModal = true;
  }
  closeInsuranceModal(): void {
    this.showInsuranceModal = false;

    this.registrationForm.get("personalDetails.insuranceChoice")?.setValue("");

    this.registrationForm.get("insuranceDetails")?.reset();

    this.insuranceData = null;

    this.insuranceError = "";
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;

    this.registrationForm.get("personalDetails.insuranceChoice")?.setValue("");

    this.registrationForm.get("paymentDetails")?.reset();

    this.paymentData = null;

    this.paymentError = "";
  }

  // =========================
  // DOB → AGE
  // =========================

  setMaxDateOfBirth(): void {
    const today = new Date();

    today.setFullYear(today.getFullYear() - 18);

    this.maxDateOfBirth = today.toISOString().split("T")[0];
  }
  confirmPayment(): void {
    const paymentGroup = this.registrationForm.get(
      'paymentDetails'
    ) as FormGroup;

    if (paymentGroup.invalid) {
      paymentGroup.markAllAsTouched();
      this.paymentError = 'Please fill all required payment details.';
      return;
    }

    this.paymentError = '';
    this.showPaymentModal = false;
  }

  // =========================
  // FORM SUBMIT
  // =========================

  async submitRegistration(): Promise<void> {
    if (this.registrationForm.invalid) {
      // console.log("Form is invalid");

      // console.log("Form Errors:", this.registrationForm.errors);

      // console.log("Form Values:", this.registrationForm.getRawValue());
      this.logInvalidControls(this.registrationForm);

      this.registrationForm.markAllAsTouched();
      return;
    }

    const formData = this.registrationForm.getRawValue();

    // console.log("Registration Data:", formData);
    await this.store.dispatch(AuthActions.requestOTP({ email: formData.contactInformation.email }));
    await this.store.select(selectRequestedOTP).subscribe((res: any) => {
      if (res?.data) {
        this.router.navigate(["/front-office/otp-verification-for-registration"], {
          state: {
            registrationData: formData,
            isRegisterPatient: true,
          },
        });
        // API call here
      }
    });
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

    this.registrationForm.get("contactInformation.presentAddress.stateId")?.disable();

    this.registrationForm.get("contactInformation.presentAddress.cityId")?.disable();

    this.registrationForm.get("contactInformation.permanentAddress.stateId")?.disable();

    this.registrationForm.get("contactInformation.permanentAddress.cityId")?.disable();

    this.registrationForm.get("personalDetails.ageUnit")?.setValue("Years");

    this.registrationForm.get("personalDetails.age")?.setValue("");

    this.insuranceData = null;
    this.paymentData = null;

    this.insuranceError = "";
    this.paymentError = "";

    this.showInsuranceModal = false;
    this.showPaymentModal = false;

    this.addressType = "present";
  }

  onSameAsPresentAddressChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    const presentAddress = this.registrationForm.get(
      "contactInformation.presentAddress"
    ) as FormGroup;

    const permanentAddress = this.registrationForm.get(
      "contactInformation.permanentAddress"
    ) as FormGroup;

    if (checked) {
      const presentValue = presentAddress.getRawValue();

      // console.log("Present Address:", presentValue);

      permanentAddress.patchValue({
        address: presentValue.address,
        countryId: presentValue.countryId,
        stateId: presentValue.stateId,
        cityId: presentValue.cityId,
        pinCode: presentValue.pinCode,
      });

      // Enable controls if required
      permanentAddress.get("stateId")?.enable();
      permanentAddress.get("cityId")?.enable();

      // Optional: copy dropdown lists also
      this.permanentStates = [...this.states];
      this.permanentCities = [...this.cities];

      // console.log("Permanent Address After Patch:", permanentAddress.getRawValue());
    } else {
      permanentAddress.patchValue({
        address: "",
        countryId: "",
        stateId: "",
        cityId: "",
        pinCode: "",
      });

      this.permanentStates = [];
      this.permanentCities = [];

      permanentAddress.get("stateId")?.disable();
      permanentAddress.get("cityId")?.disable();
    }
  }

  // =========================
  // INPUT HELPERS
  // =========================

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, "").slice(0, 16);

    value = value.replace(/(.{4})/g, "$1 ").trim();

    this.registrationForm.get("paymentDetails.cardNumber")?.setValue(value, { emitEvent: false });
  }

  formatExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
      value = value.substring(0, 2) + " / " + value.substring(2);
    }

    this.registrationForm.get("paymentDetails.expiry")?.setValue(value, { emitEvent: false });
  }
}
