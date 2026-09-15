import { AppointmentBooking } from '../../core/Models/Appointment-Model';

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
    statusList: any
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
    statusList: null
};