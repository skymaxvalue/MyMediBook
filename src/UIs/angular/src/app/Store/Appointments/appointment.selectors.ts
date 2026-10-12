import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppointmentState } from "./appointment.state";

export const selectAppointmentState = createFeatureSelector<AppointmentState>("appointment");

export const selectAgeType = createSelector(selectAppointmentState, (state) => state.ageType);
export const selectRelationShipType = createSelector(
  selectAppointmentState,
  (state) => state.relations
);
export const selectMyAppointmentList = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);
export const selectCanceledAppointment = createSelector(
  selectAppointmentState,
  (state) => state.canceledAppoint
);
export const selectRescheduledAppointment = createSelector(
  selectAppointmentState,
  (state) => state.rescheduledAppointment
);
export const selectCreateAppointmentRes = createSelector(
  selectAppointmentState,
  (state) => state.appointment
);
export const selectAppointmentListByAssociateID = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);
export const selectDashboardSummary = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);

export const selectDashboardDataSummeryForReceptionist = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);

export const selectDashboardDataSummeryForDoctor = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);

export const selectAppointmentListForReceptionist = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);
export const selectPatientCheckInListForReceptionist = createSelector(
  selectAppointmentState,
  (state) => state.Appointments
);
export const selectAppointmentStatusList = createSelector(
  selectAppointmentState,
  (state) => state.statusList
);

export const selectCheckInSearchState = createSelector(
  selectAppointmentState,
  (state) => state.checkInSearch
);
export const selectFilteredCheckInAppointments = createSelector(
  selectPatientCheckInListForReceptionist,
  selectCheckInSearchState,
  (appointments, search) => {
    const patientName = (search?.fullName ?? "").trim().toLowerCase();
    const doctorName = (search?.doctorName ?? "").trim().toLowerCase();
    const dob = (search?.dateOfBirth ?? "").slice(0, 10);

    return (appointments ?? []).filter((appointment: any) => {
      const matchesName =
        !patientName || (appointment.patientName ?? "").toLowerCase().includes(patientName);

      const matchesDob = !dob || (appointment.dateOfBirth ?? "").slice(0, 10) === dob;

      const matchesDoctor =
        !doctorName || (appointment.doctorProfile?.name ?? "").toLowerCase().includes(doctorName);

      return matchesName && matchesDob && matchesDoctor;
    });
  }
);
