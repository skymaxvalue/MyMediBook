import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { selectRequestedOTP } from "src/app/Store/Auth/auth.selectors";
import { AppState } from "src/app/Store/app.state";
import { Store } from '@ngrx/store';
import * as AuthActions from "../../../Store/Auth/auth.actions";
import { ToastService } from "src/app/shared/Components/Toaster/toast.service";

@Component({
  selector: "app-forget-password",
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./forget-password.component.html",
  styleUrl: "./forget-password.component.css",
})
export class ForgetPasswordComponent {
  isOtpSent = false;
  isOtpVerified = false;
  showNewPassword = false;
  showConfirmPassword = false;
  emailOrMobile: any = '';
  otpArray = [1, 2, 3, 4];

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef>;
  timer = '00:59';
  seconds = 59;
  interval: any;
  newPassword: string = '';
  confirmPassword: string = '';

  newPasswordError: string = '';
  confirmPasswordError: string = '';
  showPassword: boolean = false;
  OtpData: any;

  constructor(private router: Router, private store: Store<AppState>, private cdr: ChangeDetectorRef, private toast: ToastService,) {

  }
  moveNext(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      input.value.length === 1 &&
      index < this.otpInputs.length - 1
    ) {
      this.otpInputs.toArray()[index + 1]
        .nativeElement.focus();
    }
  }

  movePrevious(event: KeyboardEvent, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      event.key === 'Backspace' &&
      input.value === '' &&
      index > 0
    ) {
      this.otpInputs.toArray()[index - 1]
        .nativeElement.focus();
    }
  }

  startTimer() {
    clearInterval(this.interval);

    this.seconds = 59;

    this.interval = setInterval(() => {

      const mins = Math.floor(this.seconds / 60);
      const secs = this.seconds % 60;

      this.timer =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      this.cdr.detectChanges();

      if (this.seconds > 0) {
        this.seconds--;
      } else {
        clearInterval(this.interval);
      }

    }, 1000);
  }
  sendOtp() {

    this.store.dispatch(AuthActions.requestOTP({ email: this.emailOrMobile }))


    this.store.select(state => state.auth.requestedOtp).subscribe((OTP: any) => {

      if (OTP) {
        this.OtpData = OTP
        console.log(OTP)
        this.isOtpSent = true;
        this.startTimer();
      }
    });


  }

  verifyOtp() {
    // Implement OTP verification logic here
    alert("OTP verified successfully!");
    this.isOtpSent = false;
    this.isOtpVerified = true;
    console.log("OTP verified successfully.");
  }

  resetPassword(): void {

    this.newPasswordError = '';
    this.confirmPasswordError = '';

    if (!this.newPassword) {
      this.newPasswordError = 'New password is required';
    }

    else if (this.newPassword.length < 6) {
      this.newPasswordError =
        'New password must be at least 6 characters';
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError =
        'Confirm password is required';
    }

    else if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError =
        'New password and confirm password do not match';
    }

    if (
      !this.newPasswordError &&
      !this.confirmPasswordError
    ) {
      alert('Password Reset Successfully');
      this.router.navigate(['/login']);

    }
  }
  resendOtp() {

    if (this.seconds > 0) return;

    alert('OTP Resent');

    clearInterval(this.interval);

    this.startTimer();
  }

  toggleNewPassword() {
    this.showNewPassword =
      !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

}
