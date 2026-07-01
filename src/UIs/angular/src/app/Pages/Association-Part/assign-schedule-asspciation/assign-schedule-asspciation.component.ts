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
import { createAssociatesSchedule, getAllAssociates, getRoleDepaSpecia, getWeekDays } from "src/app/Store/Doctor/doctor.action";
import { selectCreatedAssociateSchedule, selectGelAllAssociate, selectGetRoleDepSpeciOfAssociate, selectGetWeekDays } from "src/app/Store/Doctor/doctor.selectors";


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

  selectedDays: any[] = [];

  allDays: any[] = [];

  associateRecords: any[] = []

  filteredAssociates: any[] = [];
  showDesignation = false;
  summaryData: any[] = [];
  allSpecialities: any;
  allDepartments: any;
  allRoles: any;
  designations: any[] = [];
  departments: any[] = [];
  speciality: any[] = [];

  constructor(private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {


    this.formInitialization();

    this.scheduleForm.get('roleId')?.valueChanges.subscribe((roleId) => {
      this.onRoleChange(roleId);
    });

    this.scheduleForm.get('departmentId')?.valueChanges.subscribe((departmentId) => {
      this.onDepartmentChange(departmentId);
    });

    this.updateNameOptions();
    this.initialApiCall()
  }

  formInitialization() {
    this.scheduleForm = this.fb.group({
      designationId: ["", Validators.required],
      associateId: [null, Validators.required],
      departmentId: ["", Validators.required],
      roleId: ["", Validators.required],
      specialityId: [""],

      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],

      fromTime: ['10:00 AM', Validators.required],
      toTime: ['10:00 PM', Validators.required],

      breakTimeFrom: ['02:00 PM'],
      breakTimeTo: ['06:00 PM'],

      consultationTime: [30, Validators.required],
      averageCharge: [100, Validators.required]
    });
  }

  initialApiCall() {
    this.store.dispatch(getAllAssociates())
    this.store.dispatch(
      getRoleDepaSpecia());


    this.store.select(selectGelAllAssociate).subscribe((res: any) => {
      this.associateRecords = res

    })
    this.store.select(selectGetRoleDepSpeciOfAssociate).subscribe((res: any) => {
      if (res) {
        this.allRoles = res
      }
    })

    this.store.dispatch(getWeekDays());

    this.store.select(selectGetWeekDays).subscribe((res: any) => {
      this.allDays = res

    })


  }

  onRoleChange(roleId: number) {

    const selectedRole = this.allRoles.find(
      (x: any) => x.roleId == roleId
    );
    this.designations = selectedRole?.designations || [];

    this.departments = selectedRole?.departments || [];

  }

  onDepartmentChange(departmentId: number) {

    const selectedDepartment = this.departments.find(
      (x) => x.departmentId == departmentId
    );

    this.speciality = selectedDepartment?.specialities || [];


  }

  updateNameOptions(): void {

    const department =
      this.scheduleForm.get('departmentId')?.value;

    this.filteredAssociates =
      this.associateRecords.filter(
        x =>
          !department ||
          x.department === department
      );

    this.scheduleForm.patchValue({
      associateId: '',
      associateSpeciality: ''
    });
  }

  updateSpeciality(event: any): void {

    const record = this.associateRecords.find(
      x => x.associateId == event.target.value
    );

    if (!record) return;


    const designationControl = this.scheduleForm.get('designationId');
    this.showDesignation = !!record.designationId;
    if (record.designationId) {
      designationControl?.setValidators([Validators.required]);
    } else {
      designationControl?.clearValidators();
      designationControl?.setValue('');
    }

    designationControl?.updateValueAndValidity();

    this.scheduleForm.patchValue({
      roleId: record.roleId,
      departmentId: record.departmentId,
      specialityId: record.specialityId
    });

    if (record.designationId) {
      this.scheduleForm.patchValue({
        designationId: record.designationId
      });
    }
  }

  findSelectedRecord() {

    const form = this.scheduleForm.value;

    return this.associateRecords.find(
      x => x.associateId == form.associateId
    );
  }

  toggleDay(day: any): void {

    const index = this.selectedDays.indexOf(day);

    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
  }

  isDaySelected(day: any): boolean {
    return this.selectedDays.includes(day);
  }

  validateCurrentStep(): boolean {

    if (this.currentStep === 0) {


      const controls = [
        'associateId',
        'roleId',
        'departmentId'
      ];



      if (this.showDesignation) {
        controls.push('designationId');
      }

      controls.forEach(control => {
        this.scheduleForm.get(control)?.markAsTouched();

      });

      return controls.every(control =>
        this.scheduleForm.get(control)?.valid
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

      return controls.every(control =>
        this.scheduleForm.get(control)?.valid
      );
    }

    return true;
  }

  convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }

    return `${hours.padStart(2, '0')}:${minutes}:00`;
  }

  openAssociatePopup(): void {

    const record = this.findSelectedRecord();
    if (!this.validateCurrentStep()) {
      alert('Please fill all required fields');
      return;
    }

    if (!record) {
      alert('Please select matching Department, Name and Role.');
      return;
    }

    this.associateModal = true;
  }

  closeAssociatePopup(): void {
    this.associateModal = false;
  }

  confirmAssociate(): void {
    window.scroll(0, 0)
    this.associateModal = false;
    this.currentStep = 1;
  }

  nextStep(): void {

    if (!this.validateCurrentStep()) {
      return;
    }

    this.currentStep++;
    window.scroll(0, 0)
  }

  previousStep(): void {

    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async submitSchedule() {

    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.scheduleForm.value,
      associateId: Number(this.scheduleForm.value.associateId),
      workingDays: this.selectedDays.join(","),
      fromTime: this.convertTo24Hour(this.scheduleForm.value.fromTime),
      toTime: this.convertTo24Hour(this.scheduleForm.value.toTime),
      breakTimeFrom: this.convertTo24Hour(this.scheduleForm.value.breakTimeFrom),
      breakTimeTo: this.convertTo24Hour(this.scheduleForm.value.breakTimeTo),
      otpMethod: "mobile",
      createdBy: "Created By Admin"

    }

    await this.store.dispatch(createAssociatesSchedule({ associate: payload }))
    await this.store.select(selectCreatedAssociateSchedule).subscribe((res: any) => {
      if (res) {
        this.successModal = true

        this.populateSummary();
      }
    })


  }

  populateSummary(): void {

    const form = this.scheduleForm.value;

    const associate = this.associateRecords.find(
      x => x.associateId == form.associateId
    );

    const department = this.departments.find(
      x => x.departmentId == form.departmentId
    );

    const role = this.allRoles.find(
      (x: any) => x.roleId == form.roleId
    );

    const designation = this.designations.find(
      x => x.designationId == form.designationId
    );

    const speciality = this.speciality.find(
      x => x.specialityId == form.specialityId
    );

    const selectedDayNames = this.allDays
      .filter(day => this.selectedDays.includes(day.weekdayId))
      .map(day => day.dayName)
      .join(', ');

    this.summaryData = [
      {
        label: 'Associate',
        value: `${associate?.firstName ?? ''} ${associate?.lastName ?? ''}`
      },
      {
        label: 'Role',
        value: role?.roleName ?? ''
      },
      {
        label: 'Department',
        value: department?.departmentName ?? ''
      },
      {
        label: 'Designation',
        value: designation?.designationName ?? ''
      },
      {
        label: 'Speciality',
        value: speciality?.specialityName ?? ''
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
        value: selectedDayNames
      },
      {
        label: 'Consultation Time',
        value: `${form.consultationTime} minuts`
      },
      {
        label: "Consultation Fee",
        value: `${form.averageCharge}`
      }
    ];
  }

  closeSuccessModal(): void {
    this.successModal = false;
  }

  get modalRecord() {
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