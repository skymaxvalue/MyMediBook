import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { homeFor, readUser } from "../../utils/auth/auth.utils";

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = readUser();
  if (!localStorage.getItem("token") || !user) return true;

  const home = homeFor(user);
  if (home) return router.createUrlTree([home]);

  ["token", "refreshToken", "user"].forEach((k) => localStorage.removeItem(k));
  return true;
};
