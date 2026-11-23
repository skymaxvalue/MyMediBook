import { AfterViewInit, Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { AuthService } from "../auth.service";
import {
  Router, RouterModule, NavigationCancel,
  NavigationError
} from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { selectLoginUser } from "src/app/Store/Auth/auth.selectors";
import { AppState } from "src/app/Store/app.state";
import { Store } from "@ngrx/store";
import * as AuthActions from "../../Store/Auth/auth.actions";
import { filter, take } from "rxjs/operators";
import { homeFor, readUser } from "src/app/utils/auth/auth.utils";

@Component({
  selector: "app-admin-login",
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: "./admin-login.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./admin-login.component.css",
})
export class AdminLoginComponent implements OnInit {
  showPassword = false;
  clientId = environment.ResourceServer.GoogleClientID;
  loginForm!: FormGroup;

  loginRole: string = "Admin";
  constructor(
    public auth: AuthService,
    private form_builder: FormBuilder,
    private router: Router,
    private store: Store<AppState>
  ) {
    // alert(this.router.url)

    // if (this.router.url === "/associate-login") {
    //   this.loginRole = "Associate";
    // }
  }

  // ngAfterViewInit(): void {
  //   this.waitForGoogle();
  // }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe(event => {
      console.log("ROUTER EVENT:", event);
    });

    this.loginForm = this.form_builder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      remember: [false],
    });


    console.log("Stored User:", readUser());
    console.log("Home Route:", homeFor(readUser()));

    this.store.select(selectLoginUser).pipe(
      filter(response => !!response),
      take(1)
    ).subscribe((response: any) => {

      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("token", response.tokenKey);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data));

      console.log("Admin Login: Starting navigation");


    });
  }

  // waitForGoogle() {
  //   if ((window as any).google?.accounts) {
  //     this.initializeGoogle();
  //   } else {
  //     setTimeout(() => this.waitForGoogle(), 300);
  //   }
  // }

  // initializeGoogle() {
  //   // console.log("Initializing Google Sign-In", this.clientId);
  //   google.accounts.id.initialize({
  //     client_id: this.clientId,
  //     callback: this.handleCredentialResponse.bind(this),
  //   });
  //   const btn = document.getElementById("googleBtn");

  //   if (btn) {
  //     google.accounts.id.renderButton(btn, {
  //       theme: "outline",
  //       size: "large",
  //       shape: "  rectangular",
  //       text: "Sign in with Google",
  //       padding: "12px",
  //       logo_alignment: "center",
  //       outline: "none",
  //     });
  //   } else {
  //     console.error("googleBtn  HTML file");
  //   }
  // }
  handleCredentialResponse(response: any) {
    // Handle the token response here
    // console.log(response, "------------>")
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    console.log("Login Role:", this.loginRole);

    this.store.dispatch(
      AuthActions.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        role: "Admin"
      })
    );
  }
  get f() {
    return this.loginForm.controls;
  }

  // async loginWithGoogle() {
  //   try {
  //     await google.accounts.id.prompt();
  //   } catch (err) {
  //     console.error("Google sign in error", err);
  //   }
  // }
}
