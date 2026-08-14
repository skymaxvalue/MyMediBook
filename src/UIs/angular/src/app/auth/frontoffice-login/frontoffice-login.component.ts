import { Component } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/Services/auth.service';
import { AppState } from 'src/app/Store/app.state';
import { login } from 'src/app/Store/Auth/auth.actions';
@Component({
  selector: "app-frontoffice-login",
  imports: [FormsModule, RouterLink],
  templateUrl: "./frontoffice-login.component.html",
  styleUrl: "./frontoffice-login.component.css",
})
export class FrontofficeLoginComponent {

  username = '';
  password = '';

  remember = false;
  showPassword = false;

  constructor(private router: Router,
    public auth: AuthService,
    private form_builder: FormBuilder,
    private store: Store<AppState>
  ) {
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

    //  this.store.dispatch(AuthActions.login({

    //           username: this.loginForm.value.username,

    //           password: this.loginForm.value.password,

    //           role: this.loginRole

    //         })
    //       );

    this.store.dispatch(login({ username: this.username, password: this.password, role: 'associate' }))
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
