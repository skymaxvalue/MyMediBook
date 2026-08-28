import {
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/Store/app.state';
import { Store } from '@ngrx/store';
import { verifyOTP } from 'src/app/Store/Auth/auth.actions';
import { selectVerifyOTP } from 'src/app/Store/Auth/auth.selectors';

@Component({
  selector: "app-otp-verification",
  imports: [CommonModule,
    FormsModule],
  templateUrl: "./otp-verification.component.html",
  styleUrl: "./otp-verification.component.css",
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  currentUrl = '';
  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  otp: string[] = ['', '', '', ''];
  otpArray = [1, 2, 3, 4];
  time = 60;

  timerText = '01:00';

  isExpired = false;

  isLoading = false;

  errorMessage = '';

  pendingUser: any = null;

  private countdown: any;
  resetPasswordToken: any;
  emailId: any;
  isLoginFlow: boolean = false;


  constructor(
    private router: Router, private store: Store<AppState>, private route: ActivatedRoute
  ) {
    this.currentUrl = this.router.url;
    console.log('Current URL:', this.currentUrl);
  }


  ngOnInit(): void {

    this.emailId = history.state.emailId;
    this.isLoginFlow = history.state.isLoginFollw

    console.log('Email ID:', this.emailId);

    // if (this.currentUrl !== "/front-office/sendotp-verification") {
    //   const pendingUser = localStorage.getItem('pendingUser');

    //   if (!pendingUser) {

    //     this.router.navigate(['/front-office/login']);

    //     return;
    //   }

    //   try {

    //     this.pendingUser = JSON.parse(pendingUser);

    //   } catch {

    //     this.pendingUser = pendingUser;

    //   }
    // }

    // Check pending user



    // Start timer
    this.startTimer();

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


  onOtpInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;


    const value = input.value.replace(/\D/g, '');


    this.otp[index] = value.slice(0, 1);


    input.value = this.otp[index];


    if (this.otp[index] && index < this.otp.length - 1) {

      setTimeout(() => {
        this.otpInputs
          .toArray()[index + 1]
          ?.nativeElement
          .focus();
      });

    }
  }



  onKeyDown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {

      event.preventDefault();

      setTimeout(() => {
        this.otpInputs
          .toArray()[index - 1]
          ?.nativeElement
          .focus();
      });

    }

  }


  onPaste(event: ClipboardEvent): void {

    event.preventDefault();

    const pastedData =
      event.clipboardData
        ?.getData('text')
        .replace(/\D/g, '') || '';

    if (!pastedData) {
      return;
    }

    this.otp = ['', '', '', ''];

    pastedData
      .slice(0, 4)
      .split('')
      .forEach((digit, index) => {
        this.otp[index] = digit;
      });

    setTimeout(() => {

      const lastIndex =
        Math.min(pastedData.length, 4) - 1;

      if (lastIndex >= 0) {

        this.otpInputs
          .toArray()[lastIndex]
          ?.nativeElement
          .focus();

      }

    });

  }


  startTimer(): void {

    this.clearTimer();

    this.time = 60;

    this.isExpired = false;

    this.updateTimerText();


    this.countdown =
      setInterval(() => {

        this.time--;

        this.updateTimerText();


        if (this.time <= 0) {

          this.clearTimer();

          this.isExpired = true;

          this.timerText = 'Expired';

        }

      }, 1000);

  }


  updateTimerText(): void {

    const minutes =
      Math.floor(this.time / 60);

    const seconds =
      this.time % 60;


    this.timerText =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  }


  resendOtp(): void {

    if (!this.isExpired) {
      return;
    }



    // Here you can call your resend OTP API

    console.log('Resend OTP');


    this.otp =
      ['', '', '', ''];

    this.errorMessage = '';

    this.startTimer();




  }

  async verifyOtp() {

    this.errorMessage = '';


    const enteredOtp =
      this.otp.join('');


    if (enteredOtp.length !== 4) {

      this.errorMessage =
        'Please enter the complete OTP.';

      return;

    }


    // this.isLoading = true;

    await this.store.dispatch(verifyOTP({ email: this.emailId, otpCode: enteredOtp }))

    await this.store.select(selectVerifyOTP).subscribe((res: any) => {
      if (res) {
        this.resetPasswordToken = res.token
        if (this.isLoginFlow) {
          this.router.navigate([
            '/front-office/dashboard'
          ]
          );
        } else {
          this.router.navigate([
            '/front-office/reset-password'
          ], {
            state: {
              token: this.resetPasswordToken
            }
          }
          );

        }

        console.log("OTP verified successfully.");
      }
    })

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.clearTimer();

    this.router.navigate([
      '/front-office/login'
    ]);

  }


  // ==========================================
  // CLEAR TIMER
  // ==========================================

  clearTimer(): void {

    if (this.countdown) {

      clearInterval(
        this.countdown
      );

      this.countdown = null;

    }

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.clearTimer();

  }

}
