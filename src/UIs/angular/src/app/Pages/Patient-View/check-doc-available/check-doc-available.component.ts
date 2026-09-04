import { Component, EventEmitter, Input, Output, OnInit, OnChanges, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookAppoimentFormComponent } from "../book-appoiment-form/book-appoiment-form.component";
import { BookingOTPVerificatinComponent } from "../booking-otp-verificatin/booking-otp-verificatin.component";
import { BookingSuccessfullComponent } from "../booking-successfull/booking-successfull.component";
import { BookingFailedComponent } from "../booking-failed/booking-failed.component";
import { Store } from "@ngrx/store";
import { getTimeSloteByDoctorID } from "src/app/Store/Doctor/doctor.action";
import { selectGetTimeSlotOfDoctor } from "src/app/Store/Doctor/doctor.selectors";
import { selectGetProfileListByPatientId } from "src/app/Store/Patient/patient.selectors";
import { selectCreateAppointmentRes, selectRescheduledAppointment } from "src/app/Store/Appointments/appointment.selcetors";
import { take } from "rxjs";
import { ToastService } from "src/app/shared/Components/Toaster/toast.service";
import { createAppointment, getMyAppointments, rescheduleMyAppointment } from "src/app/Store/Appointments/appointment.actions";
import { BookingPatientInformationComponent } from "../../Front-Office-View/booking-patient-information/booking-patient-information.component";
interface ScheduleItem {
  date: Date;
  formattedDate: string;
  badgeClass: 'green' | 'red' | 'beige';
  text: string;
  isHighlighted?: boolean;
}
@Component({
  selector: "app-check-doc-available",
  imports: [CommonModule, FormsModule, BookAppoimentFormComponent, BookingOTPVerificatinComponent, BookingSuccessfullComponent, BookingFailedComponent, BookingPatientInformationComponent],
  templateUrl: "./check-doc-available.component.html",
  styleUrl: "./check-doc-available.component.css",
})
export class CheckDocAvailableComponent implements OnInit, OnChanges {
  @Input() doctor: any = {}
  @Input() updatesheduledpatient: any = null
  @Output() backToSpecialities = new EventEmitter<void>();

  today: Date = new Date();
  currentStartDate: any;
  minDate: string = '';
  selectedDate: string = '';
  showBookingCunfermationOtp = false;
  showBookingSuccess = false;
  bookingPatient: any = {};
  schedule: ScheduleItem[] = [];
  showBookingFaild = false;
  showSlotsModal = false;
  selectedDateGlobal = '';
  selectedSlot: any = null;
  ShowAddbookingAppoinmentForm: boolean = false;
  isFrontOfficePageBookForm: boolean = false;
  highlightDate = '';
  otpDevice: { otpDevice: string, value: string } = { otpDevice: 'email', value: '' };

  allSlots: string[] = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  slots: { time: string; booked: boolean }[] = [];
  showAddbookingAppoinmentForm: boolean = false
  ProfileList: any[] = [];
  maxDate: string = '';
  isFrontOfficePage: boolean = false

  constructor(private router: Router, private store: Store, private toast: ToastService) {
    // this.generateSlots(this.doctor.fromTime, this.doctor.toTime, 30)
  }

  ngOnInit(): void {

    const navigation = this.router.getCurrentNavigation();


    console.log(this.doctor);
    if (navigation?.extras.state) {

      this.doctor = navigation.extras.state['doctor'];



      this.updatesheduledpatient = navigation.extras.state['appointment'];
    } else {

      this.doctor = history.state.doctor;
      this.updatesheduledpatient = history.state.appointment;
      this.isFrontOfficePage = history.state.isFrontOfficePage;
    }

    console.log('Doctor =>', this.doctor);
    console.log('Appointment =>', this.updatesheduledpatient);

    if (!this.doctor) {
      console.error('Doctor data not found');
      return;
    }

    this.minDate = this.toInputDate(this.today.toLocaleDateString('en-GB'));
    this.maxDate = this.toInputDate(this.doctor.toDate);


    if (this.updatesheduledpatient) {

      this.highlightDate = this.formatInputDate(
        new Date(this.updatesheduledpatient.appointmentDate)
      );

      // this.selectedDate = this.highlightDate;
    } else {



    }
    this.selectedDate = this.minDate;
    // this.selectedDate = this.minDate;
    this.currentStartDate = new Date(this.selectedDate);

    this.generateSchedule(new Date(this.selectedDate));


  }
  ngOnChanges(): void {
    // if (this.doctor?.fromTime && this.doctor?.toTime) {
    //   this.generateSlots(
    //     this.doctor.fromTime,
    //     this.doctor.toTime,
    //     30
    //   );
    // }
  }

  toInputDate(dateStr: string) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }



  formatDate(date: Date): string {
    const day = date.toLocaleDateString('en-GB', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return `${day.toUpperCase()} - ${formattedDate.toUpperCase()}`;
  }

  generateSchedule(startDate: Date): void {
    const appointmentDate = this.updatesheduledpatient
      ? this.formatInputDate(new Date(this.updatesheduledpatient.appointmentDate))
      : '';

    this.schedule = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);

      let badgeClass: 'green' | 'red' | 'beige' = 'green';
      let text = `${this.getAmPmTime(this.doctor.fromTime)} - ${this.getAmPmTime(this.doctor.toTime)}`

      if (i === 4) {
        badgeClass = 'red';
      }

      if (i === 6) {
        badgeClass = 'beige';
        text = 'Dr. Unavailable';
      }

      this.schedule.push({
        date: d,
        formattedDate: this.formatDate(d),
        badgeClass,
        text,
        isHighlighted:
          this.updatesheduledpatient &&
          this.formatInputDate(d) ===
          this.formatInputDate(new Date(this.updatesheduledpatient.appointmentDate))
      });
    }
  }

  async rescheduleAppointment() {
    // this.st
    if (!this.selectedSlot) {
      this.toast.error('Error', 'Please select a time slot for rescheduling the appointment');
      return;
    }
    await this.store.dispatch(rescheduleMyAppointment({
      patientId: this.updatesheduledpatient.patientId,
      appointmentId: this.updatesheduledpatient.appointmentId,
      associateId: this.doctor.associateId,
      slotId: this.selectedSlot.slotId,
      visitPurpose: this.updatesheduledpatient.visitPurpose,
      visitType: this.updatesheduledpatient.visitType
    }))
    await this.store.select(selectRescheduledAppointment).subscribe((res: any) => {
      if (res) {
        this.showSlotsModal = false;
        this.bookingPatient = this.updatesheduledpatient
        this.showBookingSuccess = true;

        this.store.dispatch(getMyAppointments({ patientId: this.updatesheduledpatient.patientId }))


      }
    })
  }

  onDateChange(): void {
    console.log(this.selectedDate)
    this.currentStartDate = new Date(this.selectedDate);
    console.log(this.currentStartDate, "======>")
    this.generateSchedule(this.currentStartDate);
  }

  nextWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.selectedDate = this.formatInputDate(this.currentStartDate);
    this.generateSchedule(this.currentStartDate);
  }

  prevWeek(): void {
    const newDate = new Date(this.currentStartDate);
    newDate.setDate(newDate.getDate() - 7);

    const min = new Date(this.minDate);

    if (newDate >= min) {
      this.currentStartDate = newDate;
      this.selectedDate = this.formatInputDate(this.currentStartDate);
      this.generateSchedule(this.currentStartDate);
    }

  }
  formatInputDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  async openSlotsPopup(item: ScheduleItem) {
    console.log(item)
    if (item.badgeClass === 'beige') {
      return;
    }

    this.selectedDateGlobal = item.formattedDate;
    this.selectedSlot = '';
    // hare call API
    console.log(this.selectedDate, this.doctor, "=====>====>")

    const payload = {
      associateId: this.doctor.associateId,
      fromDate: new Date(item.date).toISOString(),
      toDate: new Date(item.date).toISOString(),

    }
    await this.store.dispatch(getTimeSloteByDoctorID({ payload }))
    await this.store.select(selectGetTimeSlotOfDoctor)
      .subscribe((res: any) => {

        if (res?.data) {

          this.slots = res.data.map((slot: any) => ({
            time: slot.startTime,
            booked: slot.isBooked,
            slotId: slot.slotId,
            isAvailable: slot.isAvailable
          }));
          this.showSlotsModal = true;
          if (this.slots.length > 1) {


          } else {
            this.toast.info('info', "Time slote is not available")
          }




          // console.log(res, "=========>")
          // let bookedSlots: string[] = [];

          // if (item.badgeClass === 'red') {
          //   bookedSlots = this.allSlots.slice(0, 10);
          // } else {
          //   bookedSlots = this.allSlots.slice(0, 3);
          // }

          // this.slots = this.allSlots.map(slot => ({
          //   time: slot,
          //   booked: bookedSlots.includes(slot)
          // }));
          // this.showSlotsModal = true;
        }

      })



  }

  selectSlot(slot: any): void {
    this.selectedSlot = slot;
  }

  closeSlotsModal(): void {
    this.showSlotsModal = false;
  }

  goToBooking(): void {


    if (!this.selectedSlot) {
      this.toast.error('Error', 'Please select a time slot');
      return;
    }
    if (this.isFrontOfficePage) {
      this.showAddbookingAppoinmentForm = true;
      this.isFrontOfficePageBookForm = true;

    }


  }

  goBack(): void {
    if (this.isFrontOfficePage) {
      this.router.navigate(['/front-office/book-appointment'])
    } else {
      this.router.navigate(['/patient/dashboard/specialities'])

    }
  }
  getAmPmTime(time: string): string {

    const [hours, minutes] = time.split(':');

    let h = parseInt(hours, 10);

    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12; // 0 → 12

    return `${h}:${minutes} ${ampm}`;
  }
  backToAvailability(otpDeviceDetails: any): void {
    this.otpDevice = otpDeviceDetails;
    this.bookingPatient = otpDeviceDetails.bookingPatient;
    // alert(JSON.stringify(otpDeviceDetails))
    this.showAddbookingAppoinmentForm = false;

    this.showBookingCunfermationOtp = true;
  }
  backToForm(): void {
    this.showBookingCunfermationOtp = false;
    this.showAddbookingAppoinmentForm = false;
    this.showSlotsModal = false;
    this.showBookingSuccess = false;
    this.showBookingFaild = true;
  }
  onVerifyOTP(patientDetail: any): void {
    this.bookingPatient = patientDetail;
    this.showBookingCunfermationOtp = false;
    this.showAddbookingAppoinmentForm = false;

    console.log(patientDetail, this.selectedDate, this.selectedSlot, "========>")
    const payload = {
      ...patientDetail,
      relatonTypeId: patientDetail.relationTypeId
    }
    this.store.dispatch(
      createAppointment({
        appointment: payload
      })
    );
    this.store.select(selectCreateAppointmentRes).subscribe((res: any) => {
      if (res) {
        this.showSlotsModal = false
        this.showBookingSuccess = true
        this.showBookingFaild = false
      } else {
        this.showSlotsModal = false
        this.showBookingFaild = true
        this.showBookingSuccess = false
      }
    })

  }

  generateSlots(startHr: string, endHr: string, interval: number) {
    if (!startHr || !endHr) {
      console.warn('Start or End time missing');
      return;
    }
    const slots: any[] = [];

    // convert "09:00" → 9
    const [sh, sm] = startHr.split(':').map(Number);
    const [eh, em] = endHr.split(':').map(Number);

    let current = new Date();
    current.setHours(sh, sm, 0, 0);

    const end = new Date();
    end.setHours(eh, em, 0, 0);

    while (current <= end) {

      const time = current.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      slots.push({
        time: time,
        booked: false
      });

      current = new Date(current.getTime() + interval * 60000);
    }

    this.slots = slots;
  }
}