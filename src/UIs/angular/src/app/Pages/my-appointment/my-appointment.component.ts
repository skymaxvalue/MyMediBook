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
import { selectCanceledAppointment } from "src/app/Store/Appointments/appointment.selcetors";
import { TabServiceService } from "src/app/Services/tab-service.service";


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

  selectedMember = signal<any | null>(null);
  currentPage = signal(1);
  pageSize = signal(5);
  user = JSON.parse(localStorage.getItem('user') || 'null')


  constructor(private confirmationService: ModalSeviceService, private store: Store<AppState>, private tabService: TabServiceService) {

  }

  ngOnInit(): void {
    console.log(this.relativeList, this.tableData, "=======>")
  }

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
  clearSelection() {
    this.selectedMember.set(null);
  }

  filteredAppointments = computed(() => {

    const member = this.selectedMember();

    if (!member) {
      return this.sortedTableData(); // Show all appointments
    }

    return this.sortedTableData().filter(
      item => item.patientName === member.fullName
    );

  });

  filteredFamilyMembers = computed(() => {

    const search = this.searchText.toLowerCase();

    if (!search) {
      return this.relativeList();
    }

    return this.relativeList().filter(member =>
      member.fullName.toLowerCase().includes(search)
    );

  });
  selectMember(member: any) {
    this.selectedMember.set(member);
  }
  sortedTableData = computed(() => {

    let data = [...this.tableData()];

    const member = this.selectedMember();

    if (member) {
      data = data.filter(
        item => item.patientName === member.fullName
      );
    }

    const column = this.sortColumn();
    const direction = this.sortDirection();

    if (!column) {
      return data;
    }

    return data.sort((a: any, b: any) => {

      const valueA =
        a[column]?.toString().toLowerCase() || '';

      const valueB =
        b[column]?.toString().toLowerCase() || '';

      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);

    });

  });

  rescheduleAppointment(appointment: any) {
    const appointmentDateTime = new Date(appointment.appointmentDate);

    const [time, period] = appointment.slotStartTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours < 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    const diffInHours =
      (appointmentDateTime.getTime() - now.getTime()) /
      (1000 * 60 * 60);

    if (diffInHours <= 0) {

      this.confirmationService.open({
        title: 'Reschedule Not Allowed',
        message:
          'Rescheduling is not allowed once the appointment time has started.',
        confirmText: 'OK',
        cancelText: ''
      });

      return;
    }

    let message =
      'Are you sure you want to reschedule this appointment?';

    if (diffInHours <= 24) {

      message =
        'This appointment is within the next 24 hours. A reschedule fee of ₹50–₹100 may apply.\n\nDo you want to continue?';

    }

    // this.confirmationService.open({
    //   title: 'Reschedule Appointment',
    //   message,
    //   confirmText: 'Yes, Reschedule',
    //   cancelText: 'No'
    // });

    this.confirmationService.open({
      title: 'Cancel Appointment',
      message: 'Are you sure you want to cancel this appointment?',
      confirmText: 'Cancel Appointment',
      cancelText: 'Keep Appointment',
      data: appointment
    });
    this.confirmationService.response$
      .pipe(take(1))
      .subscribe((confirmed) => {
        console.log('Subscriber called');
        if (confirmed) {
          this.tabService.setReschedulePatient(appointment);
          // this.tabService.changeTab('specialities');
          // Open doctor availability page here
        }

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
  cancelAppointment(appointment: any) {

    const appointmentDateTime = new Date(appointment.appointmentDate);

    const [time, period] = appointment.slotStartTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) {
      hours += 12;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    // Set the appointment time
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    const diffInHours =
      (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    console.log('Appointment:', appointmentDateTime);
    console.log('Current:', now);
    console.log('Difference in Hours:', diffInHours);
    // Appointment already started
    if (diffInHours <= 0) {

      this.confirmationService.open({
        title: 'Cancellation Not Allowed',
        message: 'Cancellation is not allowed once the appointment has started.',
        confirmText: 'OK',
        cancelText: '',
      });

      this.confirmationService.response$
        .pipe(take(1))
        .subscribe(() => { });

      return;
    }

    let message = 'Are you sure you want to cancel this appointment?';



    if (diffInHours <= 24) {

      message =
        'This appointment is within the next 24 hours. A cancellation fee of ₹50–₹100 may apply.\n\nDo you want to continue?';
    }

    this.confirmationService.open({
      title: 'Cancel Appointment',
      message,
      confirmText: 'Yes, Cancel',
      cancelText: 'No'
    });

    this.confirmationService.response$
      .pipe(take(1))
      .subscribe(async (confirmed) => {

        if (confirmed) {

          await this.store.dispatch(
            cancelMyAppointment({
              patientId: this.user.patientId,
              appointmentId: appointment.appointmentId
            })
          )
          await this.store.select(selectCanceledAppointment).subscribe((res: any) => {
            if (res) {
              this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }))
            }
          })


        }

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
    this.tabService.changeTab('specialities');
  }



}