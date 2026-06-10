import { createAction, props } from '@ngrx/store';

export const loadDoctorSpecialities = createAction(
    '[Doctor Speciality] Load'
);

export const loadDoctorSpecialitiesSuccess = createAction(
    '[Doctor Speciality] Load Success',
    props<{ specialities: any[] }>()
);

export const loadDoctorSpecialitiesFailure = createAction(
    '[Doctor Speciality] Load Failure',
    props<{ error: any }>()
);