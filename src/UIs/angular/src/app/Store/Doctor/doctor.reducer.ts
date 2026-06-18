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
        DoctorSpecialityActions.loadAllDepartmentsFailure,
        (state, { error }) => ({
            ...state,
            error,
            isLoading: false
        })
    )
);