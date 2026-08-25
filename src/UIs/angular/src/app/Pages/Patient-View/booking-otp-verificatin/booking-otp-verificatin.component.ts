import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastService } from 'src/app/shared/Components/Toaster/toast.service';
import { AppState } from 'src/app/Store/app.state';
import { verifyOTP } from 'src/app/Store/Auth/auth.actions';
import { selectVerifyOTP } from 'src/app/Store/Auth/auth.selectors';
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

  constructor(private cdr: ChangeDetectorRef, private toast: ToastService, private store: Store<AppState>) { }

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
        this.cdr.detectChanges();
      } else {
        clearInterval(this.interval);
        this.toast.error('Error', 'OTP Expired');
      }

    }, 1000);
  }

  resetTimer() {

    this.time = 59;

    this.startTimer();

    this.toast.success('Success', 'OTP Resent Successfully');
  }

  verifyOtp() {

    const finalOtp = this.otp.join('');

    if (finalOtp.length !== 4) {

      this.toast.error('Error', 'Please enter complete OTP');

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

    // alert('Appointment Booked Successfully');
    this.store.dispatch(verifyOTP({ email: this.bookingPatient.email, otpCode: finalOtp }))
    this.store.select(selectVerifyOTP).subscribe((res: any) => {
      if (res) {
        clearInterval(this.interval);
        this.VerifyOTP.emit(this.bookingPatient);
      }
    })

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