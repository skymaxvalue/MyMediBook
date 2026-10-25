import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { readUser } from "../../utils/auth/auth.utils";

export const FrontOfficeGuard: CanActivateFn = () => {
  const router = inject(Router);

  const user = readUser();

  if (user?.userType === "Associate" && user.roleName === "Receptionist") return true;

  return router.createUrlTree([user ? "/unauthorized" : "/patient/login"]);
};
