import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');


  if (!token || !user) {
    return true;
  }


  switch (user.userType) {

    case 'Patient':
      return router.createUrlTree(['/patient/dashboard']);

    case 'Associate':
      return router.createUrlTree(['/front-office/dashboard']);
    case 'Admin':
      return router.createUrlTree(['/admin/dashboard']);

    default:
      console.log('Unknown role:', user?.roleName);
      localStorage.clear();
      return true;
  }
};