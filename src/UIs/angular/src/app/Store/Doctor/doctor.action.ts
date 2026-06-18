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
export const loadAllSpecialities = createAction(
    '[All Speciality] Load'
);

export const loadAllSpecialitiesSuccess = createAction(
    '[All Speciality] Load Success',
    props<{ allSpeciality: any[] }>()
);

export const loadAllSpecialitiesFailure = createAction(
    '[All Speciality] Load Failure',
    props<{ error: any }>()
);

export const loadAllDepartments = createAction(
    '[All Departments] Load'
);

export const loadAllDepartmentsSuccess = createAction(
    '[All Departments] Load Success',
    props<{ allDepartments: any[] }>()
);

export const loadAllDepartmentsFailure = createAction(
    '[All Departments] Load Failure',
    props<{ error: any }>()
);

export const loadAllRoles = createAction(
    '[All Roles] Load'
);

export const loadAllRolesSuccess = createAction(
    '[All Roles] Load Success',
    props<{ allRoles: any[] }>()
);

export const loadAllRolesFailure = createAction(
    '[All Roles] Load Failure',
    props<{ error: any }>()
);