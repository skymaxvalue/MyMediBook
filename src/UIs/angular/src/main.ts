import { enableProdMode, importProvidersFrom, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserModule } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withInterceptorsFromDi, withXhr } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { provideEffects } from "@ngrx/effects";
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

import { AuditLogEffects } from "./app/auditlogs/audit-log.effects";

import { AuthEffects } from "./app/Store/Auth/auth.effects";
import { PatientEffects } from "./app/Store/Patient/patient.effect";
import { patientReducer } from "./app/Store/Patient/patient.reducer";
import { AppointmentEffects } from "./app/Store/Appointments/appointment.effect";
import { doctorSpecialityReducer } from "./app/Store/Doctor/doctor.reducer";
import { DoctorSpecialityEffects } from "./app/Store/Doctor/doctor.effect";
import { LabResultReducer } from "./app/Store/Lab-Results/lab-result.reducer";
import { LabResultEffects } from "./app/Store/Lab-Results/lab-result.effect";
import { BillsEffects } from "./app/Store/Billing/billing.effect";
import { BillReducer } from "./app/Store/Billing/billing.reducer";
import { MessagesEffects } from "./app/Store/Messages/messages.effect";
import { MessagesReducer } from "./app/Store/Messages/messages.reducer";
import { MasterEffects } from "./app/Store/Master/master.effect";
import { MasterReducer } from "./app/Store/Master/master.reducer";
import { AppointmentReducer } from "./app/Store/Appointments/appointment.reducer";
import { NavigationEffects } from "./app/Store/Shared/Navigation/navigation.effect";
import { AuthReducer } from "./app/Store/Auth/auth.reducer";
import { CommonReducer } from "./app/Store/Common/common.reducer";
import { CommonEffects } from "./app/Store/Common/common.effect";

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

      MatDatepickerModule,
      MatTimepickerModule,
      MatNativeDateModule,
      MatInputModule,
      MatFormFieldModule,
      MatDialogModule
    ),
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    authInterceptorProvider,
    loggingInterceptorProvider,
    provideAppInitializer(() => AuthInitializer(inject(AuthService))()),

    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    provideStore({
      auth: AuthReducer,
      patient: patientReducer,
      appointment: AppointmentReducer,
      doctor: doctorSpecialityReducer,
      labresult: LabResultReducer,
      bills: BillReducer,
      message: MessagesReducer,
      master: MasterReducer,
      common: CommonReducer,
    }),
    provideEffects([
      AuthEffects,
      PatientEffects,
      AppointmentEffects,
      DoctorSpecialityEffects,
      LabResultEffects,
      AuditLogEffects,
      BillsEffects,
      MessagesEffects,
      MasterEffects,
      NavigationEffects,
      CommonEffects,
    ]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
}).catch((err) => console.error(err));
