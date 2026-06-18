import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { loadAllDepartments, loadAllRoles, loadAllSpecialities } from "src/app/Store/Doctor/doctor.action";
import { selectAllDepartments, selectAllRoles, selectAllSpecialities } from "src/app/Store/Doctor/doctor.selectors";


interface AssociateRecord {
  department: string;
  name: string;
  role: string;
  speciality: string;
}


@Component({
  selector: "app-assign-schedule-asspciation",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./assign-schedule-asspciation.component.html",
  styleUrl: "./assign-schedule-asspciation.component.css",
})
export class AssignScheduleAsspciationComponent implements OnInit {
  currentStep = 0;

  associateModal = false;
  successModal = false;

  scheduleForm!: FormGroup;

  selectedDays: string[] = ['Mon', 'Tue', 'Thu', 'Fri'];

  allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  associateRecords: AssociateRecord[] = [
    {
      department: 'GENERAL',
      name: 'Dr. Kumar',
      role: 'Doctor',
      speciality: 'Cardiology'
    },
    {
      department: 'GENERAL',
      name: 'Dr. Bose',
      role: 'Consultant',
      speciality: 'General Medicine'
    },
    {
      department: 'CARDIOLOGY',
      name: 'Dr. Raman',
      role: 'Specialist',
      speciality: 'Interventional Cardiology'
    },
    {
      department: 'ORTHOPEDICS',
      name: 'Dr. Arya',
      role: 'Doctor',
      speciality: 'Sports Injury'
    }
  ];

  filteredAssociates: AssociateRecord[] = [];

  summaryData: any[] = [];
  allSpecialities: any;
  allDepartments: any;
  allRoles: any;

  constructor(private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {


    this.scheduleForm = this.fb.group({
      associateDepartment: ['', Validators.required],
      associateName: ['', Validators.required],
      associateRole: ['', Validators.required],
      associateSpeciality: [''],

      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],

      fromTime: ['10:00 AM', Validators.required],
      toTime: ['10:00 PM', Validators.required],

      breakFrom: ['02:00 PM'],
      breakTo: ['06:00 PM'],

      consultDuration: ['30 Minutes', Validators.required],
      averageCharge: ['Rs. 600', Validators.required]
    });

    this.updateNameOptions();
    this.initialApiCall()
  }

  initialApiCall() {
    this.store.dispatch(
      loadAllSpecialities());
    this.store.dispatch(
      loadAllDepartments());
    this.store.dispatch(
      loadAllRoles());

    this.store.select(selectAllSpecialities)
      .subscribe((res: any) => {
        this.allSpecialities = res;
        console.log(this.allSpecialities, "------12----->")
      });
    this.store.select(selectAllDepartments)
      .subscribe((res: any) => {
        this.allDepartments = res;

      });
    this.store.select(selectAllRoles)
      .subscribe((res: any) => {
        this.allRoles = res;

      });
  }

  updateNameOptions(): void {

    const department =
      this.scheduleForm.get('associateDepartment')?.value;

    this.filteredAssociates =
      this.associateRecords.filter(
        x =>
          !department ||
          x.department === department
      );

    this.scheduleForm.patchValue({
      associateName: '',
      associateSpeciality: ''
    });
  }

  updateSpeciality(): void {

    const record = this.findSelectedRecord();

    this.scheduleForm.patchValue({
      associateSpeciality: record?.speciality || ''
    });
  }

  findSelectedRecord(): AssociateRecord | undefined {

    const form = this.scheduleForm.value;

    return this.associateRecords.find(
      x =>
        x.department === form.associateDepartment &&
        x.name === form.associateName &&
        x.role === form.associateRole
    );
  }

  toggleDay(day: string): void {

    const index = this.selectedDays.indexOf(day);

    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.selectedDays.includes(day);
  }

  validateCurrentStep(): boolean {

    if (this.currentStep === 0) {

      const controls = [
        'associateDepartment',
        'associateName',
        'associateRole'
      ];

      controls.forEach(control =>
        this.scheduleForm.get(control)?.markAsTouched()
      );

      return controls.every(
        control => this.scheduleForm.get(control)?.valid
      );
    }

    if (this.currentStep === 1) {

      const controls = [
        'fromDate',
        'toDate',
        'fromTime',
        'toTime'
      ];

      controls.forEach(control =>
        this.scheduleForm.get(control)?.markAsTouched()
      );

      return controls.every(
        control => this.scheduleForm.get(control)?.valid
      );
    }

    return true;
  }

  openAssociatePopup(): void {

    if (!this.validateCurrentStep()) {
      return;
    }

    if (!this.findSelectedRecord()) {
      alert(
        'Please select matching Department, Name and Role.'
      );
      return;
    }

    this.associateModal = true;
  }

  closeAssociatePopup(): void {
    this.associateModal = false;
  }

  confirmAssociate(): void {

    this.associateModal = false;
    this.currentStep = 1;
  }

  nextStep(): void {

    if (!this.validateCurrentStep()) {
      return;
    }

    this.currentStep++;
  }

  previousStep(): void {

    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  submitSchedule(): void {

    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    this.successModal = true

    this.populateSummary();

    console.log({
      ...this.scheduleForm.value,
      selectedDays: this.selectedDays
    });

    this.successModal = true;
  }

  populateSummary(): void {

    const form = this.scheduleForm.value;

    this.summaryData = [
      {
        label: 'Associate',
        value: form.associateName
      },
      {
        label: 'Department',
        value: form.associateDepartment
      },
      {
        label: 'Availability',
        value: `${form.fromDate} to ${form.toDate}`
      },
      {
        label: 'Time',
        value: `${form.fromTime} - ${form.toTime}`
      },
      {
        label: 'Days',
        value: this.selectedDays.join(', ')
      },
      {
        label: 'Consultation',
        value: `${form.consultDuration}, ${form.averageCharge}`
      }
    ];
  }

  closeSuccessModal(): void {
    this.successModal = false;
  }

  get modalRecord(): AssociateRecord {
    return this.findSelectedRecord() || this.associateRecords[0];
  }

  get progressWidth(): string {

    switch (this.currentStep) {
      case 0:
        return '12%';

      case 1:
        return '50%';

      case 2:
        return '100%';

      default:
        return '0%';
    }
  }
}