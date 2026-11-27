import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Patient, PatientVisit } from 'src/app/core/Models/claims/claims.interface';
import { PATIENTS } from '../claim-dashboard/data/claims.data';
@Component({
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule],
  selector: "app-new-claim",
  styleUrl: "./new-claim.component.css",
  templateUrl: "./new-claim.component.html",
})
export class NewClaimComponent implements OnInit {



  // import { ClaimsService } from '../../services/claims.service';

  patients: Patient[] = [...PATIENTS];
  filteredPatients: Patient[] = [];

  showVisitHistory = true;
  selectedPatient: Patient | null = null;
  showPatientSuggestions = false;

  // Patient Visit History
  patientVisits: PatientVisit[] = [];
  selectedVisit: PatientVisit | null = null;
  claimForm!: FormGroup;

  payers: string[] = [];

  isSubmitting = false;
  isDemo = false;
  submitted = false;

  formError = '';

  todayString = '';

  // filteredPatients: Patient[] = [];
  // selectedPatient: Patient | null = null;
  // patientVisits: PatientVisit[] = [];
  // showPatientSuggestions = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private claimsService: ClaimsService
  ) { }

  ngOnInit(): void {

    this.initializeForm();

    this.setTodayDate();

    this.loadPayers();

    // this.isDemo = this.claimsService.isDemo();
  }

  // Initialize Form
  initializeForm(): void {

    this.claimForm = this.fb.group({

      patientName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      patientId: [
        '',
        [
          Validators.required
        ]
      ],

      serviceDate: [
        '',
        [
          Validators.required
        ]
      ],

      amount: [
        '',
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      payer: [
        '',
        [
          Validators.required
        ]
      ],

      policyId: [
        '',
        [
          Validators.required
        ]
      ],

      notes: [
        '',
        [
          Validators.maxLength(500)
        ]
      ]

    });

  }

  onPatientSearch(searchText: string): void {

    this.selectedPatient = null;
    this.patientVisits = [];

    this.claimForm.patchValue({
      patientId: '',
      serviceDate: ''
    });

    const search = searchText.trim().toLowerCase();

    if (!search) {
      this.filteredPatients = [];
      this.showPatientSuggestions = false;
      return;
    }

    this.filteredPatients = this.patients.filter(patient =>
      patient.patientName.toLowerCase().includes(search) ||
      patient.patientId.toLowerCase().includes(search)
    );

    this.showPatientSuggestions = true;
  }

  selectPatient(patient: Patient): void {

    this.selectedPatient = patient;

    this.claimForm.patchValue({
      patientName: patient.patientName,
      patientId: patient.patientId,
      serviceDate: ''
    });

    this.patientVisits = patient.visits;

    this.showPatientSuggestions = false;
    this.showVisitHistory = true;
  }

  loadPatientVisits(patientId: string): void {

    this.patientVisits = [];



  }

  selectVisit(visit: PatientVisit): void {

    this.claimForm.patchValue({
      serviceDate: visit.visitDate
    });

    this.showVisitHistory = false;

    console.log('Selected Patient:', this.selectedPatient);
    console.log('Selected Visit:', visit);
  }

  // Set today's date as maximum date
  setTodayDate(): void {

    const today = new Date();

    this.todayString =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  }

  // Load Insurance Payers
  async loadPayers(): Promise<void> {

    try {

      // this.payers = await this.claimsService.payers();

    } catch (error) {

      console.error('Unable to load payers:', error);

    }

  }

  // Get form controls
  get f() {
    return this.claimForm.controls;
  }

  // Check field validation
  isInvalid(field: string): boolean {

    const control = this.claimForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );

  }

  // Get validation error
  getError(field: string): string {

    const control = this.claimForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (control.hasError('min')) {
      return 'Enter an amount greater than 0.';
    }

    if (control.hasError('maxlength')) {
      return `Maximum ${control.getError('maxlength').requiredLength} characters allowed.`;
    }

    return 'Invalid value.';

  }

  // Validate service date
  validateServiceDate(): boolean {

    const selectedDate = this.claimForm.get('serviceDate')?.value;

    if (selectedDate && selectedDate > this.todayString) {

      this.claimForm.get('serviceDate')?.setErrors({
        futureDate: true
      });

      return false;

    }

    return true;

  }

  // Submit Claim
  async onSubmit(): Promise<void> {

    this.submitted = true;
    this.formError = '';

    this.validateServiceDate();

    if (this.claimForm.invalid) {

      this.claimForm.markAllAsTouched();

      this.formError =
        'Please complete the required fields.';

      return;

    }

    this.isSubmitting = true;

    try {

      const formValue = this.claimForm.getRawValue();
      console.log('Form Value:', formValue);

      // const claim = await this.claimsService.create({

      //   patientName: formValue.patientName.trim(),

      //   patientId: formValue.patientId.trim(),

      //   payer: formValue.payer.trim(),

      //   policyId: formValue.policyId.trim(),

      //   serviceDate: formValue.serviceDate,

      //   amount: Number(formValue.amount),

      //   notes: formValue.notes?.trim() || ''

      // });

      // this.router.navigate(
      //   ['/front-office/claim-details'],
      //   {
      //     queryParams: {
      //       id: claim.id
      //     }
      //   }
      // );

    } catch (error: any) {

      this.formError =
        error?.message ||
        'The claim could not be created.';

      this.isSubmitting = false;

    }

  }

  // Cancel
  onCancel(): void {

    this.router.navigate(['/front-office/claims-dashboard']);

  }

}

