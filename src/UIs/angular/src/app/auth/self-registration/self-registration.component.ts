import {  Component,
  ElementRef,
  ViewChild,
  AfterViewInit, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import intlTelInput from 'intl-tel-input';
import utils from 'intl-tel-input/utils';

@Component({
  selector: "app-self-registration",
  imports: [ReactiveFormsModule, ],
  templateUrl: "./self-registration.component.html",
  styleUrls: ["./self-registration.component.css"],
  standalone: true
})
export class SelfRegistrationComponent implements OnInit,AfterViewInit  {
  @ViewChild("phoneInput") phoneInput!: ElementRef;

  signupForm!: FormGroup;
  currentStep = 0;

  countries = ["India", "USA", "UK"];
  states: string[] = [];

  statesData: any = {
    India: ["Maharashtra", "Delhi"],
    USA: ["California", "Texas"],
  };

  iti: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName:[""],
      
      dob:[""],
      gender:["Select gender"],
      email:[""],
      country: [""],
      state: [""],
      userId: [""],
    });
  }

  ngAfterViewInit(): void {
    if (this.phoneInput) {
     this.iti = intlTelInput(this.phoneInput.nativeElement, {
    initialCountry: 'in',
  separateDialCode: true,
  } ) ;

  this.iti.promise.then(() => {
    this.iti.setUtils(utils);
  });
}
}
  getFullPhone(): string {
    return this.iti?.getNumber() || "";
  }

  getDialCode(): string {
    return this.iti?.getSelectedCountryData()?.dialCode || "";
  }

  isValidPhone(): boolean {
    return this.iti?.isValidNumber() || false;
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    } else {
      this.onSubmit();
    }
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
    if (!this.isValidPhone()) {
      alert("Please enter valid phone number");
      return;
    }

    const formData = {
      ...this.signupForm.value,
      phone: this.getFullPhone(),
      dialCode: this.getDialCode(),
      countryCode: this.iti.getSelectedCountryData().iso2,
    };

    console.log("Final Data:", formData);

    alert("Form Submitted Successfully");
  }
}
