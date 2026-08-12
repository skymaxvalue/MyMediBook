import { Routes } from '@angular/router';
import { PatientLayoutComponent } from '../layouts/patient-layout/patient-layout.component';
import { authGuard } from '../core/guards/auth.guard';
import { loginGuard } from '../core/guards/login.guard';

export const PATIENT_ROUTES: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('../auth/patient-login/patient-login.component')
                .then(m => m.PatientLoginComponent)
        ,
        canActivate: [loginGuard]
    },

    {
        path: '',
        component: PatientLayoutComponent,
        canActivate: [authGuard],

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
                    import('../Pages/Patient-View/dashboard/dashboard.component')
                        .then(m => m.DashboardComponent),

                children: [

                    {
                        path: '',
                        redirectTo: 'appointments',
                        pathMatch: 'full'
                    },

                    {
                        path: 'appointments',
                        loadComponent: () =>
                            import('../Pages/Patient-View/my-appointment/my-appointment.component')
                                .then(m => m.MyAppointmentComponent)
                    },

                    {
                        path: 'specialities',
                        loadComponent: () =>
                            import('../Pages/Patient-View/specialities/specialities.component')
                                .then(m => m.SpecialitiesComponent)
                    },

                    {
                        path: 'medicine',
                        loadComponent: () =>
                            import('../Pages/Patient-View/medicine-orders/medicine-orders.component')
                                .then(m => m.MedicineOrdersComponent)
                    },

                    {
                        path: 'labresult',
                        loadComponent: () =>
                            import('../Pages/Patient-View/lab-result/lab-result.component')
                                .then(m => m.LabResultComponent)
                    },
                    {
                        path: "doctor-availability",
                        loadComponent: () =>
                            import("../Pages/Patient-View/check-doc-available/check-doc-available.component")
                                .then(m => m.CheckDocAvailableComponent)
                    },

                    {
                        path: 'billing',
                        loadComponent: () =>
                            import('../Pages/Patient-View/billing/billing.component')
                                .then(m => m.BillingComponent)
                    },

                    {
                        path: 'messages',
                        loadComponent: () =>
                            import('../Pages/Patient-View/messages/messages.component')
                                .then(m => m.MessagesComponent)
                    },

                    {
                        path: 'settings',
                        loadComponent: () =>
                            import('../Pages/Patient-View/messages/messages.component')
                                .then(m => m.MessagesComponent)
                    }

                ]
            }

        ]
    }

];