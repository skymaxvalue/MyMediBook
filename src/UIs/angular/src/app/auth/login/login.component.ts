import { AfterViewInit, Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
    private form_builder: FormBuilder
  ) {}

  ngAfterViewInit(): void {
    this.waitForGoogle();
  }
  ngOnInit(): void {
    this.loginForm = this.form_builder.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
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
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Process login form value here
    } else {
      this.loginForm.markAllAsTouched();
    }

    // this.auth.login("/welcome");
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
