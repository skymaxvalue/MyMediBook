import { createAction, props } from '@ngrx/store';
import { AppointmentBooking } from '../../core/Models/Appointment-Model';

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
export const getAgeType = createAction(
    '[AgeType] get age type',

);

export const getAgeTypeSuccess = createAction(
    '[AgeType] get age type Success',
    props<{ ageType: any }>()
);

export const getAgeTypeFailure = createAction(
    '[AgeType] get age type Failure',
    props<{ error: string }>()
);

export const getRelationType = createAction(
    '[Relation] get Relation type',

);

export const getRelationTypeSuccess = createAction(
    '[Relation] get Relation type Success',
    props<{ Relations: any }>()
);

export const getRelationTypeFailure = createAction(
    '[Relation] get Relation type Failure',
    props<{ error: string }>()
);

export const getMyAppointments = createAction(
    '[Appointments] get ',
    props<{ patientId: number }>()

);

export const getMyAppointmentsSuccess = createAction(
    '[Appointments] get  Success',
    props<{ Appointments: any }>()
);

export const getMyAppointmentsFailure = createAction(
    '[Appointments ] get  Failure',
    props<{ error: string }>()
);
export const cancelMyAppointment = createAction(
    '[Appointments Cancel] delete ',
    props<{ appointmentId: number, patientId: number, cancelReason: string, lastUpdatedBy: string, associateRole: string }>()

);

export const cancelMyAppointmentSuccess = createAction(
    '[Appointments Cancel] delete  Success',
    props<{ canceledAppoint: any }>()
);

export const cancelMyAppointmentFailure = createAction(
    '[Appointments Cancel] delete  Failure',
    props<{ error: string }>()
);
export const rescheduleMyAppointment = createAction(
    '[Appointments reschedule] put ',
    props<{ appointmentId: number, patientId: number, associateId: number, slotId: number, visitPurpose: any, visitType: any, associateRole?: string, rescheduleReason?: string, lastUpdatedBy?: string }>()

);

export const rescheduleMyAppointmentSuccess = createAction(
    '[Appointments reschedule] put  Success',
    props<{ rescheduledAppointment: any }>()
);

export const rescheduleMyAppointmentFailure = createAction(
    '[Appointments reschedule] put  Failure',
    props<{ error: string }>()
);
export const getAppointmentListByAssociateId = createAction(
    '[Appointments by associate list] get ',
    props<{ associateId: number }>()

);

export const getAppointmentListByAssociateIdSuccess = createAction(
    '[Appointments by associate list] get  Success',
    props<{ Appointments: any }>()
);

export const getAppointmentListByAssociateIdFailure = createAction(
    '[Appointments by associate list] get  Failure',
    props<{ error: string }>()
);
export const getDashboardData = createAction(
    '[Dashboard Data] get ',
    props<{ associateId: number, fromDate: string, toDate: string }>()

);

export const getDashboardDataSuccess = createAction(
    '[Dashboard Data] get  Success',
    props<{ Appointments: any }>()
);

export const getDashboardDataFailure = createAction(
    '[Dashboard Data] get  Failure',
    props<{ error: string }>()
);
export const getDashboardDataByReceptionist = createAction(
    '[Dashboard Receptionist Data] get ',
    props<{ associateId: number, fromDate: string, toDate: string }>()

);

export const getDashboardDataByReceptionistSuccess = createAction(
    '[Dashboard Receptionist Data] get  Success',
    props<{ Appointments: any }>()
);

export const getDashboardDataByReceptionistFailure = createAction(
    '[Dashboard Receptionist Data] get  Failure',
    props<{ error: string }>()
);
export const getDashboardDataByDoctor = createAction(
    '[Dashboard Doctor Data] get ',
    props<{ associateId: number, fromDate: string, toDate: string }>()

);

export const getDashboardDataByDoctorSuccess = createAction(
    '[Dashboard Doctor Data] get  Success',
    props<{ Appointments: any }>()
);

export const getDashboardDataByDoctorFailure = createAction(
    '[Dashboard Doctor Data] get  Failure',
    props<{ error: string }>()
);