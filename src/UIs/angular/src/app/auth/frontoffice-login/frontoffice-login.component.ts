import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: "app-frontoffice-login",
  imports: [FormsModule],
  templateUrl: "./frontoffice-login.component.html",
  styleUrl: "./frontoffice-login.component.css",
})
export class FrontofficeLoginComponent {

  username = '';
  password = '';

  remember = false;
  showPassword = false;

  constructor(private router: Router) {
    const savedUser = localStorage.getItem('rememberedUsername');

    if (savedUser) {
      this.username = savedUser;
      this.remember = true;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {

    const user = this.username.trim();
    const pass = this.password.trim();

    if (!user) {
      alert('Please enter Employee ID.');
      return;
    }

    if (!pass) {
      alert('Please enter Password.');
      return;
    }

    // Remember username
    if (this.remember) {
      localStorage.setItem('rememberedUsername', user);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    // Temporary login
    if (user === '1024' && pass === '1234') {

      localStorage.setItem('pendingUser', user);

      this.router.navigate(['/front-office/otp-verification']);

    } else {

      this.shakeForm();

      alert('Invalid Employee ID or Password.');
    }
  }

  private shakeForm(): void {

    const card = document.querySelector('.login-card');

    if (!card) {
      return;
    }

    card.classList.remove('shake');

    // Force browser reflow so animation can restart
    void (card as HTMLElement).offsetWidth;

    card.classList.add('shake');
  }


}
