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


import { Router } from '@angular/router';

@Component({
  selector: "app-otp-verification",
  imports: [CommonModule,
    FormsModule],
  templateUrl: "./otp-verification.component.html",
  styleUrl: "./otp-verification.component.css",
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
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


  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {

    // Check pending user
    const pendingUser = localStorage.getItem('pendingUser');

    if (!pendingUser) {

      this.router.navigate(['/patient/login']);

      return;
    }

    try {

      this.pendingUser = JSON.parse(pendingUser);

    } catch {

      this.pendingUser = pendingUser;

    }


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

  // ==========================================
  // OTP INPUT
  // ==========================================

  onOtpInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    // फक्त number allow
    const value = input.value.replace(/\D/g, '');

    // एकच digit ठेवा
    this.otp[index] = value.slice(0, 1);

    // Input मध्ये clean value दाखवा
    input.value = this.otp[index];

    // पुढच्या input वर जा
    if (this.otp[index] && index < this.otp.length - 1) {

      setTimeout(() => {
        this.otpInputs
          .toArray()[index + 1]
          ?.nativeElement
          .focus();
      });

    }
  }


  // ==========================================
  // BACKSPACE
  // ==========================================

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


  // ==========================================
  // PASTE OTP
  // ==========================================

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


  // ==========================================
  // TIMER
  // ==========================================

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


  // ==========================================
  // RESEND OTP
  // ==========================================

  resendOtp(): void {

    if (!this.isExpired) {
      return;
    }


    // TODO:
    // Here you can call your resend OTP API

    console.log('Resend OTP');


    this.otp =
      ['', '', '', ''];

    this.errorMessage = '';

    this.startTimer();


    // Demo
    alert('Demo OTP: 1234');

  }


  // ==========================================
  // VERIFY OTP
  // ==========================================

  verifyOtp(): void {

    this.errorMessage = '';


    const enteredOtp =
      this.otp.join('');


    if (enteredOtp.length !== 4) {

      this.errorMessage =
        'Please enter the complete OTP.';

      return;

    }


    this.isLoading = true;


    // ==========================================
    // DEMO OTP
    // ==========================================

    setTimeout(() => {

      this.isLoading = false;


      if (enteredOtp === '1234') {

        localStorage.setItem(
          'isLoggedIn',
          'true'
        );


        localStorage.removeItem(
          'pendingUser'
        );


        this.clearTimer();

        alert("verify otp")
        // After successful verification
        this.router.navigate([
          '/front-office/dashboard'
        ]);

      } else {

        this.errorMessage =
          'Invalid OTP.';


        this.otp =
          ['', '', '', ''];


        setTimeout(() => {

          const firstInput =
            document.querySelector(
              '.otp-input'
            ) as HTMLInputElement;

          firstInput?.focus();

        });

      }

    }, 700);

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.clearTimer();

    this.router.navigate([
      '/patient/login'
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
