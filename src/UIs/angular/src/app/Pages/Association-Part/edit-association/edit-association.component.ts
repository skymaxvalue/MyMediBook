import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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

  deptName: string;

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
  readonly STORAGE_KEY = 'associateScheduleDatabaseRows';

  readonly SELECTED_KEY = 'associateScheduleSelected';

  form!: FormGroup;

  selectedIndex = signal(0);
  daysDisabled = true;

  departmentMap = {

    '10': 'Physician',

    '11': 'Cardiology',

    '12': 'Neurology',

    '13': 'Orthopedics',

    '14': 'Pediatrics'

  };
  roleData: Record<string, { id: string; name: string }[]> = {

    '10': [
      { id: '1', name: 'General Physician' },
      { id: '2', name: 'Physical Examiner' },
      { id: '3', name: 'Senior Doctor' }
    ],

    '11': [
      { id: '21', name: 'Cardiologist' },
      { id: '22', name: 'Echo Specialist' }
    ],

    '12': [
      { id: '31', name: 'Neurologist' },
      { id: '32', name: 'Neurosurgeon' }
    ],

    '13': [
      { id: '41', name: 'Orthopedic Surgeon' },
      { id: '42', name: 'Trauma Specialist' }
    ],

    '14': [
      { id: '51', name: 'Pediatrician' },
      { id: '52', name: 'Neonatologist' }
    ]

  };

  roleMap: any = {

    '10': {

      '1': 'General Physician',

      '2': 'Physical Examiner',

      '3': 'Senior Doctor'

    },

    '11': {

      '21': 'Cardiologist',

      '22': 'Echo Specialist'

    },

    '12': {

      '31': 'Neurologist',

      '32': 'Neurosurgeon'

    },

    '13': {

      '41': 'Orthopedic Surgeon',

      '42': 'Trauma Specialist'

    },

    '14': {

      '51': 'Pediatrician',

      '52': 'Neonatologist'

    }


  };
  departmentIds = [
    { id: '10', name: 'Physician' },
    { id: '11', name: 'Cardiology' },
    { id: '12', name: 'Neurology' },
    { id: '13', name: 'Orthopedics' },
    { id: '14', name: 'Pediatrics' }
  ];

  availableRoles = computed(() => {

    const deptId = this.form.get('roleDeptId')?.value;

    return this.roleData[deptId] ?? [];

  });
  back() {

    this.router.navigate(['association/dashboard/association-list']);

  }
  constructor(

    private fb: FormBuilder,

    private route: ActivatedRoute,

    private router: Router

  ) { }

  ngOnInit() {

    this.createForm();

    this.loadData();

  }


  createForm() {

    this.form = this.fb.group({
      name: [{ value: '', disabled: true }],
      dept: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      spec: [{ value: '', disabled: true }],

      from: [{ value: '', disabled: true }],
      to: [{ value: '', disabled: true }],

      fromTime: [{ value: '', disabled: true }],
      toTime: [{ value: '', disabled: true }],

      breakFrom: [{ value: '', disabled: true }],
      breakTo: [{ value: '', disabled: true }],

      duration: [{ value: '', disabled: true }],
      charge: [{ value: '', disabled: true }],

      days: [[]],

      deptId: ['10'],
      deptName: [''],
      roleDeptId: ['10'],
      roleId: [''],
      roleName: ['']
    });

  }

  departmentChanged() {

    const deptId = this.form.get('deptId')?.value;

    const dept = this.departmentIds.find(x => x.id === deptId);

    this.form.patchValue({

      deptName: dept?.name,

      dept: dept?.name

    });

  }
  roleDepartmentChanged() {

    const roles = this.availableRoles();

    if (roles.length) {

      this.form.patchValue({

        roleId: roles[0].id,

        roleName: roles[0].name,

        role: roles[0].name

      });

    }

  }
  confirmRole() {

    this.closeRole();

  }
  confirmDepartment() {

    const deptId = this.form.value.deptId;

    const dept = this.departmentIds.find(x => x.id === deptId);

    if (!dept) return;

    this.form.patchValue({
      dept: dept.name
    });

    this.showDepartmentModal.set(false);
  }
  roleChanged() {

    const deptId = this.form.value.roleDeptId;

    const roleId = this.form.value.roleId;

    const roles = this.roleData[deptId] ?? [];

    const role = roles.find(x => x.id === roleId);

    if (!role) return;

    this.form.patchValue({
      roleName: role.name
    });

  }

  toggleDay(day: string) {

    if (this.daysDisabled) {
      return;
    }

    const days = [...(this.form.value.days || [])];

    const index = days.indexOf(day);

    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }

    this.form.patchValue({
      days
    });

  }
  enableDays() {
    this.daysDisabled = false;
  }
  isSelected(day: string): boolean {

    return (this.form.value.days || []).includes(day);

  }
  loadData() {

    const selected = localStorage.getItem(this.SELECTED_KEY);

    if (selected) {

      const data = JSON.parse(selected);

      this.selectedIndex.set(data.index);

      this.form.patchValue(data);

    }

  }
  save() {

    const rows = JSON.parse(

      localStorage.getItem(this.STORAGE_KEY) ?? '[]'

    );

    rows[this.selectedIndex()] = {

      ...rows[this.selectedIndex()],

      ...this.form.value

    };

    localStorage.setItem(

      this.STORAGE_KEY,

      JSON.stringify(rows)

    );

    this.router.navigate(['/association-list']);

  }

  openDepartment() {

    this.showDepartmentModal.set(true);

  }

  closeDepartment() {

    this.showDepartmentModal.set(false);

  }

  openRole() {

    this.showRoleModal.set(true);

  }

  closeRole() {

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

        fromDate.showPicker?.();
      }
    });

  }
}
