import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

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
    private router: Router,
    private toastr: ToastrService
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
    if (this.otpForm.controls["identifier"].valid) {
      this.otpSent = true;
      this.startTimer();
      // SIMULATION: In a real app, this would call a backend API
      this.toastr.success(`OTP sent to ${this.otpForm.value.identifier}`, "Success");
      console.log("SIMULATION: Your OTP is 1234");
      this.toastr.info("For testing, please use OTP: 1234", "Simulation Mode", {
        timeOut: 10000,
      });
    } else {
      this.otpForm.controls["identifier"].markAsTouched();
      this.toastr.error("Please enter a valid email or phone number", "Error");
    }
  }

  verifyOtp(): void {
    if (this.otpForm.valid) {
      const otp = `${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}`;
      
      // SIMULATION: Validating against our hardcoded test OTP
      if (otp === "1234") {
        this.toastr.success("Login Successful!", "Welcome");
        this.router.navigate(["/welcome"]);
      } else {
        this.toastr.error("Invalid OTP. Please try again.", "Error");
      }
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
