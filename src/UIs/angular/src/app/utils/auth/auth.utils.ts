export function readUser(): any | null {
  try {
    return JSON.parse(localStorage.getItem("user") ?? "null");
  } catch {
    return null;
  }
}

export function homeFor(user: any): string | null {
  switch (user?.userType) {
    case "Patient":
      return user.activeHospitalId > 0 && !user.needsHospitalSelection
        ? "/patient/dashboard"
        : "patient/select-hospital";
    case "Associate":
      return user.roleName === "Receptionist" ? "/front-office/dashboard" : null; // doctor home TBD
    case "Admin":
      return "/admin/dashboard";
    default:
      return null;
  }
}
