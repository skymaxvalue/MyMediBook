import { createReducer, on } from '@ngrx/store';
import * as DoctorSpecialityActions from './doctor.action';
import {
    DoctorSpecialityState,
    initialState
} from './doctor.state';

export const doctorSpecialityReducer = createReducer(
    initialState,

    on(
        DoctorSpecialityActions.loadDoctorSpecialities,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.loadDoctorSpecialitiesSuccess,
        (state, { specialities }) => ({
            ...state,
            specialities,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.loadDoctorSpecialitiesFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    ),
    on(
        DoctorSpecialityActions.loadAllSpecialities,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.loadAllSpecialitiesSuccess,
        (state, { allSpeciality }) => ({
            ...state,
            allSpeciality,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.loadAllSpecialitiesFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    ),
    on(
        DoctorSpecialityActions.loadAllDepartments,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.loadAllDepartmentsSuccess,
        (state, { allDepartments }) => ({
            ...state,
            allDepartments,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.loadAllDepartmentsFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
    ,
    on(
        DoctorSpecialityActions.loadAllRoles,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.loadAllRolesSuccess,
        (state, { allRoles }) => ({
            ...state,
            allRoles,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.loadAllRolesFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.registerAssociotion,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.registerAssociotionSuccess,
        (state, { associate }) => ({
            ...state,
            registerassociate: associate,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.registerAssociotionFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    ),
    on(
        DoctorSpecialityActions.getRoleDepaSpecia,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.getRoleDepaSpeciaSuccess,
        (state, { allRoleDepartSpeci }) => ({
            ...state,
            allRoleDepartSpeci: allRoleDepartSpeci,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.getRoleDepaSpeciaFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.getWeekDays,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.getWeekDaysSuccess,
        (state, { weeakDays }) => ({
            ...state,
            weeakDays: weeakDays,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.getWeekDaysFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
    ,

    on(
        DoctorSpecialityActions.getAllAssociates,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.getAllAssociatesSuccess,
        (state, { allAssociates }) => ({
            ...state,
            allAssociates: allAssociates,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.getAllAssociatesFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
    ,

    on(
        DoctorSpecialityActions.createAssociatesSchedule,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.createAssociatesScheduleSuccess,
        (state, { associateSchedule }) => ({
            ...state,
            associateSchedule: associateSchedule,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.createAssociatesScheduleFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
    ,

    on(
        DoctorSpecialityActions.getTimeSloteByDoctorID,
        state => ({
            ...state,
            isLoading: true,
            error: null
        })
    ),

    on(
        DoctorSpecialityActions.getTimeSloteByDoctorIDSuccess,
        (state, { doctorTimeSlot }) => ({
            ...state,
            associateSchedule: doctorTimeSlot,
            isLoading: false
        })
    ),

    on(
        DoctorSpecialityActions.getTimeSloteByDoctorIDFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
);