import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { NgxsmkTelInputComponent, IntlTelI18n, CountryMap } from "ngxsmk-tel-input";
import { Router, RouterModule } from "@angular/router";
import { PatientRegister } from "../../Models/Patient-Model";
import { selectRegisteredPatient, selectSecurityQuestions } from "src/app/Store/Auth/auth.selectors";
import { AppState } from "src/app/Store/app.state";
import { Store } from '@ngrx/store';
import * as AuthActions from "../../Store/Auth/auth.actions";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-self-registration",
  imports: [ReactiveFormsModule, RouterModule,],
  templateUrl: "./self-registration.component.html",
  styleUrls: ["./self-registration.component.css"],
  standalone: true,
})
export class SelfRegistrationComponent implements OnInit {
  enLabels: IntlTelI18n = {
    selectedCountryAriaLabel: "Selected country",
    countryListAriaLabel: "Country list",
    searchPlaceholder: "Search country",
    zeroSearchResults: "No results",
    noCountrySelected: "No country selected",
  };

  enCountries: CountryMap = {
    US: "United States",
    GB: "United Kingdom",
    AU: "Australia",
    CA: "Canada",
  };

  signupForm!: FormGroup;
  currentStep = 0;
  patientRegisterRequest: PatientRegister = {} as PatientRegister;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = []

  statesData: any = {
    India: ["Maharashtra", "Delhi"],
    USA: ["California", "Texas"],
  };
  showPassword: boolean = false;
  showconfirmPasswordPassword: boolean = false
  securityQuestions: any[] | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.formInitialization();

    queueMicrotask(() => {
      this.initialAPICalls();
    });
    this.initialSelectors();

  }
  get f() {
    return this.signupForm.controls;
  }
  markStepTouched(fields: string[]) {
    fields.forEach((field) => {
      this.signupForm.get(field)?.markAsTouched();
    });
  }

  get getCountryCode(): string {
    const country = this.signupForm.get('phoneCountryCode')?.value;

    switch (country) {
      case '+1':
        return '+1';
      case '+44':
        return '+44';
      default:
        return '+91';
    }
  }
  nextStep() {
    if (this.currentStep === 0) {
      if (
        this.f.firstName.invalid ||
        this.f.lastName.invalid ||
        this.f.phoneNumber.invalid ||
        this.f.dateOfBirth.invalid ||
        this.f.email.invalid
      ) {
        this.markStepTouched(["firstName", "lastName", "phoneNumber", "dateOfBirth", "email"]);
        return;
      }
    }

    if (this.currentStep === 1) {
      if (
        this.f.countryId.invalid ||
        this.f.stateId.invalid ||
        this.f.addressLine1.invalid ||
        this.f.cityId.invalid ||
        this.f.zipCode.invalid
      ) {
        this.markStepTouched(["countryId", "stateId", "addressLine1", "cityId", "zipCode"]);
        return;
      }
    }

    if (this.currentStep === 2) {
      if (
        this.f.username.invalid ||
        this.f.password.invalid ||
        this.f.confirmPassword.invalid ||
        this.f.securityQuestionId.invalid ||
        this.f.securityAnswer.invalid
      ) {
        this.markStepTouched([
          "username",
          "password",
          "confirmPassword",
          "securityQuestionId",
          "securityAnswer",
        ]);
        return;
      }
    }

    this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async onCountryChange(event: any) {

    await this.store.dispatch(
      AuthActions.getStates({ countryId: event.target.value })
    );
    this.store.select(state => state.auth.getStates).subscribe((states: any) => {

      if (states) {
        this.signupForm.get('stateId')?.enable();

        this.states = states.data;
      }
    });
    // const country = event.target.value;
    // this.states = this.statesData[country] || [];
  }

  async onStateChange(event: any) {

    await this.store.dispatch(
      AuthActions.getCities({ stateId: event.target.value })
    );
    this.store.select(state => state.auth.getCities).subscribe((cities: any) => {
      if (cities) {
        this.signupForm.get('cityId')?.enable();
        this.cities = cities.data;
      }
    });
  }

  initialAPICalls() {
    console.log('Dispatching Get Countries');
    this.store.dispatch(
      AuthActions.getSecurityQuestions()
    );
    this.store.dispatch(
      AuthActions.getCountries()
    );
  }

  initialSelectors() {
    this.store
      .select(selectSecurityQuestions)
      .subscribe((questions: any) => {
        console.log(questions.data)
        this.securityQuestions = questions?.data;

      });
    this.store.select(state => state.auth.getCountries).subscribe((countries: any) => {
      if (countries.data) {
        console.log(this.states.length)
        console.log(countries)
        this.countries = countries.data;

        this.signupForm.get('phoneCountryCode')?.setValue(this.countries[0]?.phoneCode)
      }
    });
    this.store.select(state => state.auth.registeredPatient).subscribe((patient: any) => {
      if (patient) {

        this.router.navigate(['/login']);
      }
    }
    )
  }

  formInitialization() {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      phoneNumber: ["", Validators.required],
      dateOfBirth: ["", Validators.required],
      gender: ["Select gender"],
      email: ["", Validators.required],
      countryId: [null, Validators.required],
      stateId: [{ value: null, disabled: true }, Validators.required],
      addressLine1: ["", Validators.required],
      addressLine2: [""],
      zipCode: ["", Validators.required],
      cityId: [{ value: null, disabled: true }, Validators.required],
      username: [""],
      password: [""],
      confirmPassword: [""],
      securityQuestionId: [null, Validators.required],
      securityAnswer: ["", Validators.required],
      phoneCountryCode: [""]
    });
  }

  onSubmit() {

    if (this.currentStep === 2) {
      if (
        this.f.username.invalid ||
        this.f.password.invalid ||
        this.f.confirmPassword.invalid ||
        this.f.securityQuestionId.invalid ||
        this.f.securityAnswer.invalid
      ) {
        this.markStepTouched([
          "username",
          "password",
          "confirmPassword",
          "securityQuestionId",
          "securityAnswer",
        ]);
        return;
      }
    }

    const payload: PatientRegister = {
      patientId: 0,

      firstName: this.signupForm.value.firstName,
      middleName: this.signupForm.value.middleName,
      lastName: this.signupForm.value.lastName,
      dateOfBirth: this.signupForm.value.dateOfBirth,
      phoneNumber: this.signupForm.value.phoneNumber,
      email: this.signupForm.value.email,
      gender: this.signupForm.value.gender,
      addressLine1: this.signupForm.value.addressLine1,
      addressLine2: this.signupForm.value.addressLine2,
      cityId: Number(this.signupForm.value.cityId),
      stateId: Number(this.signupForm.value.stateId),
      countryId: Number(this.signupForm.value.countryId),
      zipCode: this.signupForm.value.zipCode,
      username: this.signupForm.value.username,
      password: this.signupForm.value.password,
      securityQuestionId: Number(this.signupForm.value.securityQuestionId),
      securityAnswer: this.signupForm.value.securityAnswer,
      isActive: true,
      createdBy: 'SelfRegistration',
      createdDate: new Date().toISOString(),
      updatedBy: 'SelfRegistration',
      updatedDate: new Date().toISOString()
    }

    this.store.dispatch(
      AuthActions.register({
        patient: payload
      })
    );
    // console.log(this.signupForm.value);()
    this.store.select(state => state.auth.registeredPatient).subscribe((patient: any) => {
      console.log(patient)
      if (patient) {

      }
    })
    // this.router.navigate(["/login"]);
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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleconfirmPassword() {
    this.showconfirmPasswordPassword = !this.showconfirmPasswordPassword
  }
}
