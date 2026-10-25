import { createAction } from "@ngrx/store";

export const NavigateToPatientHospitalSelectionPage = createAction(
  "[Navigation] Navigate To Patient Hospital Selection Page"
);
export const NavigateToPatientDashboardPage = createAction(
  "[Navigation] Navigate To Patient Dashboard Page"
);
export const NavigateToDoctorDashboardPage = createAction(
  "[Navigation] Navigate To Associate Dashboard Page"
);
export const NavigateToFrontOfficeDashboardPage = createAction(
  "[Navigation] Navigate To Front Office Dashboard Page"
);
export const NavigateToAdminDashboardPage = createAction(
  "[Navigation] Navigate To Admin Dashboard Page"
);
