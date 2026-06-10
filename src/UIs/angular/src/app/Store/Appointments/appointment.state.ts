import { AppointmentBooking } from '../../Models/Appointment-Model';

export interface AppointmentState {
    appointment: AppointmentBooking | null;
    isLoading: boolean;
    error: string | null;
}

export const initialAppointmentState: AppointmentState = {
    appointment: null,
    isLoading: false,
    error: null
};