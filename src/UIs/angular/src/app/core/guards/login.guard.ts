import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');


  if (!token || !user) {
    return true;
  }


  switch (user.roleName) {

    case 'Patient':
      return router.createUrlTree(['/patient/dashboard']);

    case 'Associate':
      return router.createUrlTree(['/associate/dashboard']);

    case 'Admin':
      return router.createUrlTree(['/admin/dashboard']);

    default:
      localStorage.clear();
      return true;
  }
};