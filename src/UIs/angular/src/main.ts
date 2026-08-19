import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideZoneChangeDetection,
} from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserModule } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  //  StoreModule,
  provideStore
} from "@ngrx/store";
import {
  //  StoreDevtoolsModule,
  provideStoreDevtools
} from "@ngrx/store-devtools";
import {
  //  EffectsModule,
  provideEffects
} from "@ngrx/effects";
import { ToastrModule } from "ngx-toastr";
import { ErrorHandler, provideAppInitializer, isDevMode } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";

import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";
import { routes } from "./app/app-routing.module";
import { GlobalErrorHandler } from "./app/shared/global-error-handler";
import { authInterceptorProvider } from "./app/auth/auth.interceptor";
import { loggingInterceptorProvider } from "./app/logging/logging.interceptor";
import { AuthInitializer } from "./app/auth/auth.initializer";
import { AuthService } from "./app/auth/auth.service";

// Guards
import { ProductDetailGuard } from "./app/products/view-product-details/product-detail.guard";
import { AddProductGuard } from "./app/products/add-product/add-product.guard";
import { EditProductGuard } from "./app/products/edit-product/edit-product.guard";

// Audit Log State
import { auditLogReducer } from "./app/auditlogs/audit-log.reducer";
import { AuditLogEffects } from "./app/auditlogs/audit-log.effects";
// import { AuthEffects } from "./app/Store/Auth/auth.effects";

// Auth State
import { AuthEffects } from "./app/Store/Auth/auth.effects";
import { AuthState } from "./app/Store/Auth/auth.state"
import { authReducer } from "./app/Store/Auth/auth.reducer"
import { PatientEffects } from "./app/Store/Patient/patient.effect";
import { patientReducer } from "./app/Store/Patient/patient.reducer";
import { appointmentReducer } from "./app/Store/Appointments/appointment.reducer";
import { AppointmentEffects } from "./app/Store/Appointments/appointment.effect";
import { doctorSpecialityReducer } from "./app/Store/Doctor/doctor.reducer";
import { DoctorSpecialityEffects } from "./app/Store/Doctor/doctor.effect";
import { LabResultReducer } from "./app/Store/Lab-Results/lab-result.reducer";
import { LabResultEffects } from "./app/Store/Lab-Results/lab-result.effect";
import { BillsEffects } from "./app/Store/Billing/billing.effect";
import { BillReducer } from "./app/Store/Billing/billing.reducer";
import { MessagesEffects } from "./app/Store/Messages/messages.effect";
import { MessagesReducer } from "./app/Store/Messages/messages.reducer";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // provideZoneChangeDetection(),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      // StoreModule.forRoot({}),
      // StoreModule.forFeature("auditLog", auditLogReducer),
      // StoreDevtoolsModule.instrument({
      //   name: "Practical.CleanArchitecture App DevTools",
      //   maxAge: 25,
      //   logOnly: environment.production,
      //   connectInZone: true,
      // }),
      // EffectsModule.forRoot([]),
      // EffectsModule.forFeature([AuditLogEffects]),
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        newestOnTop: true
      }),
      MatDatepickerModule,
      MatTimepickerModule,
      MatNativeDateModule,
      MatInputModule,
      MatFormFieldModule,
      MatDialogModule
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    authInterceptorProvider,
    loggingInterceptorProvider,
    provideAppInitializer(() => AuthInitializer(inject(AuthService))()),
    ProductDetailGuard,
    AddProductGuard,
    EditProductGuard,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideStore({
      auth: authReducer,
      patient: patientReducer,
      appointment: appointmentReducer,
      doctor: doctorSpecialityReducer,
      labresult: LabResultReducer,
      bills: BillReducer,
      message: MessagesReducer
    }),
    provideEffects([
      AuthEffects,
      PatientEffects,
      AppointmentEffects,
      DoctorSpecialityEffects,
      LabResultEffects,
      AuditLogEffects,
      BillsEffects,
      MessagesEffects
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
}).catch((err) => console.error(err));
