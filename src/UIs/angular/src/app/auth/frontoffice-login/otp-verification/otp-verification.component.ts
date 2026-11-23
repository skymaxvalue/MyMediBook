
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";

import { firstValueFrom } from "rxjs";
import { filter, skip, take } from "rxjs/operators";

import { AppState } from "src/app/Store/app.state";

import {
  register_by_reseptionist,
  requestOTP,
  verifyOTP,
} from "src/app/Store/Auth/auth.actions";

import {
  selectRegisteredPatientByReceptionist,
  selectVerifyOTP,
} from "src/app/Store/Auth/auth.selectors";

type OTPFlow =
  | "login"
  | "registration"
  | "appointment"
  | "reset-password"
  | "";

@Component({
  selector: "app-otp-verification",
  imports: [CommonModule, FormsModule],
  templateUrl: "./otp-verification.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./otp-verification.component.css",
})
export class OtpVerificationComponent implements OnInit, OnDestroy {

  flow: OTPFlow = "";

  registrationData: any = null;
  appointmentData: any = null;

  emailId = "";

  isLoading = false;
  errorMessage = "";

  time = 300;
  timerText = "05:00";
  isExpired = false;

  private countdown: ReturnType<typeof setInterval> | null = null;

  currentUrl = "";

  @ViewChildren("otpInput")
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otp: string[] = ["", "", "", ""];
  otpArray = [1, 2, 3, 4];

  pendingUser: any = null;

  resetPasswordToken: any;

  isLoginFlow = false;
  isBookAppointmentFlow = false;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUrl = this.router.url;
    console.log("Current URL:", this.currentUrl);
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  ngOnInit(): void {

    console.log("history.state:", history.state);

    const state = history.state;

    // LOGIN FLOW
    if (state.flow === "login" || state.isLoginFollow) {

      this.flow = "login";
      this.isLoginFlow = true;

      this.emailId = state.emailId || "";

      console.log("Login OTP Flow:", this.emailId);
    }

    // PATIENT REGISTRATION FLOW
    else if (state.isRegisterPatient) {

      this.flow = "registration";

      this.registrationData = state.registrationData;

      this.emailId =
        this.registrationData?.contactInformation?.email || "";

      console.log("Patient Registration OTP Flow");
      console.log("Email:", this.emailId);
      console.log("Registration Data:", this.registrationData);
    }

    // APPOINTMENT FLOW
    else if (state.isBookAppointment || state.flow === "appointment") {

      this.flow = "appointment";
      this.isBookAppointmentFlow = true;

      this.appointmentData = state.appointmentData || null;

      // Existing appointment flow sends registrationData
      this.registrationData = state.registrationData || null;

      this.emailId =
        this.registrationData?.contactInformation?.email ||
        this.appointmentData?.email ||
        "";

      console.log("Appointment OTP Flow:", this.emailId);
    }

    // RESET PASSWORD FLOW
    else {

      this.flow = "reset-password";
      this.emailId = state.emailId || "";

      console.log("Reset Password OTP Flow:", this.emailId);
    }

    if (!this.emailId) {
      console.warn("Email ID is missing in OTP navigation state.");
    }

    this.startTimer();
  }

  // ==========================================
  // OTP INPUT HANDLING
  // ==========================================

  moveNext(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      input.value.length === 1 &&
      index < this.otpInputs.length - 1
    ) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  movePrevious(event: KeyboardEvent, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      event.key === "Backspace" &&
      input.value === "" &&
      index > 0
    ) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onOtpInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, "");

    this.otp[index] = value.slice(0, 1);

    input.value = this.otp[index];

    if (this.otp[index] && index < this.otp.length - 1) {

      setTimeout(() => {
        this.otpInputs.toArray()[index + 1]?.nativeElement.focus();
      });

    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {

    if (event.key === "Backspace" && !this.otp[index] && index > 0) {

      event.preventDefault();

      setTimeout(() => {
        this.otpInputs.toArray()[index - 1]?.nativeElement.focus();
      });

    }
  }

  onPaste(event: ClipboardEvent): void {

    event.preventDefault();

    const pastedData =
      event.clipboardData?.getData("text").replace(/\D/g, "") || "";

    if (!pastedData) {
      return;
    }

    this.otp = ["", "", "", ""];

    pastedData
      .slice(0, 4)
      .split("")
      .forEach((digit, index) => {
        this.otp[index] = digit;
      });

    setTimeout(() => {

      const lastIndex = Math.min(pastedData.length, 4) - 1;

      if (lastIndex >= 0) {
        this.otpInputs.toArray()[lastIndex]?.nativeElement.focus();
      }

    });
  }

  // ==========================================
  // TIMER
  // ==========================================

  startTimer(): void {

    this.clearTimer();

    this.time = 300;
    this.isExpired = false;

    this.updateTimerText();

    this.countdown = setInterval(() => {

      this.time--;

      this.updateTimerText();

      if (this.time <= 0) {

        this.clearTimer();

        this.isExpired = true;
        this.timerText = "Expired";

      }

      this.cdr.detectChanges();

    }, 1000);
  }

  updateTimerText(): void {

    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;

    this.timerText =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  clearTimer(): void {

    if (this.countdown) {

      clearInterval(this.countdown);
      this.countdown = null;

    }
  }

  // ==========================================
  // RESEND OTP
  // ==========================================

  resendOtp(): void {

    if (!this.isExpired || !this.emailId) {
      return;
    }

    this.errorMessage = "";

    this.otp = ["", "", "", ""];

    this.store.dispatch(
      requestOTP({
        email: this.emailId,
      })
    );

    this.startTimer();

    console.log("OTP resend request dispatched:", this.emailId);
  }

  // ==========================================
  // VERIFY OTP
  // ==========================================

  async verifyOtp(): Promise<void> {

    this.errorMessage = "";

    const enteredOtp = this.otp.join("");

    if (this.isExpired) {
      this.errorMessage = "OTP has expired. Please resend OTP.";
      return;
    }

    if (!this.emailId) {
      this.errorMessage = "Email ID is missing. Please try again.";
      return;
    }

    if (enteredOtp.length !== 4) {

      this.errorMessage = "Please enter the complete OTP.";
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {

      // Subscribe before dispatch to receive the new API response.
      const verificationPromise = firstValueFrom(
        this.store.select(selectVerifyOTP).pipe(
          skip(1),
          filter((res: any) => !!res),
          take(1)
        )
      );

      this.store.dispatch(
        verifyOTP({
          email: this.emailId,
          otpCode: enteredOtp
        })
      );

      const res: any = await verificationPromise;

      console.log("OTP Verification Response:", res);

      this.resetPasswordToken = res.token;

      // ==========================================
      // LOGIN FLOW
      // ==========================================

      if (this.flow === "login") {

        this.clearTimer();

        await this.router.navigate(["/front-office/dashboard"]);

        window.history.replaceState(
          null,
          "",
          window.location.pathname
        );

      }

      // ==========================================
      // PATIENT REGISTRATION / APPOINTMENT FLOW
      // ==========================================

      else if (
        (this.flow === "registration" ||
          this.flow === "appointment") &&
        this.registrationData
      ) {

        await this.registerPatient();

      }

      // ==========================================
      // RESET PASSWORD FLOW
      // ==========================================

      else {

        this.clearTimer();

        await this.router.navigate(
          ["/front-office/reset-password"],
          {
            state: {
              token: this.resetPasswordToken,
            },
          }
        );

      }

      console.log("OTP verified successfully.");

    } catch (error) {

      console.error("OTP Verification Error:", error);

      this.errorMessage =
        "Invalid OTP or verification failed. Please try again.";

    } finally {

      this.isLoading = false;
      this.cdr.detectChanges();

    }
  }

  // ==========================================
  // REGISTER PATIENT API
  // ==========================================

  private async registerPatient(): Promise<void> {

    const formData = this.registrationData;

    const presentAddress =
      formData.contactInformation.presentAddress;

    const permanentAddress =
      formData.contactInformation.permanentAddress;

    const hasInsurance =
      formData.personalDetails.insuranceChoice === "yes";

    const paymentDetails =
      formData.paymentDetails || {};

    const payload: any = {

      firstName: formData.personalDetails.firstName,

      middleName: "",

      lastName: formData.personalDetails.lastName,

      dateOfBirth: formData.personalDetails.dateOfBirth,

      phoneCountryCode: formData.contactInformation.phoneCode,

      phoneNumber: formData.contactInformation.phone,

      email: formData.contactInformation.email,

      gender: formData.personalDetails.gender,

      // PRESENT ADDRESS

      addressLine1: presentAddress.address,

      cityId: Number(presentAddress.cityId),

      zipCode: presentAddress.pinCode,

      stateId: Number(presentAddress.stateId),

      countryId: Number(presentAddress.countryId),

      // BILLING / PERMANENT ADDRESS

      addressLine2: permanentAddress.address,
      billingAddress: permanentAddress.address,

      billingCityId: Number(permanentAddress.cityId),

      billingZipCode: permanentAddress.pinCode,

      billingStateId: Number(permanentAddress.stateId),

      billingCountryId: Number(permanentAddress.countryId),

      // INSURANCE

      insurance: hasInsurance ? 1 : 0,

      insuranceData: hasInsurance
        ? {
          provider: formData.insuranceDetails.provider,

          policy: formData.insuranceDetails.policy,

          groupId: formData.insuranceDetails.groupId,

          holderName: formData.insuranceDetails.holderName,

          address: formData.insuranceDetails.insuranceAddress,
        }
        : null,

      // PAYMENT
      // Insurance = Yes: Payment is not required.
      // Insurance = No: Use the payment details entered in the payment modal.

      paymentData: !hasInsurance
        ? {
          paymentType: paymentDetails.paymentType || null,

          cardHolder: paymentDetails.cardHolder || null,

          cardNumber: paymentDetails.cardNumber || null,

          expiry: paymentDetails.expiry || null,
        }
        : null,

      isActive: true,

      createdBy: "Front Office",

      createdDate: new Date().toISOString(),

      updatedBy: "Front Office",

      updatedDate: new Date().toISOString(),

    };

    console.log("Patient Registration API Payload:", payload);

    // Subscribe before dispatch to receive the new registration response.
    const registrationPromise = firstValueFrom(
      this.store.select(selectRegisteredPatientByReceptionist).pipe(
        skip(1),
        filter((res: any) => !!res),
        take(1)
      )
    );

    this.store.dispatch(
      register_by_reseptionist({
        patient: payload
      })
    );

    const registrationResponse: any = await registrationPromise;

    console.log(
      "Patient Registration Response:",
      registrationResponse
    );

    this.clearTimer();

    await this.router.navigate(
      ["/front-office/appointment-success"],
      {
        state: {
          successData: {
            h1: "Patient Registered Successfully!",

            span: "The patient has been registered successfully.",

            p: "You can now view their details and manage their appointments.",

            buttonText: "Go to Dashboard",

            route: "/front-office/dashboard",
          },
        },
      }
    );
  }

  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    this.clearTimer();

    if (this.flow === "login") {

      this.router.navigate(["/front-office/login"]);
      return;

    }

    if (this.flow === "registration") {

      this.router.navigate(
        ["/front-office/patient-registration"],
        {
          state: {
            registrationData: this.registrationData,
            restoreRegistration: true
          }
        }
      );
      return;

    }

    if (this.flow === "appointment") {

      this.router.navigate(["/front-office/booking-patient-information"]);
      return;

    }

    this.router.navigate(["/front-office/login"]);
  }

  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.clearTimer();

  }
}
