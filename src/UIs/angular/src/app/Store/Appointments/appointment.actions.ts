import { createAction, props } from '@ngrx/store';
import { AppointmentBooking } from '../../Models/Appointment-Model';

export const createAppointment = createAction(
    '[Appointment] Create Appointment',
    props<{ appointment: AppointmentBooking }>()
);

export const createAppointmentSuccess = createAction(
    '[Appointment] Create Appointment Success',
    props<{ appointment: any }>()
);

export const createAppointmentFailure = createAction(
    '[Appointment] Create Appointment Failure',
    props<{ error: string }>()
);