import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: "app-forgot-password",
  imports: [CommonModule,
    ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.css",
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      identifier: ['', Validators.required]
    });
  }

  get identifier() {
    return this.forgotPasswordForm.get('identifier');
  }

  sendOTP(): void {

    this.submitted = true;

    const value = this.identifier?.value?.trim();

    // Empty validation
    if (!value) {
      this.identifier?.markAsTouched();
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const mobilePattern =
      /^[6-9]\d{9}$/;

    // Email / Mobile validation
    if (
      !emailPattern.test(value) &&
      !mobilePattern.test(value)
    ) {
      this.identifier?.setErrors({
        invalidIdentifier: true
      });

      return;
    }

    // Store value for OTP flow
    localStorage.setItem(
      'passwordRecoveryUser',
      value
    );

    localStorage.setItem(
      'otpFlow',
      'forgot-password'
    );

    // Navigate to OTP page
    this.router.navigate([
      '/front-office/sendotp-verification'
    ]);
  }

  onFocus(): void {
    this.identifier?.markAsTouched();
  }
}