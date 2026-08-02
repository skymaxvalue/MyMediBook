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
import * as PatientAction from "../../Store/Patient/patient.action"
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-self-registration",
  imports: [ReactiveFormsModule, RouterModule,],
  templateUrl: "./self-registration.component.html",
  styleUrls: ["./self-registration.component.css"],
  standalone: true,
})
export class SelfRegistrationComponent implements OnInit {
  signupForm!: FormGroup;
  currentStep = 0;
  patientRegisterRequest: PatientRegister = {} as PatientRegister;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = []
  url: string = ""
  user: any
  showPassword: boolean = false;
  showconfirmPasswordPassword: boolean = false
  securityQuestions: any[] | undefined;
  dob: string = '';
  ageError: string = '';
  isValidAge: boolean = false;
  maxDate: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private toastr: ToastrService

  ) {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');

  }

  ngOnInit(): void {
    // console.log(this.router.url);
    this.formInitialization();
    this.url = this.router.url
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);

    this.maxDate = date.toISOString().split('T')[0];
    if (this.router.url === '/profile-update' && this.user.data) {
      queueMicrotask(() => {
        this.initialAPICalls();
      });
      this.initialSelectors();
      this.loadPatientData();
    } else {
      // 
      queueMicrotask(() => {
        this.initialAPICalls();
      });
      this.initialSelectors();

    }



  }

  onDobChange(event: any) {

    const value = event.target.value;

    if (!value) {
      this.ageError = 'Please select date of birth';
      this.isValidAge = false;
      return;
    }

    const selectedDob = new Date(value);
    const today = new Date();

    let age = today.getFullYear() - selectedDob.getFullYear();

    const monthDiff = today.getMonth() - selectedDob.getMonth();
    const dayDiff = today.getDate() - selectedDob.getDate();

    // adjust age if birthday not yet occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age >= 18) {
      this.ageError = '';
      this.isValidAge = true;
    } else {
      this.ageError = 'User must be 18 years or older';
      this.isValidAge = false;
    }
  }

  get f() {

    return this.signupForm.controls;
  }
  markStepTouched(fields: string[]) {
    fields.forEach((field) => {
      this.signupForm.get(field)?.markAsTouched();
    });
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
      if (this.url === '/profile-update') {
        // console.log(this.patientRegisterRequest.countryId, this.patientRegisterRequest.stateId, this.patientRegisterRequest.cityId, "------------>")
        this.loadStates(this.patientRegisterRequest.countryId, this.patientRegisterRequest.stateId, this.patientRegisterRequest.cityId)

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

  loadPatientData() {
    queueMicrotask(() => {
      this.store.dispatch(
        PatientAction.getPatientDetailsById({
          id: this.user.data.patientId
        })
      );

    })


    this.store
      .select(state => state.patient.patientDetails)
      .subscribe((response: any) => {
        // console.log(response, "---------->")
        if (response?.data) {

          this.patientRegisterRequest = response.data;

          this.signupForm.patchValue({
            firstName: this.patientRegisterRequest.firstName,
            middleName: this.patientRegisterRequest.middleName,
            lastName: this.patientRegisterRequest.lastName,
            phoneNumber: this.patientRegisterRequest.phoneNumber,
            dateOfBirth: this.patientRegisterRequest.dateOfBirth,
            email: this.patientRegisterRequest.email,
            gender: this.patientRegisterRequest.gender,
            countryId: this.patientRegisterRequest.countryId,
            stateId: this.patientRegisterRequest.stateId,
            cityId: this.patientRegisterRequest.cityId,
            addressLine1: this.patientRegisterRequest.addressLine1,
            addressLine2: this.patientRegisterRequest.addressLine2,
            zipCode: this.patientRegisterRequest.zipCode,
            username: this.patientRegisterRequest.username,
            securityQuestionId: this.patientRegisterRequest.securityQuestionId,
            securityAnswer: this.patientRegisterRequest.securityAnswer,
            phoneCountryCode: this.patientRegisterRequest.phoneCountryCode
          });

          this.signupForm.get('password')?.disable();
          this.signupForm.get('confirmPassword')?.disable();

          const dob = this.patientRegisterRequest.dateOfBirth
            ? new Date(this.patientRegisterRequest.dateOfBirth).toISOString().split('T')[0]
            : null;

          this.signupForm.patchValue({
            dateOfBirth: dob
          });
        }

      });

  }

  loadStates(countryId: number, stateId: number, cityId: number) {

    this.store.dispatch(
      AuthActions.getStates({ countryId })
    );

    this.store.select(state => state.auth.getStates)
      .subscribe((response: any) => {

        if (!response?.data) return;

        this.states = response.data;

        this.signupForm.get('stateId')?.enable();
        this.signupForm.patchValue({
          countryId,
          stateId
        });

        // Step 2
        this.loadCities(stateId, cityId);
      });
  }

  loadCities(stateId: number, cityId: number) {

    this.store.dispatch(
      AuthActions.getCities({ stateId })
    );

    this.store.select(state => state.auth.getCities)
      .subscribe((response: any) => {

        if (!response?.data) return;

        this.cities = response.data;

        this.signupForm.get('cityId')?.enable();

        this.signupForm.patchValue({
          cityId
        });
      });
  }
  async onCountryChange(event: any) {

    await this.store.dispatch(
      AuthActions.getStates({ countryId: event.target.value })
    );
    await this.store.select(state => state.auth.getStates).subscribe((states: any) => {

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
    await this.store.select(state => state.auth.getCities).subscribe((cities: any) => {
      if (cities) {
        this.signupForm.get('cityId')?.enable();
        this.cities = cities.data;
      }
    });
  }

  initialAPICalls() {
    // console.log('Dispatching Get Countries');
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
        this.securityQuestions = questions?.data;

      });
    this.store.select(state => state.auth.getCountries).subscribe((countries: any) => {
      if (countries.data) {

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
    // alert(patient)


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
      password: this.signupForm.value.password ? this.signupForm.value.password : "",
      securityQuestionId: Number(this.signupForm.value.securityQuestionId),
      securityAnswer: this.signupForm.value.securityAnswer,
      phoneCountryCode: this.signupForm.value.phoneCountryCode,
      isActive: true,
      createdBy: 'SelfRegistration',
      createdDate: new Date().toISOString(),
      updatedBy: 'SelfRegistration',
      updatedDate: new Date().toISOString()
    }

    if (this.url === '/profile-update') {
      payload.patientId = this.user.data.patientId,
        this.store.dispatch(PatientAction.updatePatientDetailsById({ patient: payload }))
    } else {

      this.store.dispatch(
        AuthActions.register({
          patient: payload
        })
      );

    }

    this.store.select(state => state.auth.registeredPatient).subscribe((patient: any) => {

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
