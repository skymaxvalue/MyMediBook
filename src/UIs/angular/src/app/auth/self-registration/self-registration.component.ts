import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { NgxsmkTelInputComponent, IntlTelI18n, CountryMap } from "ngxsmk-tel-input";
import { Router } from "@angular/router";

@Component({
  selector: "app-self-registration",
  imports: [ReactiveFormsModule, NgxsmkTelInputComponent],
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

  countries = ["India", "USA", "UK"];
  states: string[] = [];

  statesData: any = {
    India: ["Maharashtra", "Delhi"],
    USA: ["California", "Texas"],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      middleName: [""],
      lastName: ["", Validators.required],
      phone: ["", Validators.required],
      dob: ["", Validators.required],
      gender: ["Select gender"],
      email: ["", Validators.required],
      country: [""],
      state: [""],
      addressLine1: ["", Validators.required],
      addressLine2: [""],
      zipCode: ["", Validators.required],
      city: ["", Validators.required],
      userId: [""],
      password: [""],
      confirmPassword: [""],
      securityQuestion: [""],
      securityAnswer: [""],
    });
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
        this.f.phone.invalid ||
        this.f.dob.invalid ||
        this.f.email.invalid
      ) {
        this.markStepTouched(["firstName", "lastName", "phone", "dob", "email"]);
        return;
      }
    }

    if (this.currentStep === 1) {
      if (
        this.f.country.invalid ||
        this.f.state.invalid ||
        this.f.addressLine1.invalid ||
        this.f.city.invalid ||
        this.f.zipCode.invalid
      ) {
        this.markStepTouched(["country", "state", "addressLine1", "city", "zipCode"]);
        return;
      }
    }

    if (this.currentStep === 2) {
      if (
        this.f.userId.invalid ||
        this.f.password.invalid ||
        this.f.confirmPassword.invalid ||
        this.f.securityQuestion.invalid ||
        this.f.securityAnswer.invalid
      ) {
        this.markStepTouched([
          "userId",
          "password",
          "confirmPassword",
          "securityQuestion",
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

  onCountryChange(event: any) {
    const country = event.target.value;
    this.states = this.statesData[country] || [];
  }

  onSubmit() {
    // console.log(this.signupForm.value);
    alert("Form Submitted Successfully");
    this.router.navigate(["/login"]);
  }
}
