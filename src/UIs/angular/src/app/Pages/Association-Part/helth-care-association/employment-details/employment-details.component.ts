import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: "app-employment-details",
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: "./employment-details.component.html",
  styleUrl: "./employment-details.component.css",
})
export class EmploymentDetailsComponent implements OnInit {

  @Input() group!: FormGroup;
  @Input() roles!: any[];
  @Input() speciality!: any[];
  @Input() departments!: any[];
  @Input() currentStep!: number;
  @Output() back = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();
  dependentRoleData = {
    "data": [
      {
        "roleId": 1,
        "roleName": "Doctor",
        "departments": [
          {
            "departmentId": 1,
            "departmentName": "Heart & Vascular",
            "specialities": [
              {
                "specialityId": 1,
                "specialityName": "Cardiology"
              },
              {
                "specialityId": 2,
                "specialityName": "Cardiac Surgery"
              }
            ]
          }
        ]
      },
      {
        "roleId": 2,
        "roleName": "General Staff",
        "departments": [
          {
            "departmentId": 20,
            "departmentName": "Administration",
            "specialities": [
              {
                "specialityId": 999,
                "specialityName": "Others"
              }
            ]
          }
        ]
      },
      {
        "roleId": 3,
        "roleName": "Account Handler",
        "departments": [
          {
            "departmentId": 10,
            "departmentName": "Finance",
            "specialities": [
              {
                "specialityId": 999,
                "specialityName": "Others"
              }
            ]
          }
        ]
      }
    ]
  }
  designations: any[] = [];
  todayDate = new Date().toISOString().split('T')[0];
  ngOnInit() {

    this.loadRoles();

    this.group.get('roleId')?.valueChanges.subscribe((roleId) => {
      this.onRoleChange(roleId);
    });

    this.group.get('departmentId')?.valueChanges.subscribe((departmentId) => {
      this.onDepartmentChange(departmentId);
    });
  }

  loadRoles() {
    // this.roles = this.dependentRoleData.data;
    this.roles

  }
  onRoleChange(roleId: number) {
    const stateControl = this.group.get('departmentId');
    stateControl?.enable();
    stateControl?.reset();
    const stateControlofDepId = this.group.get('designationId');
    stateControlofDepId?.enable();
    stateControlofDepId?.reset();
    const selectedRole = this.roles.find(
      (x) => x.roleId == roleId
    );
    this.designations = selectedRole?.designations || [];

    this.departments = selectedRole?.departments || [];

    // reset child dropdowns
    this.speciality = [];

    this.group.patchValue({
      departmentId: '',
      specialityId: ''
    });
  }

  onDepartmentChange(departmentId: number) {
    const stateControl = this.group.get('specialityId');
    stateControl?.enable();
    stateControl?.reset();
    const selectedDepartment = this.departments.find(
      (x) => x.departmentId == departmentId
    );

    this.speciality = selectedDepartment?.specialities || [];

    this.group.patchValue({
      specialityId: ''
    });
  }


  submit(): void {

    if (this.group.invalid) {
      this.group.markAllAsTouched();
      return;
    }



    this.submitForm.emit();

  }
}
