import { FollowUpVisitsComponent } from "./../Pages/Front-Office-View/follow-up-visits/follow-up-visits.component";
import { Routes } from "@angular/router";
import { loginGuard } from "../core/guards/login.guard";
import { FrontOfficeLayoutComponent } from "../layouts/front-office-layout/front-office-layout.component";
import { authGuard } from "../core/guards/auth.guard";
import { PatientCheckInComponent } from "../Pages/Front-Office-View/patient-check-in/patient-check-in.component";
import { FrontOfficeGuard } from "../core/guards/front-office.guard";

export const FRONT_OFFICE_ROUTES: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("../auth/frontoffice-login/frontoffice-login.component").then(
        (m) => m.FrontofficeLoginComponent
      ),
    canActivate: [loginGuard],
  },

  {
    path: "otp-verification",
    loadComponent: () =>
      import("../auth/frontoffice-login/otp-verification/otp-verification.component").then(
        (m) => m.OtpVerificationComponent
      ),
  },

  {
    path: "forgot-password",
    loadComponent: () =>
      import("../auth/frontoffice-login/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: "reset-password",
    loadComponent: () =>
      import("../auth/frontoffice-login/reset-password/reset-password.component").then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: "sendotp-verification",
    loadComponent: () =>
      import("../auth/frontoffice-login/otp-verification/otp-verification.component").then(
        (m) => m.OtpVerificationComponent
      ),
  },
  {
    path: "",
    component: FrontOfficeLayoutComponent,
    canActivate: [FrontOfficeGuard],

    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },

      // Dashboard
      {
        path: "dashboard",
        loadComponent: () =>
          import("../Pages/Front-Office-View/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "patient-registration",
        loadComponent: () =>
          import("../Pages/Front-Office-View/patient-registration-fo/patient-registration-fo.component").then(
            (m) => m.PatientRegistrationFOComponent
          ),
      },
      {
        path: "doctor-availability",
        loadComponent: () =>
          import("../Pages/Patient-View/check-doc-available/check-doc-available.component").then(
            (m) => m.CheckDocAvailableComponent
          ),
      },
      {
        path: "patient-check-in",
        component: PatientCheckInComponent,
      },
      {
        path: "next-in-queue",
        loadComponent: () =>
          import("../Pages/Front-Office-View/next-in-queue/next-in-queue.component").then(
            (m) => m.NextInQueueComponent
          ),
      },
      {
        path: "doctor-queue/:doctorId",
        loadComponent: () =>
          import("../Pages/Front-Office-View/doctor-queue/doctor-queue.component").then(
            (m) => m.DoctorQueueComponent
          ),
      },
      {
        path: "book-appointment",
        loadComponent: () =>
          import("../Pages/Patient-View/specialities/specialities.component").then(
            (m) => m.SpecialitiesComponent
          ),
      },
      {
        path: "otp-verification-for-appointment",
        loadComponent: () =>
          import("../auth/frontoffice-login/otp-verification/otp-verification.component").then(
            (m) => m.OtpVerificationComponent
          ),
      },
      {
        path: "otp-verification-for-registration",
        loadComponent: () =>
          import("../auth/frontoffice-login/otp-verification/otp-verification.component").then(
            (m) => m.OtpVerificationComponent
          ),
      },
      {
        path: "appointment-success",
        loadComponent: () =>
          import("../Pages/Front-Office-View/succses/succses.component").then(
            (m) => m.SuccsesComponent
          ),
      },
      {
        path: "lab-service",
        loadComponent: () =>
          import("../Pages/Front-Office-View/lab-services/lab-services.component").then(
            (m) => m.LabServiceComponent
          ),
      },
      {
        path: "room-service",
        loadComponent: () =>
          import("../Pages/Front-Office-View/room-service/room-service.component").then(
            (m) => m.RoomServiceComponent
          ),
      },
      {
        path: "follow-up-visits",
        loadComponent: () =>
          import("../Pages/Front-Office-View/follow-up-visits/follow-up-visits.component").then(
            (m) => m.FollowUpVisitsComponent
          ),
      },
      {
        path: "physician-consultation",
        loadComponent: () =>
          import("../Pages/Front-Office-View/physician-consultation/physician-consultation.component").then(
            (m) => m.PhysicianConsultationComponent
          ),
      },
      {
        path: "payment-gateway",
        loadComponent: () =>
          import("../Pages/Front-Office-View/payment/payment.component").then(
            (m) => m.PaymentComponent
          ),
      },
      {
        path: "prescription-refill",
        loadComponent: () =>
          import("../Pages/Front-Office-View/prescription-refill/prescription-refill.component").then(
            (m) => m.PrescriptionRefillComponent
          ),
      },

      // Claims Module
      {
        path: "claims-dashboard",
        loadComponent: () =>
          import("../Pages/Front-Office-View/claim-layout/claim-layout.component").then(
            (m) => m.ClaimLayoutComponent
          ),

        children: [

          {
            path: "",
            loadComponent: () =>
              import("../Pages/Front-Office-View/claim-layout/claim-dashboard/claim-dashboard.component").then(
                (m) => m.ClaimDashboardComponent
              ),
          },

          // All Claims Records
          {
            path: "all",
            loadComponent: () =>
              import("../Pages/Front-Office-View/claim-layout/claim-records/claim-records.component").then(
                (m) => m.ClaimRecordsComponent
              ),
          },
          {
            path: "new-claim",
            loadComponent: () =>
              import("../Pages/Front-Office-View/claim-layout/new-claim/new-claim.component").then(
                (m) => m.NewClaimComponent
              )
          },
          {
            path: 'claim-details',
            loadComponent: () =>
              import('../Pages/Front-Office-View/claim-layout/claim-details/claim-details.component')
                .then(m => m.ClaimDetailsComponent)
          }
        ],
      },

    ],
  },
];
