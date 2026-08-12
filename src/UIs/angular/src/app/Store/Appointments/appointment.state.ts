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
}

export const initialAppointmentState: AppointmentState = {
    appointment: null,
    isLoading: false,
    error: null,
    ageType: [],
    relations: [],
    Appointments: [],
    canceledAppoint: null,
    rescheduledAppointment: null
};