import {
  Component,
  OnDestroy,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/Store/app.state';
import { Store } from '@ngrx/store';
import { register_by_reseptionist, requestOTP, verifyOTP } from 'src/app/Store/Auth/auth.actions';
import { selectRegisteredPatientByReceptionist, selectVerifyOTP } from 'src/app/Store/Auth/auth.selectors';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: "app-otp-verification",
  imports: [CommonModule,
    FormsModule],
  templateUrl: "./otp-verification.component.html",
  styleUrl: "./otp-verification.component.css",
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  flow: 'login' | 'registration' | 'appointment' | 'reset-password' = 'login';

  registrationData: any = null;
  appointmentData: any = null;

  emailId: string = '';

  isLoading = false;
  errorMessage = '';

  time = 300;
  timerText = '05:00';
  isExpired = false;

  private timerSubscription?: Subscription;

  private countdown: any;
  currentUrl = '';
  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;
  otp: string[] = ['', '', '', ''];
  otpArray = [1, 2, 3, 4];



  pendingUser: any = null;

  resetPasswordToken: any;
  isLoginFlow: boolean = false;
  isBookAppointmentFlow: boolean = false;


  constructor(
    private router: Router, private store: Store<AppState>, private route: ActivatedRoute, private cdr: ChangeDetectorRef
  ) {
    this.currentUrl = this.router.url;
    console.log('Current URL:', this.currentUrl);
  }


  ngOnInit(): void {

    console.log('history.state:', history.state);

    const state = history.state;

    this.flow = state.flow || 'login';

    // LOGIN
    if (this.flow === 'login') {

      this.emailId = state.emailId;

      console.log('Login OTP flow');
      console.log('Email:', this.emailId);
    }

    // REGISTRATION
    else if (this.flow === 'registration') {

      this.registrationData = state.registrationData;

      this.emailId =
        this.registrationData?.contactInformation?.email || '';

      console.log('Registration OTP flow');
      console.log('Registration Data:', this.registrationData);
    }

    // APPOINTMENT
    else if (this.flow === 'appointment') {

      this.appointmentData = state.appointmentData;

      this.emailId =
        this.appointmentData?.email || '';

      console.log('Appointment OTP flow');
      console.log('Appointment Data:', this.appointmentData);
    }

    this.startTimer();
  }
  // ngOnInit(): void {

  //   console.log('history.state:', history.state);

  //   console.log('isLoginFlow:', this.isLoginFlow);
  //   console.log('isBookAppointmentFlow:', this.isBookAppointmentFlow);
  //   console.log('registrationData:', this.registrationData);
  //   this.emailId = history.state.emailId;
  //   this.isLoginFlow = history.state.isLoginFollow;
  //   if (this.isLoginFlow) {
  //     this.emailId = history.state.emailId;
  //   }
  //   this.isBookAppointmentFlow = history.state.isBookAppointment;
  //   console.log('isBookAppointmentFlow:', this.isBookAppointmentFlow);
  //   if (this.isBookAppointmentFlow) {
  //     this.emailId = history.state.registrationData.contactInformation.email;
  //     this.registrationData = history.state.registrationData,
  //       console.log('Form Data:', this.registrationData);
  //     console.log('Email ID:', this.emailId);
  //   }


  //   this.startTimer();

  // }
  moveNext(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      input.value.length === 1 &&
      index < this.otpInputs.length - 1
    ) {
      this.otpInputs.toArray()[index + 1]
        .nativeElement.focus();
    }
  }

  movePrevious(event: KeyboardEvent, index: number): void {

    const input = event.target as HTMLInputElement;

    if (
      event.key === 'Backspace' &&
      input.value === '' &&
      index > 0
    ) {
      this.otpInputs.toArray()[index - 1]
        .nativeElement.focus();
    }
  }


  onOtpInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;


    const value = input.value.replace(/\D/g, '');


    this.otp[index] = value.slice(0, 1);


    input.value = this.otp[index];


    if (this.otp[index] && index < this.otp.length - 1) {

      setTimeout(() => {
        this.otpInputs
          .toArray()[index + 1]
          ?.nativeElement
          .focus();
      });

    }
  }



  onKeyDown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {

      event.preventDefault();

      setTimeout(() => {
        this.otpInputs
          .toArray()[index - 1]
          ?.nativeElement
          .focus();
      });

    }

  }


  onPaste(event: ClipboardEvent): void {

    event.preventDefault();

    const pastedData =
      event.clipboardData
        ?.getData('text')
        .replace(/\D/g, '') || '';

    if (!pastedData) {
      return;
    }

    this.otp = ['', '', '', ''];

    pastedData
      .slice(0, 4)
      .split('')
      .forEach((digit, index) => {
        this.otp[index] = digit;
      });

    setTimeout(() => {

      const lastIndex =
        Math.min(pastedData.length, 4) - 1;

      if (lastIndex >= 0) {

        this.otpInputs
          .toArray()[lastIndex]
          ?.nativeElement
          .focus();

      }

    });

  }


  startTimer(): void {

    this.clearTimer();

    this.time = 300;
    this.isExpired = false;

    this.updateTimerText();

    this.countdown = setInterval(() => {

      this.time--;

      console.log('Timer:', this.time);

      this.updateTimerText();

      // Force Angular UI update
      this.cdr.detectChanges();

      if (this.time <= 0) {

        this.clearTimer();

        this.isExpired = true;
        this.timerText = 'Expired';

        this.cdr.detectChanges();
      }

    }, 1000);
  }

  updateTimerText(): void {

    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;

    this.timerText =
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }



  async resendOtp(): Promise<void> {

    if (!this.isExpired) {
      return;
    }

    this.errorMessage = '';

    this.otp = ['', '', '', ''];

    try {

      // Same OTP API for all flows
      await this.store.dispatch(
        requestOTP({
          email: this.emailId
        })
      );

      // Restart 5 minute timer
      this.startTimer();

      console.log('OTP resent successfully');

    } catch (error) {

      console.error('Resend OTP Error:', error);

      this.errorMessage =
        'Unable to resend OTP. Please try again.';
    }
  }

  async verifyOtp() {

    this.errorMessage = '';


    const enteredOtp =
      this.otp.join('');


    if (enteredOtp.length !== 4) {

      this.errorMessage =
        'Please enter the complete OTP.';

      return;

    }


    // this.isLoading = true;

    await this.store.dispatch(verifyOTP({ email: this.emailId, otpCode: enteredOtp }))

    await this.store.select(selectVerifyOTP).subscribe(async (res: any) => {
      if (res) {
        this.resetPasswordToken = res.token
        if (this.isLoginFlow) {
          this.router.navigate([])
          this.router.navigate([
            '/front-office/dashboard'
          ]
          ).then(() => {
            window.history.replaceState(null, '', window.location.pathname);

          });
        } else if (this.isBookAppointmentFlow && this.registrationData) {
          const formData = { ...this.registrationData }
          const payload: any = {
            firstName: formData.personalDetails.firstName,
            middleName: "", // Your form doesn't currently have middleName
            lastName: formData.personalDetails.lastName,

            dateOfBirth: formData.personalDetails.dateOfBirth,

            phoneCountryCode:
              formData.contactInformation.phoneCode,

            phoneNumber:
              formData.contactInformation.phone,

            emailId:
              formData.contactInformation.email,

            gender:
              formData.personalDetails.gender,

            // =========================
            // CURRENT / PRESENT ADDRESS
            // =========================

            address:
              formData.contactInformation.presentAddress.address,

            cityId:
              Number(formData.contactInformation.presentAddress.cityId),

            zipCode:
              formData.contactInformation.presentAddress.pinCode,

            stateId:
              Number(formData.contactInformation.presentAddress.stateId),

            countryId:
              Number(formData.contactInformation.presentAddress.countryId),

            // =========================
            // BILLING ADDRESS
            // =========================

            billingAddress:
              formData.contactInformation.permanentAddress.address,

            billingCityId:
              Number(formData.contactInformation.permanentAddress.cityId),

            billingZipCode:
              formData.contactInformation.permanentAddress.pinCode,

            billingStateId:
              Number(formData.contactInformation.permanentAddress.stateId),

            billingCountryId:
              Number(formData.contactInformation.permanentAddress.countryId),

            // =========================
            // INSURANCE
            // =========================

            insurance:
              formData.personalDetails.insuranceChoice === 'yes'
                ? 1
                : 0,

            insuranceData:
              formData.personalDetails.insuranceChoice === 'yes'
                ? {
                  provider:
                    formData.insuranceDetails.provider,

                  policy:
                    formData.insuranceDetails.policy,

                  groupId:
                    formData.insuranceDetails.groupId,

                  holderName:
                    formData.insuranceDetails.holderName,

                  address:
                    formData.insuranceDetails.insuranceAddress
                }
                : null,

            // =========================
            // PAYMENT
            // =========================

            paymentData: {
              paymentType:
                formData?.paymentData?.paymentType ? formData?.paymentData?.paymentType : null,

              cardHolder:
                formData?.paymentData?.cardHolder ? formData?.paymentData?.cardHolder : null,

              cardNumber:
                formData?.paymentData?.cardNumber ? formData?.paymentData?.cardNumber : null,

              expiry:
                formData?.paymentData?.expiry ? formData?.paymentData?.expiry : null
            }
            ,
            isActive: true,

            createdBy: "Front Office",

            createdDate: new Date().toISOString(),

            updatedBy: "Front Office",

            updatedDate: new Date().toISOString()
          };

          await this.store.dispatch(register_by_reseptionist({ patient: { ...payload } }))
          await this.store.select(selectRegisteredPatientByReceptionist).subscribe((res: any) => {
            if (res) {
              this.router.navigate([
                '/front-office/appointment-success'
              ], {
                state: {
                  successData: {
                    h1: 'Patient Registered Successfully!',
                    span: 'The patient has been registered successfully.',
                    p: 'You can now view their details and manage their appointments.',
                    buttonText: 'Go to Dashboard',
                    route: '/front-office/dashboard'
                  }
                }
              })
            }
          })

        } else {
          this.router.navigate([
            '/front-office/reset-password'
          ], {
            state: {
              token: this.resetPasswordToken
            }
          }
          );
        }

        console.log("OTP verified successfully.");
      }
    })

  }


  // ==========================================
  // CANCEL
  // ==========================================

  cancel(): void {

    // Stop OTP timer
    this.clearTimer();

    // =========================
    // LOGIN FLOW
    // =========================
    if (this.flow === 'login') {

      this.router.navigate([
        '/front-office/login'
      ]);

      return;
    }

    // =========================
    // REGISTRATION FLOW
    // =========================
    if (this.flow === 'registration') {

      this.router.navigate([
        '/front-office/patient-registration'
      ]);

      return;
    }

    // =========================
    // APPOINTMENT FLOW
    // =========================
    if (this.flow === 'appointment') {

      this.router.navigate([
        '/front-office/booking-patient-information'
      ]);

      return;
    }

    // =========================
    // FALLBACK
    // =========================
    this.router.navigate([
      '/front-office/login'
    ]);
  }


  // ==========================================
  // CLEAR TIMER
  // ==========================================

  clearTimer(): void {

    this.timerSubscription?.unsubscribe();
    this.timerSubscription = undefined;
  }

  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {
    this.clearTimer();
  }

}
