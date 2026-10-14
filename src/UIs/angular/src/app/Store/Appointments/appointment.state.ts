import { AppointmentRequestModel } from "../../core/Models/appointment.model";
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
  statusList: any;
  checkInAppointments: any[];
  checkInSearch: CheckInSearch;
  selectedAppointmentId: number;
  selectedDoctorId: number;
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
  selectedAppointmentId: 0,
  selectedDoctorId: 0,
};
