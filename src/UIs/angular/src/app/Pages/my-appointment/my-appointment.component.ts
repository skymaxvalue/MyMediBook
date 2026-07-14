import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal
} from "@angular/core";
import { ModalSeviceService } from "src/app/Services/modal-sevice.service";
import { take } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { cancelMyAppointment, getMyAppointments } from "src/app/Store/Appointments/appointment.actions";
import { selectCanceledAppointment, selectMyAppointmentList } from "src/app/Store/Appointments/appointment.selcetors";
import { TabServiceService } from "src/app/Services/tab-service.service";
import { HostListener } from '@angular/core';
import { cancelRules, rescheduleRules } from "src/app/Utility/EndPointsOfAPI";
import { selectGetProfileListByPatientId } from "src/app/Store/Patient/patient.selectors";
import { getPetirntProfileListById } from "src/app/Store/Patient/patient.action";
import { Router } from "@angular/router";


interface FamilyMember {
  id: number;
  name: string;
  relation: string;
}

@Component({
  selector: "app-my-appointment",
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: "./my-appointment.component.html",
  styleUrl: "./my-appointment.component.css",
})


export class MyAppointmentComponent implements OnInit {
  isPatientDropdownOpen = false;

  selectedPatientName = signal<any>('All Patients');

  searchPatient = '';
  tableData = signal<any[]>([]);
  relativeList = signal<any[]>([]);
  @Input()
  set tableDataInput(value: any[]) {
    this.tableData.set(value ?? []);
  }

  @Input()
  set relativeListInput(value: any[]) {
    this.relativeList.set(value ?? []);
  }
  @Output() goToSpecialitie = new EventEmitter<any>();
  sortColumn = signal('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  searchText = '';
  patientSearch = signal('');
  selectedMember = signal<any | null>(null);
  currentPage = signal(1);
  pageSize = signal(5);
  selectedStatus = signal('');
  statusList = [
    { label: 'All Status', value: '' },
    { label: 'Scheduled', value: 'Scheduled' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  isStatusDropdownOpen = false;
  selectedStatusName = signal('All Status');
  user = JSON.parse(localStorage.getItem('user') || 'null')

  @HostListener('document:click')
  closeDropdown() {
    this.isPatientDropdownOpen = false;
    this.isStatusDropdownOpen = false;

  }
  constructor(private confirmationService: ModalSeviceService, private store: Store<AppState>, private tabService: TabServiceService, private router: Router) {

  }

  ngOnInit() {
    this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }));
    this.store.dispatch(getPetirntProfileListById({ patientId: this.user.patientId }));

    this.store.select(selectMyAppointmentList)
      .subscribe((res: any) => {
        if (res) {
          this.tableData.set(res.data);
        }
      });

    this.store.select(selectGetProfileListByPatientId)
      .subscribe((res: any) => {
        if (res) {
          this.relativeList.set(res.data);
        }
      });
  }

  filteredPatients = computed(() => {

    const search = this.patientSearch().trim().toLowerCase();

    if (!search) {
      return this.relativeList();
    }

    return this.relativeList().filter(patient =>
      patient.fullName.toLowerCase().includes(search) ||
      patient.relationTypeName.toLowerCase().includes(search)
    );

  });
  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  showAllStatus() {
    this.selectedStatus.set('');
    this.selectedStatusName.set('All Status');
    this.currentPage.set(1);
    this.isStatusDropdownOpen = false;
  }

  selectStatus(status: any) {
    this.selectedStatus.set(status.value);
    this.selectedStatusName.set(status.label);
    this.currentPage.set(1);
    this.isStatusDropdownOpen = false;
  }
  togglePatientDropdown() {
    this.isPatientDropdownOpen = !this.isPatientDropdownOpen;
  }
  showAllPatients() {
    this.selectedMember.set(null);
    this.selectedPatientName.set('All Patients');
    this.currentPage.set(1);
    this.isPatientDropdownOpen = false;
  }
  selectPatient(patient: any) {
    this.selectedMember.set(patient);
    this.selectedPatientName.set(patient.fullName);
    this.isPatientDropdownOpen = false;
  }
  filteredAppointments = computed(() => {

    let data = [...this.tableData()];

    // Patient filter
    const member = this.selectedMember();

    if (member) {
      data = data.filter(x => x.profileId === member.profileId);
    }

    // Status filter
    if (this.selectedStatus()) {
      data = data.filter(
        x =>
          (x.appointmentStatus || '').toLowerCase() ===
          this.selectedStatus().toLowerCase()
      );
    }

    // Sorting
    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (column) {
      data = data.sort((a: any, b: any) => {

        const valueA = (a[column] ?? '').toString().toLowerCase();
        const valueB = (b[column] ?? '').toString().toLowerCase();

        return direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    return data;
  });

  paginatedAppointments = computed(() => {
    const data = this.filteredAppointments();

    const start =
      (this.currentPage() - 1) * this.pageSize();

    const end = start + this.pageSize();

    return data.slice(start, end);
  });

  // familyMembers = this.relativeList;

  totalPages = computed(() => {
    return Math.ceil(
      this.filteredAppointments().length /
      this.pageSize()
    );
  });

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
  // SORT FUNCTION
  sortTable(column: string) {

    if (this.sortColumn() === column) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    } else {

      this.sortColumn.set(column);

      this.sortDirection.set('asc');

    }

  }

  private getAppointmentDateTime(appointment: any): Date {

    const [datePart] = appointment.appointmentDate.split(' ');
    const [month, day, year] = datePart.split('/').map(Number);

    const appointmentDateTime = new Date(year, month - 1, day);

    const [time, period] = appointment.slotStartTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    return appointmentDateTime;
  }
  rescheduleAppointment(appointment: any) {
    const rule: any[] = rescheduleRules
    const appointmentDateTime = this.getAppointmentDateTime(appointment);

    const now = new Date();

    const diffInHours =
      (appointmentDateTime.getTime() - now.getTime()) /
      (1000 * 60 * 60);

    // Appointment already started
    if (diffInHours <= 0) {

      this.confirmationService.open({
        type: 'reschedule',

        title: 'Reschedule Appointment',
        subTitle: 'Please review before you continue.',

        confirmTitle:
          'Are you sure you want to reschedule this appointment?',

        confirmText:
          'This appointment has already started. Rescheduling is not allowed.',

        confirmButton: 'Reschedule Appointment',
        cancelButton: 'Close',

        appointment,

        rules: rule,

        disableConfirm: false,
        infoMessage: 'You can reschedule this appointment up to 2 times.'
      });

      return;
    }

    // Within 24 Hours
    if (diffInHours <= 24) {

      this.confirmationService.open({
        type: 'reschedule',

        title: 'Reschedule Appointment',
        subTitle: 'Please review before you continue.',

        confirmTitle:
          'Are you sure you want to reschedule this appointment?',

        confirmText:
          'This appointment is within the next 24 hours. A reschedule fee may apply.',

        confirmButton: 'Reschedule Appointment',
        cancelButton: 'Keep Appointment',

        appointment,

        rules: rule,

        disableConfirm: false,
        infoMessage: 'You can reschedule this appointment up to 2 times.'
      });

    } else {

      // More than 24 Hours
      this.confirmationService.open({
        type: 'reschedule',

        title: 'Reschedule Appointment',
        subTitle: 'Please review before you continue.',

        confirmTitle:
          'Are you sure you want to reschedule this appointment?',

        confirmText:
          "You'll be redirected to the doctor's availability page to choose a new available date and time.",

        confirmButton: 'Reschedule Appointment',
        cancelButton: 'Keep Appointment',

        appointment,

        rules: rule,

        disableConfirm: false,
        infoMessage: 'You can reschedule this appointment up to 2 times.'
      });

    }

    this.confirmationService.response$
      .pipe(take(1))
      .subscribe((confirmed) => {

        if (!confirmed) {
          return;
        }

        this.router.navigate(
          ['/patient/dashboard/appointment-reschedule'],
          {
            state: {
              appointment
            }
          }
        );

        // this.tabService.setReschedulePatient(appointment);

        // // Navigate to Specialities page
        // this.tabService.changeTab('specialities');

      });

  }
  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'status-scheduled';

      case 'cancelled':
      case 'canceled':
        return 'status-cancelled';

      case 'upcoming':
        return 'status-upcoming';

      case 'completed':
        return 'status-completed';

      default:
        return 'status-default';
    }
  }
  // cancelAppointment(appointment: any) {

  //   this.confirmationService.open({
  //     title: 'Cancel Appointment',
  //     message: 'Are you sure you want to cancel this appointment?',
  //     confirmText: 'Yes, Cancel',
  //     cancelText: 'No'
  //   });

  //   this.confirmationService.response$
  //     .pipe(take(1))
  //     .subscribe((confirmed) => {

  //       if (confirmed) {
  //         // this.cancelAppointmentApi(appointment.id);
  //         this.store.dispatch(cancelMyAppointment({ patientId: this.user.patientId, appointmentId: appointment.appointmentId }))
  //         this.store.select(selectCanceledAppointment).subscribe((res: any) => {
  //           if (res) {
  //             this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }))
  //           }
  //         })
  //       }

  //     });
  // }
  //   cancelAppointment(appointment: any) {

  //     const appointmentDateTime = new Date(appointment.appointmentDate);

  //     const [time, period] = appointment.slotStartTime.split(' ');
  //     let [hours, minutes] = time.split(':').map(Number);

  //     // Convert to 24-hour format
  //     if (period === 'PM' && hours < 12) {
  //       hours += 12;
  //     }

  //     if (period === 'AM' && hours === 12) {
  //       hours = 0;
  //     }

  //     // Set the appointment time
  //     appointmentDateTime.setHours(hours, minutes, 0, 0);

  //     const now = new Date();

  //     const diffInHours =
  //       (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  //     console.log('Appointment:', appointmentDateTime);
  //     console.log('Current:', now);
  //     console.log('Difference in Hours:', diffInHours);
  //     // Appointment already started
  //     if (diffInHours <= 0) {
  // this.confirmationService.open({
  //   type: 'cancel',

  //   title: 'Cancel Appointment',
  //   subTitle: 'Please review before you proceed.',

  //   confirmTitle: 'Are you sure you want to cancel this appointment?',
  //   confirmText: 'This action cannot be undone.',

  //   confirmButton: 'Cancel Appointment',
  //   cancelButton: 'Keep Appointment',

  //   appointment,

  //   rules: [
  //     {
  //       type: 'success',
  //       title: 'Free cancellation',
  //       description: 'Up to 24 hours before your appointment.'
  //     },
  //     {
  //       type: 'warning',
  //       title: 'Late cancellation fee may apply',
  //       description:
  //         'If cancelled after 24 hours, a cancellation fee may apply.'
  //     },
  //     {
  //       type: 'danger',
  //       title: 'Cannot cancel after start time',
  //       description:
  //         'Once the appointment has started, cancellation is not allowed.'
  //     }
  //   ]
  // });
  //       // this.confirmationService.open({
  //       //   title: 'Cancellation Not Allowed',
  //       //   message: 'Cancellation is not allowed once the appointment has started.',
  //       //   confirmText: 'OK',
  //       //   cancelText: '',
  //       // });

  //       this.confirmationService.response$
  //         .pipe(take(1))
  //         .subscribe(() => { });

  //       return;
  //     }

  //     let message = 'Are you sure you want to cancel this appointment?';



  //     if (diffInHours <= 24) {

  //       message =
  //         'This appointment is within the next 24 hours. A cancellation fee of ₹50–₹100 may apply.\n\nDo you want to continue?';
  //     }

  //     this.confirmationService.open({
  //       title: 'Cancel Appointment',
  //       message,
  //       confirmText: 'Yes, Cancel',
  //       cancelText: 'No'
  //     });

  //     this.confirmationService.response$
  //       .pipe(take(1))
  //       .subscribe(async (confirmed) => {

  //         if (confirmed) {

  //           await this.store.dispatch(
  //             cancelMyAppointment({
  //               patientId: this.user.patientId,
  //               appointmentId: appointment.appointmentId
  //             })
  //           )
  //           await this.store.select(selectCanceledAppointment).subscribe((res: any) => {
  //             if (res) {
  //               this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }))
  //             }
  //           })


  //         }

  //       });

  //   }

  cancelAppointment(appointment: any) {

    const appointmentDateTime = new Date(appointment.appointmentDate);

    const [time, period] = appointment.slotStartTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    const diffInHours =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);


    const rules = cancelRules


    const modalData: any = {
      type: 'cancel',
      title: 'Cancel Appointment',
      subTitle: 'Please review before you proceed.',
      confirmTitle: 'Are you sure you want to cancel this appointment?',
      confirmText: '',
      confirmButton: 'Cancel Appointment',
      cancelButton: 'Keep Appointment',
      appointment,
      rules,
      disableConfirm: false
    };

    // Appointment already started
    if (diffInHours <= 0) {

      modalData.confirmText =
        'This appointment has already started. Cancellation is not allowed.';

      modalData.confirmButton = 'Cancel Appointment';
      modalData.cancelButton = 'Close';
      modalData.disableConfirm = true;

    }

    // Within 24 Hours
    else if (diffInHours <= 24) {

      modalData.confirmText =
        'This appointment is within the next 24 hours. A cancellation fee may apply. Do you want to continue?';

    }

    // More than 24 Hours
    else {

      modalData.confirmText =
        'You can cancel this appointment free of charge.';

    }

    this.confirmationService.open(modalData);

    this.confirmationService.response$
      .pipe(take(1))
      .subscribe((confirmed) => {

        if (!confirmed || diffInHours <= 0) return;
        const payload = {
          appointmentId: appointment.appointmentId,
          patientId: this.user.patientId,
          cancelReason: "string",
          lastUpdatedBy: this.user.firstName + " " + this.user.lastName,
          associateRole: this.user.userType
        }

        this.store.dispatch(
          cancelMyAppointment({
            ...payload
          })
        );

        this.store
          .select(selectCanceledAppointment)
          .pipe(take(1))
          .subscribe((res) => {
            if (res) {
              this.store.dispatch(
                getMyAppointments({
                  patientId: this.user.patientId
                })
              );
            }
          });

      });

  }
  getSortIcon(column: string): string {

    if (this.sortColumn() !== column) {
      return '▼';
    }

    return this.sortDirection() === 'asc'
      ? '▲'
      : '▼';

  }
  goToSpecialities() {
    // Implement navigation to the specialities page
    this.router.navigate(['/patient/dashboard/specialities'])
  }



}