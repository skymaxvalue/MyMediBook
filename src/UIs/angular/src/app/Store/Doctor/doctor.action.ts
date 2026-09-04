import { createAction, props } from '@ngrx/store';
import { AssociateRequest, UpdateAssociateScheduleRequest } from 'src/app/core/Models/Association-model';

export const loadDoctorSpecialities = createAction(
    '[Doctor Speciality] Load'
);

export const loadDoctorSpecialitiesSuccess = createAction(
    '[Doctor Speciality] Load Success',
    props<{ doctorList: any[] }>()
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

export const registerAssociotion = createAction(
    'Register Assocition',
    props<{ associate: any }>()
);

export const registerAssociotionSuccess = createAction(
    'Register Assocition Success',
    props<{ associate: any }>()
);

export const registerAssociotionFailure = createAction(
    'Register Assocition Failure',
    props<{ error: any }>()
);

export const getRoleDepaSpecia = createAction(
    'Get RoleDepaSpecia',


);

export const getRoleDepaSpeciaSuccess = createAction(
    'Get RoleDepaSpecia Success',
    props<{ allRoleDepartSpeci: any }>()
);

export const getRoleDepaSpeciaFailure = createAction(
    'Get RoleDepaSpecia Failure',
    props<{ error: any }>()
);
export const getWeekDays = createAction(
    'Get WeekDays',

);

export const getWeekDaysSuccess = createAction(
    'Get WeekDays Success',
    props<{ weeakDays: any }>()
);

export const getWeekDaysFailure = createAction(
    'Get WeekDays Failure',
    props<{ error: any }>()
);

export const getAllAssociates = createAction(
    'Get Associates',

);

export const getAllAssociatesSuccess = createAction(
    'Get Associates Success',
    props<{ allAssociates: any }>()
);

export const getAllAssociatesFailure = createAction(
    'Get Associates Failure',
    props<{ error: any }>()
);

export const getAssociatesByID = createAction(
    'Get Associates By ID',
    props<{ associateId: any }>()

);

export const getAssociatesByIDSuccess = createAction(
    'Get Associates By ID Success',
    props<{ accociateDetails: any }>()
);

export const getAssociatesByIDFailure = createAction(
    'Get Associates By ID Failure',
    props<{ error: any }>()
);
export const createAssociatesSchedule = createAction(
    'Create Associates Schedule',
    props<{ associate: any }>()

);

export const createAssociatesScheduleSuccess = createAction(
    'Create Associates Schedule Success',
    props<{ associateSchedule: any }>()
);

export const createAssociatesScheduleFailure = createAction(
    'Create Associates Schedule Failure',
    props<{ error: any }>()
);
export const getTimeSloteByDoctorID = createAction(
    'Create Time Slote Schedule',
    props<{ payload: any }>()

);

export const getTimeSloteByDoctorIDSuccess = createAction(
    'Create Time Slot Success',
    props<{ doctorTimeSlot: any }>()
);

export const getTimeSloteByDoctorIDFailure = createAction(
    'Create Time Schedule Failure',
    props<{ error: any }>()
);
export const updateAssociatesAndItsSchedule = createAction(
    'Update Associates Schedule',
    props<{ associate: any }>()

);

export const updateAssociatesAndItsScheduleSuccess = createAction(
    'Update Associates Schedule Success',
    props<{ updatedAssociate: any }>()
);

export const updateAssociatesAndItsScheduleFailure = createAction(
    'Update Associates Schedule Failure',
    props<{ error: any }>()
);
export const deleteAssociatesAndItsSchedule = createAction(
    'Delete Associates Schedule',
    props<{ associate: {} }>()

);

export const deleteAssociatesAndItsScheduleSuccess = createAction(
    'Delete Associates Schedule Success',
    props<{ associate: any }>()
);

export const deleteAssociatesAndItsScheduleFailure = createAction(
    'Delete Associates Schedule Failure',
    props<{ error: any }>()
);