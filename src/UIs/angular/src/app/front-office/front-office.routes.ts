import { Routes } from '@angular/router';
import { loginGuard } from '../core/guards/login.guard';
import { FrontOfficeLayoutComponent } from '../layouts/front-office-layout/front-office-layout.component';
import { authGuard } from '../core/guards/auth.guard';
import { PatientCheckInComponent } from '../Pages/Front-Office-View/patient-check-in/patient-check-in.component';

export const FRONT_OFFICE_ROUTES: Routes = [


    {
        path: 'login',
        loadComponent: () =>
            import('../auth/frontoffice-login/frontoffice-login.component')
                .then(m => m.FrontofficeLoginComponent),
        canActivate: [loginGuard]
    },

    {
        path: 'otp-verification',
        loadComponent: () =>
            import('../auth/frontoffice-login/otp-verification/otp-verification.component')
                .then(m => m.OtpVerificationComponent)
    },

    {
        path: 'forgot-password',
        loadComponent: () =>
            import('../auth/frontoffice-login/forgot-password/forgot-password.component')
                .then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('../auth/frontoffice-login/reset-password/reset-password.component')
                .then(m => m.ResetPasswordComponent)
    },
    {
        path: 'sendotp-verification',
        loadComponent: () =>
            import('../auth/frontoffice-login/otp-verification/otp-verification.component')
                .then(m => m.OtpVerificationComponent)
    }

    , {
        path: '',
        component: FrontOfficeLayoutComponent,
        // canActivate: [authGuard],

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            // Dashboard
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../Pages/Front-Office-View/dashboard/dashboard.component')
                        .then(m => m.DashboardComponent),

                children: [


                ],

            },
            {
                path: 'patient-registration',
                loadComponent: () =>
                    import('../Pages/Front-Office-View/patient-registration-fo/patient-registration-fo.component')
                        .then(m => m.PatientRegistrationFOComponent)
            },
            {
                path: 'book-appointment',
                loadComponent: () =>
                    import('../Pages/Patient-View/book-appoiment-form/book-appoiment-form.component')
                        .then(m => m.BookAppoimentFormComponent)
            },
            {
                path: 'patient-checkin',
                component: PatientCheckInComponent
            },
            {
                path: 'next-in-queue',
                loadComponent: () =>
                    import('../Pages/Front-Office-View/next-in-queue/next-in-queue.component')
                        .then(m => m.NextInQueueComponent)
            },
            {
                path: 'doctor-queue',
                loadComponent: () =>
                    import('../Pages/Front-Office-View/doctor-queue/doctor-queue.component')
                        .then(m => m.DoctorQueueComponent)
            }

        ]
    }
];