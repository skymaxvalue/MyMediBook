import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";

@Component({
  selector: "app-otp-login",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./otp-login.component.html",
  styleUrl: "./otp-login.component.css",
})
export class OtpLoginComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  otpSent = false;
  timer = 59;
  timerInterval: any;
  otpInputs = ["", "", "", ""];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      identifier: ["", [Validators.required]], // email or phone
      otp1: ["", [Validators.required, Validators.maxLength(1)]],
      otp2: ["", [Validators.required, Validators.maxLength(1)]],
      otp3: ["", [Validators.required, Validators.maxLength(1)]],
      otp4: ["", [Validators.required, Validators.maxLength(1)]],
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  sendOtp(): void {
    if (this.otpForm.controls['identifier'].valid) {
      this.otpSent = true;
      this.startTimer();
      // TODO: Call backend to send OTP
      console.log("OTP Sent to:", this.otpForm.value.identifier);
    } else {
      this.otpForm.controls['identifier'].markAsTouched();
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otp = `${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}`;
      console.log("Verifying OTP:", otp);
      // TODO: Call backend to verify OTP
      // If success:
      // this.router.navigate(['/welcome']);
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  resendOtp(): void {
    if (this.timer === 0) {
      this.timer = 59;
      this.startTimer();
      // TODO: Call backend to resend OTP
      console.log("OTP Resent");
    }
  }

  startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onOtpInput(event: any, nextInput?: HTMLInputElement): void {
    const input = event.target;
    if (input.value && nextInput) {
      nextInput.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, prevInput?: HTMLInputElement): void {
    if (event.key === 'Backspace' && !(event.target as HTMLInputElement).value && prevInput) {
      prevInput.focus();
    }
  }
}
