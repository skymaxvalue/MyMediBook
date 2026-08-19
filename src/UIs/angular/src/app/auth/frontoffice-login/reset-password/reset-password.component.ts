import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: "app-reset-password",
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isSuccessResetPassword: boolean = false;

  showNewPassword = false;
  showConfirmPassword = false;
  // isSuccessResetPassword: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {

    this.resetPasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/
          )
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    });

  }


  // Show / Hide New Password
  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }


  // Show / Hide Confirm Password
  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  alert() {
    alert('Please contact your system administrator or IT support.')
  }
  resetPassword(): void {

    if (this.resetPasswordForm.invalid) {

      this.shakeCard();

      alert(
        'Password must contain at least 8 characters, one uppercase letter, one number and one special character.'
      );

      return;
    }


    const password =
      this.resetPasswordForm.get('newPassword')?.value;

    const confirmPassword =
      this.resetPasswordForm.get('confirmPassword')?.value;


    // Password match validation
    if (password !== confirmPassword) {

      this.shakeCard();

      alert('Passwords do not match.');

      return;
    }


    // Remove recovery data
    localStorage.removeItem('passwordRecoveryUser');


    alert('Password reset successfully.');


    // Navigate to success page
    this.isSuccessResetPassword = true

  }


  cancel(): void {

    this.router.navigate([
      '/forgot-password'
    ]);

  }


  private shakeCard(): void {

    const card =
      document.querySelector('.forgot-card');

    if (!card) return;

    card.classList.remove('shake');

    // Restart animation
    void (card as HTMLElement).offsetWidth;

    card.classList.add('shake');

  }

}
