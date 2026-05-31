import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
@Component({
  selector: "app-booking-otp-verificatin",
  imports: [],
  templateUrl: "./booking-otp-verificatin.component.html",
  styleUrls: ["./booking-otp-verificatin.component.css"],
})
export class BookingOTPVerificatinComponent implements OnDestroy {

  @Output() backToForm = new EventEmitter<void>();
  @Output() VerifyOTP = new EventEmitter<void>();
  @Input() otpDevice!: any;
  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  @Input() bookingPatient: any;
  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef>;

  otp: string[] = ['', '', '', ''];

  time: number = 59;

  interval: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.otpInputs.first.nativeElement.focus();
    }, 300);

    this.startTimer();
  }

  onInput(event: any, index: number) {

    let value = event.target.value.replace(/[^0-9]/g, '');

    this.otp[index] = value;

    if (value && index < this.otp.length - 1) {
      this.otpInputs.toArray()[index + 1]
        .nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {

    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {
      this.otpInputs.toArray()[index - 1]
        .nativeElement.focus();
    }
  }

  get formattedTime(): string {

    const min = Math.floor(this.time / 60);

    let sec: string | number = this.time % 60;

    if (+sec < 10) {
      sec = '0' + sec;
    }

    return `0${min}:${sec}s`;
  }

  startTimer() {

    clearInterval(this.interval);

    this.interval = setInterval(() => {



      if (this.time > 0) {

        this.time--;


      } else {

        clearInterval(this.interval);

        this.time = 0;

        alert('OTP Expired');
      }

    }, 1000);
  }

  resetTimer() {

    this.time = 59;

    this.startTimer();

    alert('OTP Resent Successfully');
  }

  verifyOtp() {

    const finalOtp = this.otp.join('');

    if (finalOtp.length !== 4) {

      alert('Please enter complete OTP');

      return;
    }

    // const appointment = JSON.parse(
    //   localStorage.getItem('tempAppointment') || '{}'
    // );

    // const list = JSON.parse(
    //   localStorage.getItem('appointments') || '[]'
    // );

    // list.push(appointment);

    // localStorage.setItem(
    //   'appointments',
    //   JSON.stringify(list)
    // );

    // localStorage.removeItem('tempAppointment');

    alert('Appointment Booked Successfully');
    clearInterval(this.interval);
    this.VerifyOTP.emit(this.bookingPatient);
  }

  cancelOtp() {

    localStorage.removeItem('tempAppointment');

    this.backToForm.emit();

    // OR route
    // this.router.navigate(['/failed']);
  }

  maskMobile(value: string) {
    if (this.otpDevice.otpDevice === 'email') {
      if (!value) return '';

      const [name, domain] = value.split('@');

      const maskedName =
        name.charAt(0) +
        '*'.repeat(name.length - 3) +
        name.charAt(name.length - 1);

      return maskedName + '@' + domain;
    }
    if (this.otpDevice.otpDevice === 'mobile') {
      if (!value) return '';

      return value.slice(0, -4).replace(/./g, '*') + value.slice(-4);

    }
  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }
}