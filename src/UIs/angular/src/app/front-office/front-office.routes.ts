import { Routes } from '@angular/router';
import { loginGuard } from '../core/guards/login.guard';
import { FrontOfficeLayoutComponent } from '../layouts/front-office-layout/front-office-layout.component';
import { authGuard } from '../core/guards/auth.guard';

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



                ]
            }

        ]
    }
];