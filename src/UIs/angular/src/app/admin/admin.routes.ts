
import { Routes } from '@angular/router';
import { loginGuard } from '../core/guards/login.guard';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { authGuard } from '../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [

    // Admin Login
    {
        path: 'login',
        loadComponent: () =>
            import('../auth/admin-login/admin-login.component')
                .then(m => m.AdminLoginComponent),
        canActivate: [loginGuard]
    },

    // Admin Layout
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            // Association List
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../Pages/Association-Part/association-list/association-list.component')
                        .then(m => m.AssociationListComponent)
            },

            // Update Association
            {
                path: 'update-association/:associateId',
                loadComponent: () =>
                    import('../Pages/Association-Part/edit-association/edit-association.component')
                        .then(m => m.EditAssociationComponent)
            },

            // Association Schedule
            {
                path: 'association-schedule',
                loadComponent: () =>
                    import('../Pages/Association-Part/assign-schedule-asspciation/assign-schedule-asspciation.component')
                        .then(m => m.AssignScheduleAsspciationComponent)
            },

            // Association Registration
            {
                path: 'associate-registration',
                loadComponent: () =>
                    import('../Pages/Association-Part/helth-care-association/helth-care-association.component')
                        .then(m => m.HelthCareAssociationComponent)
            }

        ]
    }

];
