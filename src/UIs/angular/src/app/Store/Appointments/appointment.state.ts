import { AppointmentBooking } from "../../core/Models/Appointment-Model";
export interface CheckInSearch {
  fullName: string;
  dateOfBirth: string;
  doctorName: string;
}

export interface AppointmentState {
  appointment: AppointmentBooking | null;
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
  statusList: any;
  checkInAppointments: any[];
  checkInSearch: CheckInSearch;
}

export const initialAppointmentState: AppointmentState = {
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
  statusList: null,
  checkInAppointments: [],
  checkInSearch: {
    fullName: "",
    dateOfBirth: "",
    doctorName: "",
  },
};
