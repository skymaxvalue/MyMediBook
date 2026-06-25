import { AfterViewInit, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { selectLoginPatient } from "src/app/Store/Auth/auth.selectors";
import { AppState } from "src/app/Store/app.state";
import { Store } from '@ngrx/store';
import * as AuthActions from "../../Store/Auth/auth.actions"

declare const google: any;

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements AfterViewInit, OnInit {
  showPassword = false;
  clientId = environment.ResourceServer.GoogleClientID;
  loginForm!: FormGroup;
  constructor(
    public auth: AuthService,
    private form_builder: FormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngAfterViewInit(): void {
    this.waitForGoogle();
  }
  ngOnInit(): void {
    this.loginForm = this.form_builder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false],
    });
  }

  waitForGoogle() {
    if ((window as any).google?.accounts) {
      this.initializeGoogle();
    } else {
      setTimeout(() => this.waitForGoogle(), 300);
    }
  }

  initializeGoogle() {
    // console.log("Initializing Google Sign-In", this.clientId);
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
    });
    const btn = document.getElementById("googleBtn");

    if (btn) {
      google.accounts.id.renderButton(btn, {
        theme: "outline",
        size: "large",
        shape: "  rectangular",
        text: "Sign in with Google",
        padding: "12px",
        logo_alignment: "center",
        outline: "none",
      });
    } else {
      console.error("googleBtn  HTML file");
    }
  }
  handleCredentialResponse(response: any) {
    // Handle the token response here
    // console.log(response, "------------>")
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      // Process login form value here
      // if (this.loginForm.value.username === "admin" && this.loginForm.value.password === "1234") {
      //   localStorage.setItem("token", "userToken");
      //   this.router.navigate(["/dashboard"]);
      // }
      localStorage.setItem('token', JSON.stringify({
        "patientId": 5,
        "firstName": "Admin",
        "middleName": "Test",
        "lastName": "Patient",
        "dateOfBirth": "1990-05-15T00:00:00",
        "phoneCountryCode": "+91",
        "phoneNumber": "9876543210",
        "email": "admin.patient@example.com",
        "gender": "Male",
        "addressLine1": "123 Test Street",
        "addressLine2": "Near City Hospital",
        "cityId": 1,
        "zipCode": "141001",
        "stateId": 1,
        "countryId": 1,
        "username": "adminpatient",
        "securityQuestionId": 0,
        "isActive": true,
        "createdBy": null,
        "createdDate": "2026-06-10T20:13:01.47",
        "updatedBy": null,
        "updatedDate": null
      }))
      const patient =
        await this.store.dispatch(
          AuthActions.login({ username: this.loginForm.value.username, password: this.loginForm.value.password })
        );
      await this.store.select(state => state.auth.loginPatient).subscribe((patient: any) => {
        console.log(patient, "----------")
        if (patient) {

          localStorage.setItem('token', JSON.stringify(patient))

          this.router.navigate(['/dashboard']);
        }
      });


    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  get f() {
    return this.loginForm.controls;
  }

  async loginWithGoogle() {
    try {
      await google.accounts.id.prompt();
    } catch (err) {
      console.error("Google sign in error", err);
    }
  }
}
