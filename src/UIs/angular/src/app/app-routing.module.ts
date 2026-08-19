import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./auth/login-selection/login-selection.component')
        .then(m => m.LoginSelectionComponent)
  },

  {
    path: 'patient',
    loadChildren: () =>
      import('./patient/patient.routes')
        .then(m => m.PATIENT_ROUTES)
  },

  {
    path: 'front-office',
    loadChildren: () =>
      import('./front-office/front-office.routes')
        .then(m => m.FRONT_OFFICE_ROUTES)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },

  {
    path: '**',
    redirectTo: ''
  }

];