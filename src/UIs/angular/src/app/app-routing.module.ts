import { Routes } from "@angular/router";
import { WelcomeComponent } from "./core/welcome.component";
import { OidcLoginRedirect } from "./auth/oidc-login-redirect.component";

// Products
import { ListProductsComponent } from "./products/list-products/list-products.component";
import { ProductDetailComponent } from "./products/view-product-details/product-detail.component";
import { AddProductComponent } from "./products/add-product/add-product.component";
import { EditProductComponent } from "./products/edit-product/edit-product.component";
import { ProductDetailGuard } from "./products/view-product-details/product-detail.guard";
import { AddProductGuard } from "./products/add-product/add-product.guard";
import { EditProductGuard } from "./products/edit-product/edit-product.guard";

// Users
import { ListUsersComponent } from "./users/list-users/list-users.component";
import { AddEditUserComponent } from "./users/add-edit-user/add-edit-user.component";
import { ViewUserDetailsComponent } from "./users/view-user-details/view-user-details.component";

// Files
import { ListFilesComponent } from "./files/list-files/list-files.component";
import { UploadFileComponent } from "./files/upload-file/upload-file.component";
import { EditFileComponent } from "./files/edit-file/edit-file.component";

// Settings
import { ConfigurationEntryListComponent } from "./settings/configuration-entry-list.component";

// Audit Logs
import { AuditLogListComponent } from "./auditlogs/audit-log-list.component";
import { SelfRegistrationComponent } from "./auth/self-registration/self-registration.component";
import { LoginComponent } from "./auth/login/login.component";
import { MainLayoutComponent } from "./main-layout/main-layout.component";

import { DashboardComponent } from "./Pages/dashboard/dashboard.component";
import { authGuard } from "./auth/guards/auth.guard";
import { OtpLoginComponent } from "./users/otp-login/otp-login.component";
import { ForgetPasswordComponent } from "./auth/forget-password/forget-password.component";
import { HelthCareAssociationComponent } from "./Pages/Association-Part/helth-care-association/helth-care-association.component";
import { AssociationListComponent } from "./Pages/Association-Part/association-list/association-list.component";
import { AssignScheduleAsspciationComponent } from "./Pages/Association-Part/assign-schedule-asspciation/assign-schedule-asspciation.component";
import { RescheduleComponent } from "./Pages/reschedule/reschedule.component";
import { RescheduleSuccessComponent } from "./Pages/reschedule-success/reschedule-success.component";
import { ViewResheduleRulesComponent } from "./Components/view-reshedule-rules/view-reshedule-rules.component";
import { ViewCancelsheduleRulesComponent } from "./Components/view-cancelshedule-rules/view-cancelshedule-rules.component";

export const routes: Routes = [
  {
    path: "patient",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        children: [

          {
            path: "",
            redirectTo: "appointments",
            pathMatch: "full"
          },

          // My Appointments
          {
            path: "appointments",
            loadComponent: () =>
              import("./Pages/my-appointment/my-appointment.component")
                .then(m => m.MyAppointmentComponent)
          },

          // Specialities
          {
            path: "specialities",
            loadComponent: () =>
              import("./Pages/specialities/specialities.component")
                .then(m => m.SpecialitiesComponent)
            //     ,
            //   children:[
            //     {
            //   path: 'doctor-availability',
            //   loadComponent: () =>
            //     import('./Pages/check-doc-available/check-doc-available.component')
            //       .then(m => m.CheckDocAvailableComponent)
            // }
            //   ]
          },

          // Doctor Availability
          {
            path: "doctor-availability",
            loadComponent: () =>
              import("./Pages/check-doc-available/check-doc-available.component")
                .then(m => m.CheckDocAvailableComponent)
          },


          // Medicine Orders
          {
            path: "medicine",
            loadComponent: () =>
              import("./Pages/medicine-orders/medicine-orders.component")
                .then(m => m.MedicineOrdersComponent)
          },

          // Lab Results
          {
            path: "labresult",
            loadComponent: () =>
              import("./Pages/lab-result/lab-result.component")
                .then(m => m.LabResultComponent)
          },

          // Billing
          {
            path: "billing",
            loadComponent: () =>
              import("./Pages/billing/billing.component")
                .then(m => m.BillingComponent)
          },

          // Messages
          {
            path: "messages",
            loadComponent: () =>
              import("./Pages/messages/messages.component")
                .then(m => m.MessagesComponent)
          },

          // Settings
          // {
          //   path: "setting",
          //   loadComponent: () =>
          //     import("./Pages/settings/settings.component")
          //       .then(m => m.SettingsComponent)
          // },

          // Appointment Reschedule
          {
            path: "appointment-reschedule",
            component: RescheduleComponent
          },
          {
            path: "appointment-reschedule-successfull",
            component: RescheduleSuccessComponent
          }
        ]
      },

      // Existing routes
      {
        path: "association",
        component: HelthCareAssociationComponent
      },
      {
        path: "association-list",
        component: AssociationListComponent
      },

      {
        path: "association-schedule",
        component: AssignScheduleAsspciationComponent
      },
      {
        path: "profile-update",
        component: SelfRegistrationComponent
      }
    ]
  },
  {
    path: "associate",
    component: MainLayoutComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        children: [


          {
            path: "",
            redirectTo: "association-list",
            pathMatch: "full"

          },
          // My Appointments
          {
            path: "registration",
            loadComponent: () =>
              import("./Pages/Association-Part/helth-care-association/helth-care-association.component")
                .then(m => m.HelthCareAssociationComponent)
          },
          {
            path: "assign-schedule",
            loadComponent: () =>
              import("./Pages/Association-Part/assign-schedule-asspciation/assign-schedule-asspciation.component")
                .then(m => m.AssignScheduleAsspciationComponent)
          },

          // Specialities
          {
            path: "association-list",
            loadComponent: () =>
              import("./Pages/Association-Part/association-list/association-list.component")
                .then(m => m.AssociationListComponent)

          },
          {
            path: "update-association/:associateId",
            loadComponent: () =>
              import("./Pages/Association-Part/edit-association/edit-association.component")
                .then(m => m.EditAssociationComponent)

          },

          // Doctor Availability
          {
            path: "doctor-availability",
            loadComponent: () =>
              import("./Pages/check-doc-available/check-doc-available.component")
                .then(m => m.CheckDocAvailableComponent)
          },


          // Medicine Orders
          {
            path: "medicine",
            loadComponent: () =>
              import("./Pages/medicine-orders/medicine-orders.component")
                .then(m => m.MedicineOrdersComponent)
          },

          // Lab Results
          {
            path: "labresult",
            loadComponent: () =>
              import("./Pages/lab-result/lab-result.component")
                .then(m => m.LabResultComponent)
          },

          // Billing
          {
            path: "billing",
            loadComponent: () =>
              import("./Pages/billing/billing.component")
                .then(m => m.BillingComponent)
          },

          // Messages
          {
            path: "messages",
            loadComponent: () =>
              import("./Pages/messages/messages.component")
                .then(m => m.MessagesComponent)
          },

          // Settings
          // {
          //   path: "setting",
          //   loadComponent: () =>
          //     import("./Pages/settings/settings.component")
          //       .then(m => m.SettingsComponent)
          // },

          // Appointment Reschedule
          {
            path: "appointment-reschedule",
            component: RescheduleComponent
          },
          {
            path: "appointment-reschedule-successfull",
            component: RescheduleSuccessComponent
          }
        ]
      },

      // Existing routes
      {
        path: "association",
        component: HelthCareAssociationComponent
      },
      {
        path: "association-list",
        component: AssociationListComponent
      },

      {
        path: "association-schedule",
        component: AssignScheduleAsspciationComponent
      },
      {
        path: "profile-update",
        component: SelfRegistrationComponent
      }
    ]
  },

  // Authentication
  {
    path: "patient-login",
    component: LoginComponent
  },
  {
    path: "admin-login",
    component: LoginComponent
  },
  {
    path: "forgot-password",
    component: ForgetPasswordComponent
  },
  {
    path: "sign-up",
    component: SelfRegistrationComponent
  },
  {
    path: "reschedullation-policy",
    component: ViewResheduleRulesComponent
  },
  {
    path: "cancellation-policy",
    component: ViewCancelsheduleRulesComponent
  },

  {
    path: "**",
    redirectTo: "login"
  }
];
