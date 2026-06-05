import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmploymentDetailsComponent } from './employment-details/employment-details.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ExperienceComponent } from './experience/experience.component';
import { QualificationComponent } from './qualification/qualification.component';
import { AppState } from 'src/app/Store/app.state';
import { Store } from '@ngrx/store';
import * as AuthActions from "../../../Store/Auth/auth.actions";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-helth-care-association",
  imports: [EmploymentDetailsComponent, ExperienceComponent, QualificationComponent, PersonalInfoComponent, FormsModule, ReactiveFormsModule],
  templateUrl: "./helth-care-association.component.html",
  styleUrl: "./helth-care-association.component.css",
})
export class HelthCareAssociationComponent {

  countries: any[] = []
  states: any[] = []
  cities: any[] = []
  currentStep = 0;

  stepStatus: ('pending' | 'active' | 'completed')[] = [
    'active',
    'pending',
    'pending',
    'pending'
  ];

  associateForm!: FormGroup;

  constructor(private fb: FormBuilder, private store: Store<AppState>, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.store.dispatch(
      AuthActions.getCountries()
    );
    this.store.select(state => state.auth.getCountries).subscribe((countries: any) => {
      if (countries.data) {
        console.log(countries)
        this.countries = countries.data;
        this.associateForm
          .get('personalInfo.phoneCountryCode')
          ?.setValue(this.countries[0].phoneCode);
        this.associateForm
          .get('personalInfo.emergencyCode')
          ?.setValue(this.countries[0].phoneCode);
      }
    });
    this.createForm();
    this.updateStepStatus();
  }

  createForm(): void {
    this.associateForm = this.fb.group({

      personalInfo: this.fb.group({
        firstName: ['', Validators.required],
        middleName: [''],
        identityDocument: ['', Validators.required],
        identityFile: [null, Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        employeeId: ['', Validators.required],
        phoneCountryCode: ['+91'],
        phoneNumber: [''],
        emailId: ['', Validators.required],
        gender: [''],
        residentialAddress: [''],
        permanentAddress: [''],
        cityId: [{ value: null, disabled: true }, Validators.required],
        zipCode: [''],
        countryId: [null, Validators.required],
        stateId: [{ value: null, disabled: true }, Validators.required],
        languagesSpoken: ['', Validators.required],
        emergencyName: ['', Validators.required],
        emergencyRelationship: ['', Validators.required],
        emergencyPhone: ['', Validators.required],
        emergencyCode: ['']
      }),

      qualification: this.fb.group({
        highestDegree: ['', Validators.required],
        specialization: ['', Validators.required],
        institutionName: ['', Validators.required],
        yearOfPassing: ['', Validators.required],
        registrationNumber: ['', Validators.required],
        licenseExpiry: ['', Validators.required],
        additionalCertifications: [''],
        qualificationDocuments: [null, Validators.required]

      }),


      experience: this.fb.group({
        experienceYears: ['', Validators.required],
        organizationName: ['', Validators.required],
        designationRole: ['', Validators.required],
        departmentWorked: ['', Validators.required],
        keySkills: ['', Validators.required],
      }),

      employmentDetails: this.fb.group({
        joiningDate: ['', Validators.required],
        employeeType: ['', Validators.required],
        departmentName: ['', Validators.required],
        designation: ['', Validators.required],
      })
    });
  }

  nextStep(step: number) {
    this.currentStep = step;
    this.updateStepStatus();

  }

  async onSelectCountry(countriId: number) {
    await this.store.dispatch(
      AuthActions.getStates({ countryId: countriId })
    );
    this.store.select(state => state.auth.getStates).subscribe((states: any) => {
      if (states) {
        this.states = states.data;
      }
    });
  }
  async onSelectState(stateId: number) {
    await this.store.dispatch(
      AuthActions.getCities({ stateId: stateId })
    );
    this.store.select(state => state.auth.getCities).subscribe((cities: any) => {
      if (cities) {
        this.cities = cities.data;
      }
    });
  }
  changeStepsOnClick(targetStep: number) {

    const forms = [
      this.associateForm.get('personalInfo'),
      this.associateForm.get('qualification'),
      this.associateForm.get('experience'),
      this.associateForm.get('employmentDetails')
    ];

    // Backward navigation
    if (targetStep < this.currentStep) {
      this.currentStep = targetStep;
      this.updateStepStatus();
      return;
    }

    // Forward navigation
    for (let i = 0; i < targetStep; i++) {

      if (forms[i]?.invalid) {

        forms[i]?.markAllAsTouched();

        // Open first invalid step
        this.currentStep = i;
        this.updateStepStatus();

        return;
      }
    }

    this.currentStep = targetStep;
    this.updateStepStatus();
  }
  updateStepStatus() {

    this.stepStatus = this.stepStatus.map((_, index) => {

      if (index === this.currentStep) {
        return 'active';
      }

      if (index < this.currentStep) {
        return 'completed';
      }

      return 'pending';

    }) as ('pending' | 'active' | 'completed')[];
  }

  getStepStatus(step: number): string {

    const forms = [
      this.associateForm.get('personalInfo'),
      this.associateForm.get('qualification'),
      this.associateForm.get('experience'),
      this.associateForm.get('employmentDetails')
    ];
    this.stepStatus[step] = this.currentStep === step ? 'active' : (forms[step]?.valid ? 'completed' : 'pending');
    this.stepStatus[this.currentStep] = 'active';

    if (this.currentStep === step) {
      return 'In Progress';
    }
    if (this.currentStep > step) {
      return 'In Progress';
    }

    if (forms[step]?.valid) {
      return 'Completed';
    }

    return 'Pending';
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateStepStatus();
    }
  }

  submit(): void {
    console.log(this.associateForm.value);
    this.toastr.success("Association added successfully")
    this.router.navigateByUrl('association-list')

  }
}
