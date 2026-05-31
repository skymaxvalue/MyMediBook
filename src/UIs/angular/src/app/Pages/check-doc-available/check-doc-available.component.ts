import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookAppoimentFormComponent } from "../book-appoiment-form/book-appoiment-form.component";
import { BookingOTPVerificatinComponent } from "../booking-otp-verificatin/booking-otp-verificatin.component";
import { BookingSuccessfullComponent } from "../booking-successfull/booking-successfull.component";
import { BookingFailedComponent } from "../booking-failed/booking-failed.component";
interface ScheduleItem {
  date: Date;
  formattedDate: string;
  badgeClass: 'green' | 'red' | 'beige';
  text: string;
}
@Component({
  selector: "app-check-doc-available",
  imports: [CommonModule, FormsModule, BookAppoimentFormComponent, BookingOTPVerificatinComponent, BookingSuccessfullComponent, BookingFailedComponent],
  templateUrl: "./check-doc-available.component.html",
  styleUrl: "./check-doc-available.component.css",
})
export class CheckDocAvailableComponent {
  @Input() doctor: any = {}
  @Output() backToSpecialities = new EventEmitter<void>();

  today: Date = new Date();
  currentStartDate: Date = new Date();
  minDate: string = '';
  selectedDate: string = '';
  showBookingCunfermationOtp = false;
  showBookingSuccess = false;
  bookingPatient: any = {};
  schedule: ScheduleItem[] = [];
  showBookingFaild = false;
  showSlotsModal = false;
  selectedDateGlobal = '';
  selectedSlot = '';
  otpDevice: { otpDevice: string, value: string } = { otpDevice: 'email', value: '' };

  allSlots: string[] = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  slots: { time: string; booked: boolean }[] = [];
  showAddbookingAppoinmentForm: boolean = false

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.minDate = this.toInputDate(this.today);
    this.selectedDate = this.minDate;

    this.generateSchedule(this.today);
  }

  toInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
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
    this.schedule = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);

      let badgeClass: 'green' | 'red' | 'beige' = 'green';
      let text = '09:00 AM - 05:30 PM';

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
        text
      });
    }
  }

  onDateChange(): void {
    this.currentStartDate = new Date(this.selectedDate);
    this.generateSchedule(this.currentStartDate);
  }

  nextWeek(): void {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.selectedDate = this.toInputDate(this.currentStartDate);
    this.generateSchedule(this.currentStartDate);
  }

  prevWeek(): void {
    const newDate = new Date(this.currentStartDate);
    newDate.setDate(newDate.getDate() - 7);

    if (newDate >= this.today) {
      this.currentStartDate = newDate;
      this.selectedDate = this.toInputDate(this.currentStartDate);
      this.generateSchedule(this.currentStartDate);
    }
  }

  openSlotsPopup(item: ScheduleItem): void {
    if (item.badgeClass === 'beige') {
      return;
    }

    this.selectedDateGlobal = item.formattedDate;
    this.selectedSlot = '';
    this.showSlotsModal = true;

    let bookedSlots: string[] = [];

    if (item.badgeClass === 'red') {
      bookedSlots = this.allSlots.slice(0, 10);
    } else {
      bookedSlots = this.allSlots.slice(0, 3);
    }

    this.slots = this.allSlots.map(slot => ({
      time: slot,
      booked: bookedSlots.includes(slot)
    }));
  }

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  closeSlotsModal(): void {
    this.showSlotsModal = false;
  }

  goToBooking(): void {
    if (!this.selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    this.showAddbookingAppoinmentForm = true


  }

  goBack(): void {
    this.backToSpecialities.emit();
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
    this.showSlotsModal = false;
    this.showBookingSuccess = true;

  }
}