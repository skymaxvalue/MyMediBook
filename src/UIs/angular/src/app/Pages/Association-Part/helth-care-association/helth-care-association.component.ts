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
import { getRoleDepaSpecia, loadAllDepartments, loadAllDepartmentsSuccess, loadAllRoles, loadAllSpecialities, loadDoctorSpecialities, registerAssociotion } from 'src/app/Store/Doctor/doctor.action';
import { selectAllDepartments, selectAllRoles, selectAllSpecialities, selectGetRoleDepSpeciOfAssociate, selectRegisterAssociate } from 'src/app/Store/Doctor/doctor.selectors';
import { take } from 'rxjs/operators';

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
  allSpecialities: any;
  allDepartments: any;
  allRoles: any;

  constructor(private fb: FormBuilder, private store: Store<AppState>, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.InitialApiCall()

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
        licenseExpiry: [null, Validators.required],
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
        departmentId: [{ value: null, disabled: true }, Validators.required],
        roleId: [{ value: null, disabled: false }, Validators.required],
        specialityId: [{ value: null, disabled: true }, Validators.required],
        designationId: [{ value: null, disabled: true }, Validators.required]
      })
    });
  }

  nextStep(step: number) {
    window.scrollTo(0, 0);
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
        const stateControl = this.associateForm.get('personalInfo.stateId');
        stateControl?.enable();
        stateControl?.reset();
      }
    }); this.store.select
  }
  async onSelectState(stateId: number) {
    await this.store.dispatch(
      AuthActions.getCities({ stateId: stateId })
    );
    this.store.select(state => state.auth.getCities).subscribe((cities: any) => {
      if (cities) {
        this.cities = cities.data;
        const cityControl = this.associateForm.get('personalInfo.cityId');

        cityControl?.enable();
        cityControl?.reset();
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

  InitialApiCall() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.store.dispatch(
      AuthActions.getCountries()
    );

    this.store.select(state => state.auth.getCountries).subscribe((countries: any) => {
      if (countries.data) {
        this.countries = countries.data;
        this.associateForm
          .get('personalInfo.phoneCountryCode')
          ?.setValue(this.countries[0].phoneCode);
        this.associateForm
          .get('personalInfo.emergencyCode')
          ?.setValue(this.countries[0].phoneCode);
      }
    });

    this.store.dispatch(
      getRoleDepaSpecia());



    this.store.select(selectGetRoleDepSpeciOfAssociate)
      .subscribe((res: any) => {
        this.allRoles = res;
      });
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

  async submit() {

    console.log(this.associateForm.value);
    const payload = {
      ...this.associateForm.value.personalInfo,
      languagesSpoken: this.associateForm.value.personalInfo.languagesSpoken.join(','),
      ...this.associateForm.value.employmentDetails,
      roleId: Number(this.associateForm.value.employmentDetails.roleId),
      specialityId: Number(this.associateForm.value.employmentDetails.specialityId),
      departmentId: Number(this.associateForm.value.employmentDetails.departmentId),
      cityId: Number(this.associateForm.value.personalInfo.cityId),
      stateId: Number(this.associateForm.value.personalInfo.stateId),
      countryId: Number(this.associateForm.value.personalInfo.countryId),
      createdBy: this.associateForm.value.personalInfo.firstName + " " + this.associateForm.value.personalInfo.lastName,
      designationId: Number(this.associateForm.value.employmentDetails.designationId),
      associateQualification: {
        ...this.associateForm.value.qualification,
        yearOfPassing: new Date(this.associateForm.value.qualification.yearOfPassing).getFullYear()
      },
      associateExperience: {
        ...this.associateForm.value.experience,
        experienceYears: Number(this.associateForm.value.experience.experienceYears)
      }
    }
    await this.store.dispatch(registerAssociotion({ associate: payload }))
    await this.store.select(selectRegisterAssociate)
      .subscribe((res: any) => {
        if (res) {
          if (res.isSuccess === 1) {
            this.router.navigateByUrl('/association-list');
          } else {
            return
          }


        }
      });

  }
}
