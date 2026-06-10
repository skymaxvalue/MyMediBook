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
    )
);