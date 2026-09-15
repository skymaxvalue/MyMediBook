import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = () => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const user = JSON.parse(
    localStorage.getItem('user') || 'null'
  );

  // User is NOT logged in
  if (!token || !user) {
    return true;
  }

  switch (user.userType) {

    case 'Patient': {

      const selectedHospitalId =
        localStorage.getItem('selectedHospitalId');

      // Hospital already selected
      if (selectedHospitalId) {
        return router.createUrlTree([
          '/patient/dashboard'
        ]);
      }

      // Patient logged in but hospital not selected
      return router.createUrlTree([
        '/patient/select-hospital'
      ]);
    }

    case 'Associate':
      return router.createUrlTree([
        '/front-office/dashboard'
      ]);

    case 'Admin':
      return router.createUrlTree([
        '/admin/dashboard'
      ]);

    default:

      console.log(
        'Unknown role:',
        user?.userType
      );

      localStorage.clear();

      return true;
  }
};