import { Action, createReducer, on } from "@ngrx/store";
import * as AppointmentActions from "./appointment.actions";
import { AppointmentDetailModel } from "../../core/Models/appointment/appointment-detail.model";
import { AppointmentRequestModel } from "../../core/Models/appointment/appointment.model";

export const APPOINTMENT_FEATURE_KEY = "appointment";

export interface CheckInSearch {
  fullName: string;
  dateOfBirth: string;
  doctorName: string;
}

export interface AppointmentState {
  appointment: AppointmentRequestModel | null;
  ageType: any[];
  isLoading: boolean;
  error: string | null;
  relations: any[];
  Appointments: any[];
  canceledAppoint: any;
  rescheduledAppointment: any;
  DashboardDataSummery: any;
  TodaysAppointments: any;
  Appointment_list: any[];
  checkInAppointments: any[];
  checkInSearch: CheckInSearch;
  selectedAppointmentId: number;
  selectedDoctorId: number;
  doctorAppointmentsQueue: AppointmentDetailModel[];
}

export const AppointmentState: AppointmentState = {
  appointment: null,
  isLoading: false,
  error: null,
  ageType: [],
  relations: [],
  Appointments: [],
  canceledAppoint: null,
  rescheduledAppointment: null,
  DashboardDataSummery: null,
  TodaysAppointments: [],
  Appointment_list: [],
  checkInAppointments: [],
  checkInSearch: {
    fullName: "",
    dateOfBirth: "",
    doctorName: "",
  },
  selectedAppointmentId: 0,
  selectedDoctorId: 0,
  doctorAppointmentsQueue: [],
};

export const reducer = createReducer(
  AppointmentState,

  on(AppointmentActions.createAppointment, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.createAppointmentSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    appointment: action.appointment,
  })),

  on(AppointmentActions.createAppointmentFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getAgeType, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getAgeTypeSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    ageType: action.ageType,
  })),

  on(AppointmentActions.getAgeTypeFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getRelationType, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getRelationTypeSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    relations: action.Relations,
  })),

  on(AppointmentActions.getRelationTypeFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getMyAppointments, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getMyAppointmentsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getMyAppointmentsFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.cancelMyAppointment, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.cancelMyAppointmentSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    canceledAppoint: action.canceledAppoint,
  })),

  on(AppointmentActions.cancelMyAppointmentFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.rescheduleMyAppointment, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.rescheduleMyAppointmentSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    rescheduledAppointment: action.rescheduledAppointment,
  })),

  on(AppointmentActions.rescheduleMyAppointmentFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getAppointmentListByAssociateId, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getAppointmentListByAssociateIdSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getAppointmentListByAssociateIdFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AppointmentActions.getDashboardSummary, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getDashboardSummarySuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getDashboardSummaryFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AppointmentActions.getFrontOfficeRecentPatientQueueList, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getFrontOfficeRecentPatientQueueListSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getFrontOfficeRecentPatientQueueListFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AppointmentActions.getDoctorRecentPatientList, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getDoctorRecentPatientListSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getDoctorRecentPatientListFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getAppointmentListByRiceptionist, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getAppointmentListByRiceptionistSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    Appointments: action.Appointments,
  })),

  on(AppointmentActions.getAppointmentListByRiceptionistFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AppointmentActions.getAppointmentCheckInListByRiceptionist, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.getAppointmentCheckInListByRiceptionistSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    checkInAppointments: action.Appointments,
  })),

  on(AppointmentActions.getAppointmentCheckInListByRiceptionistFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AppointmentActions.GetDoctorAppointmentQueueList, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AppointmentActions.GetDoctorAppointmentQueueListSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    doctorAppointmentsQueue: response,
  })),

  on(AppointmentActions.GetDoctorAppointmentQueueListFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: error,
  })),

  on(AppointmentActions.searchCheckInPatient, (state, { fullName, dateOfBirth }) => ({
    ...state,
    checkInSearch: {
      ...state.checkInSearch,
      fullName,
      dateOfBirth,
    },
  })),

  on(AppointmentActions.filterCheckInByDoctor, (state, { doctorName }) => ({
    ...state,
    checkInSearch: {
      ...state.checkInSearch,
      doctorName,
    },
  })),

  on(AppointmentActions.confirmPatientCheckIn, (state, { appointmentId }) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AppointmentActions.confirmPatientCheckInSuccess, (state, { response }) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
  on(AppointmentActions.confirmPatientCheckInFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(AppointmentActions.redirectToAppointmentCheckIns, (state, { doctorId }) => ({
    ...state,
    selectedDoctorId: doctorId,
    isLoading: false,
  }))
);

export function AppointmentReducer(state: AppointmentState | undefined, action: Action) {
  return reducer(state, action);
}
