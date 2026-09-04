import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UpdateAssociateScheduleRequest } from 'src/app/core/Models/Association-model';
import { AppState } from 'src/app/Store/app.state';
import { getAssociatesByID, getRoleDepaSpecia, getWeekDays, updateAssociatesAndItsSchedule } from 'src/app/Store/Doctor/doctor.action';
import { selectGetAssociateDetailsByItID, selectGetRoleDepSpeciOfAssociate, selectGetWeekDays, selectUpdateAssociateDetailsByItID } from 'src/app/Store/Doctor/doctor.selectors';

interface AssociateSchedule {

  id: number;

  name: string;

  dept: string;

  role: string;

  spec: string;

  from: string;

  to: string;

  fromTime: string;

  toTime: string;

  breakFrom: string;

  breakTo: string;

  duration: string;

  charge: string;

  time: string;

  days: string[];

  deptId: string;

  departmentName: string;

  roleDeptId: string;

  roleId: string;

  roleName: string;

}

@Component({
  selector: "app-edit-association",
  imports: [CommonModule,
    ReactiveFormsModule],
  templateUrl: "./edit-association.component.html",
  styleUrl: "./edit-association.component.css",
})
export class EditAssociationComponent implements OnInit {
  showDepartmentModal = signal(false);
  showRoleModal = signal(false);
  showDesignationModal = signal(false);
  showSpecialityModal = signal(false);
  daysDisabled = signal(true);
  loginUser: any = JSON.parse(localStorage.getItem('user') ?? '{}');

  originalRoleId!: number;
  roleSelectionChanged = false;
  departments: any[] = [];
  specialities: any[] = [];
  readonly STORAGE_KEY = 'associateScheduleDatabaseRows';

  readonly SELECTED_KEY = 'associateScheduleSelected';

  form!: FormGroup;
  associate: any = null

  selectedIndex = signal(0);




  associateId: any;
  allRoles: any[] = [];
  weekDays: any[] = []
  designations: any[] = [];
  selectedRole: any = null;
  back() {

    this.router.navigate(['/admin/associate-list']);

  }
  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.createForm();

    this.loadData();
    this.store.dispatch(
      getRoleDepaSpecia());
    this.associateId = Number(
      this.route.snapshot.paramMap.get('associateId')
    );
    this.store.dispatch(getWeekDays())
    this.store.select(selectGetRoleDepSpeciOfAssociate)
      .subscribe(res => {

        this.allRoles = res ?? [];

        console.log("Roles Loaded", this.allRoles);

        this.setSelectedRole();

      });
    this.store.select(selectGetWeekDays).subscribe((res: any) => {
      if (res) {

        this.weekDays = res;
      }
    })
    if (this.associateId) {
      this.store.dispatch(getAssociatesByID({ associateId: this.associateId }))

      this.store.select(selectGetAssociateDetailsByItID).subscribe((res) => {

        if (res) {
          this.associate = res
          this.setSelectedRole();
          this.originalRoleId = res.roleId;
          this.selectedRole = this.allRoles.find(
            (x) => x.roleId == this.associate.roleId
          );
          this.form.patchValue({
            firstName: res.firstName,
            middleName: res.middleName,
            lastName: res.lastName,

            roleName: res.roleName,
            roleId: res.roleId,
            departmentName: res.departmentName,
            specialityName: res.specialityName,
            specialityId: res.specialityId,
            departmentId: res.departmentId,
            roleDeptId: res.roleDeptId,
            designationName: res.designationName,
            designationId: res.designationId,
            fromDate: res.schedule.fromDate.substring(0, 10),
            toDate: res.schedule.toDate.substring(0, 10),

            fromTime: this.to12Hour(res.schedule.fromTime),
            toTime: this.to12Hour(res.schedule.toTime),
            breakTimeFrom: this.to12Hour(res.schedule.breakTimeFrom),
            breakTimeTo: this.to12Hour(res.schedule.breakTimeTo),

            consultationTime: res.schedule.consultationTime,
            averageCharge: res.schedule.averageCharge,

            // days: this.mapWorkingDays(res.schedule.workingDays)
          });

          if (this.weekDays.length) {
            this.preSelectWorkingDays(res.schedule.workingDays);
          }
          console.log("Roles", this.allRoles);
          console.log("Associate RoleId", res.roleId);

          const selectedRole = this.allRoles.find(
            x => x.roleId == res.roleId
          );

          console.log("Selected", selectedRole);
        }


      })

    }



  }
  private setSelectedRole() {
    console.log("Associate", this.associate);
    console.log("Roles", this.allRoles);
    if (!this.associate) return;

    if (!this.allRoles.length) return;

    this.selectedRole =
      this.allRoles.find(x => x.roleId == this.associate.roleId);

    console.log("Selected Role =>", this.selectedRole);

  }

  to12Hour(time: string): string {

    if (!time) return '';

    let [hour, minute] = time.split(':').map(Number);

    const ampm = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;

    if (hour === 0) hour = 12;

    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')} ${ampm}`;
  }

  createForm() {
    this.form = this.fb.group({
      firstName: [{ value: '', disabled: true }],
      middleName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],

      departmentId: [{ value: '', disabled: true }],
      roleId: [{ value: '', disabled: true }],
      specialityId: [{ value: '', disabled: true }],
      designationId: [{ value: '', disabled: true }],
      designationName: [{ value: '', disabled: true }],

      departmentName: [{ value: '', disabled: true }],
      roleName: [{ value: '', disabled: true }],

      specialityName: [{ value: '', disabled: true }],

      fromDate: [{ value: '', disabled: true }],
      toDate: [{ value: '', disabled: true }],

      fromTime: [{ value: '', disabled: true }],
      toTime: [{ value: '', disabled: true }],

      breakTimeFrom: [{ value: '', disabled: true }],
      breakTimeTo: [{ value: '', disabled: true }],

      consultationTime: [{ value: '', disabled: true }],
      averageCharge: [{ value: '', disabled: true }],

      days: [[]],

    });


  }
  mapWorkingDays(days: string): string[] {

    if (!days) return [];

    return days
      .split(',')
      .map(id => {
        const day = this.weekDays.find(
          x => x.weekdayId === Number(id)
        );

        return day?.dayName;
      })
      .filter(Boolean) as string[];

  }
  onSpecialitiesChange() {
    console.log(this.selectedRole.designations, "=========>", "selectedRole.designations")
    const currentSpecialityId = Number(this.form.value.specialityId);

    console.log(this.selectedRole, "=========>", "selectedRole")
    const selectedSpeciality = this.specialities.find(
      x => x.specialityId === currentSpecialityId
    );
    console.log(selectedSpeciality, "=========>", "selectedSpeciality")

    if (!selectedSpeciality) {

      return;
    }
    this.form.patchValue({
      specialityId: selectedSpeciality.specialityId,
      specialityName: selectedSpeciality.specialityName
    });

  }

  closeSpecialityModal() {
    this.showSpecialityModal.set(false);
  }

  confirmSpeciality() {
    const specialityId = Number(this.form.value.specialityId);
    const speciality = this.specialities.find(
      x => x.specialityId === specialityId
    );

    if (!speciality) return;
    this.form.patchValue({
      specialityId: specialityId,
      specialityName: speciality.specialityName
    });
    console.log(speciality, "=========>", "speciality", this.selectedRole)
    this.showSpecialityModal.set(false);

  }

  onRoleChange(roleId: any) {

    const currentRoleId = Number(roleId);

    this.roleSelectionChanged = currentRoleId !== this.originalRoleId;

    const selectedRole = this.selectedRole = this.allRoles.find(
      x => x.roleId === currentRoleId
    );

    if (!selectedRole) {
      this.departments = [];
      this.designations = [];
      return;
    }

    this.departments = selectedRole.departments;
    this.designations = selectedRole.designations;
    console.log(this.departments, "=========>", "departments")

    this.form.patchValue({
      roleId: selectedRole.roleId,
      roleName: selectedRole.roleName
    });
  }
  onDepartmentChange() {

    const departmentId = Number(this.form.value.departmentId);

    const department = this.departments.find(
      x => x.departmentId === departmentId
    );

    this.specialities = department?.specialities ?? [];

    this.form.patchValue({
      departmentName: department?.departmentName ?? '',
      departmentId: department?.departmentId ?? '',
      specialityId: ''
    });

  }
  onDesignationChange() {
    const designationId = Number(this.form.value.designationId);

    const designation = this.designations.find(
      (x: any) => x.designationId === designationId
    );
    if (designation) {
      this.form.patchValue({
        designationName: designation.designationName
      });
    }
  }
  openDesignation() {
    this.form.get('designationId')?.enable();
    this.showDesignationModal.set(true);
  }
  openSpecialityModal() {

    this.form.get('specialityId')?.enable();
    this.showSpecialityModal.set(true);
  }
  closeDesignation() {
    this.showDesignationModal.set(false);
  }
  preSelectWorkingDays(workingDays: string) {

    if (!workingDays || !this.weekDays.length) return;

    const selectedIds = workingDays.split(',').map(Number);

    const dayNames = this.weekDays
      .filter(x => selectedIds.includes(x.weekdayId))
      .map(x => x.dayName);

    this.form.patchValue({
      days: dayNames
    });

  }

  confirmRole() {
    if (this.roleSelectionChanged) {

      this.form.patchValue({
        departmentId: '',
        departmentName: '',
        specialityId: '',
        specialityName: ''
      });

      // this.departments = [];
      // this.specialities = [];
    }

    this.form.get('roleId')?.disable();

    this.closeRole();


  }

  confirmDesignation() {
    const designationId = Number(this.form.value.designationId);

    const designation = this.designations.find(
      (x: any) => x.designationId === designationId
    );
    if (designation) {
      this.form.patchValue({
        designationName: designation.designationName
      });
    }
    this.showDesignationModal.set(false);
  }
  confirmDepartment() {

    const deptId = Number(this.form.value.departmentId)

    const dept = this.departments.find(x => x.departmentId === deptId);

    if (!dept) return;

    this.form.patchValue({
      departmentName: dept.departmentName,
      departmentId: dept.departmentId

    });

    this.showDepartmentModal.set(false);
  }


  toggleDay(day: string) {

    if (this.daysDisabled()) {
      return;
    }

    const days = [...(this.form.value.days || [])];

    const index = days.indexOf(day);

    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }
    this.form.get('days')?.setValue(days);

  }

  isSelected(day: string): boolean {
    const days = this.form.get('days')?.value;

    return Array.isArray(days) && days.includes(day);
  }
  enableDays() {
    this.daysDisabled.set(false);
  }

  loadData() {

    const selected = localStorage.getItem(this.SELECTED_KEY);

    if (selected) {

      const data = JSON.parse(selected);

      this.selectedIndex.set(data.index);

      this.form.patchValue(data);

    }

  }
  to24Hour(time: string): string {
    if (!time) return '';

    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:00`;
  }
  save() {
    // alert("Data Saved Successfully")

    console.log(this.form.getRawValue(), "=========>", "this.form.value")

    const workingDays = this.form.value.days
      .map((day: string) => {
        return this.weekDays.find(x => x.dayName === day)?.weekdayId;
      })
      .filter((id: string | null) => id != null)
      .join(',')

    const payload = {
      associateId: this.associateId,
      roleId: this.form.get('roleId')?.value,
      departmentId: this.form.get('departmentId')?.value,
      specialityId: this.form.get('specialityId')?.value,
      designationId: this.form.get('designationId')?.value,
      fromDate: new Date(this.form.get('fromDate')?.value) ? new Date(this.form.get('fromDate')?.value)?.toISOString() : null,
      toDate: new Date(this.form.get('toDate')?.value) ? new Date(this.form.get('toDate')?.value)?.toISOString() : null,

      fromTime: this.to24Hour(this.form.get('fromTime')?.value) ? this.to24Hour(this.form.get('fromTime')?.value) : null,
      toTime: this.to24Hour(this.form.get('toTime')?.value) ? this.to24Hour(this.form.get('toTime')?.value) : null,

      breakTimeFrom: this.to24Hour(this.form.get('breakTimeFrom')?.value) ? this.to24Hour(this.form.get('breakTimeFrom')?.value) : null,
      breakTimeTo: this.to24Hour(this.form.get('breakTimeTo')?.value) ? this.to24Hour(this.form.get('breakTimeTo')?.value) : null,

      workingDays: workingDays ? workingDays : null,

      consultationTime: Number(this.form.get('consultationTime')?.value) ? Number(this.form.get('consultationTime')?.value) : null,
      averageCharge: Number(this.form.get('averageCharge')?.value) ? Number(this.form.get('averageCharge')?.value) : null,

      updatedBy: this.loginUser.fullName
    };

    console.log(payload);
    this.store.dispatch(updateAssociatesAndItsSchedule({ associate: payload }))
    this.store.select(selectUpdateAssociateDetailsByItID).subscribe((res: any) => {
      if (res) {
        this.router.navigate(['/admin/associate-list'])
      }
    })


  }

  openDepartment() {
    this.form.get('departmentId')?.enable();

    this.showDepartmentModal.set(true);

    if (!this.roleSelectionChanged) {

      this.form.patchValue({
        departmentId: this.associate.departmentId,
        departmentName: this.associate.departmentName
      });

    }

  }

  closeDepartment() {

    this.showDepartmentModal.set(false);


  }

  openRole() {
    this.form.get('roleId')?.enable();

    this.originalRoleId = this.form.get('roleId')?.value;

    this.showRoleModal.set(true);


  }
  closeRole() {
    // alert(this.form.get('roleId')?.value)
    this.allRoles.find
    this.showRoleModal.set(false);

  }

  enableField(controlName: string, fromDate?: HTMLInputElement | HTMLSelectElement) {

    const control = this.form.get(controlName);

    if (!control) return;

    control.enable();

    setTimeout(() => {
      fromDate?.focus();

      if (fromDate instanceof HTMLInputElement &&
        fromDate.type === 'date') {
        requestAnimationFrame(() => {
          fromDate?.focus();
        });

        fromDate.showPicker?.();
      }
    });

  }
}
