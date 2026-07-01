import { AppointmentBooking } from '../../Models/Appointment-Model';

export interface AppointmentState {
    appointment: AppointmentBooking | null;
    ageType: any[];
    isLoading: boolean;
    error: string | null;
}

export const initialAppointmentState: AppointmentState = {
    appointment: null,
    isLoading: false,
    error: null,
    ageType: []
};