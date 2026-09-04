import { Routes } from '@angular/router';

import { PatientLoginComponent } from './patient-login/patient-login.component';
import { FrontofficeLoginComponent } from './frontoffice-login/frontoffice-login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ForgetPasswordComponent } from './patient-login/forget-password/forget-password.component';
import { SelfRegistrationComponent } from './patient-login/self-registration/self-registration.component';
import { LoginSelectionComponent } from './login-selection/login-selection.component';
import { loginGuard } from '../core/guards/login.guard';

export const AUTH_ROUTES: Routes = [

    // Login Selection
    {
        path: '',
        component: LoginSelectionComponent
    },

    // Patient Login
    {
        path: 'patient/login',
        component: PatientLoginComponent,
        canActivate: [loginGuard]
    },

    // Front Office Login
    {
        path: 'front-office/login',
        component: FrontofficeLoginComponent,
        canActivate: [loginGuard]
    },

    // Admin Login
    {
        path: 'admin/login',
        component: AdminLoginComponent,
        canActivate: [loginGuard]
    },

    // Forgot Password
    {
        path: 'forgot-password',
        component: ForgetPasswordComponent
    },

    // Self Registration
    {
        path: 'self-registration',
        component: SelfRegistrationComponent
    }

];