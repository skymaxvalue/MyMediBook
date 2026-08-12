import { Routes } from '@angular/router';
import { loginGuard } from '../core/guards/login.guard';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { authGuard } from '../core/guards/auth.guard';
import { AssignScheduleAsspciationComponent } from '../Pages/Association-Part/assign-schedule-asspciation/assign-schedule-asspciation.component';

export const ADMIN_ROUTES: Routes = [

    // Admin Login

    {
        path: 'login',
        loadComponent: () =>
            import('../auth/admin-login/admin-login.component')
                .then(m => m.AdminLoginComponent),

        // canActivate: [loginGuard]
    },

    // Admin Layout
    {
        path: '',
        component: AdminLayoutComponent,
        // canActivate: [authGuard],

        children: [

            // /admin
            {
                path: '',
                redirectTo: 'associate-list',
                pathMatch: 'full'
            },

            // /admin/dashboard
            {
                path: 'associate-list',
                loadComponent: () =>
                    import('../Pages/Association-Part/association-list/association-list.component')
                        .then(m => m.AssociationListComponent)
            },
            {
                path: 'update-association/:associateId',
                loadComponent: () =>
                    import('../Pages/Association-Part/edit-association/edit-association.component')
                        .then(m => m.EditAssociationComponent)
            },
            {
                path: "association-schedule",
                component: AssignScheduleAsspciationComponent
            },

        ]
    }

];