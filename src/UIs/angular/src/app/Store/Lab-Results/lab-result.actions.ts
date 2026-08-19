import { createAction, props } from '@ngrx/store';
import { LabResultModel } from 'src/app/core/Models/lab-result.model';


export const getMyLabResults = createAction(
    '[labresult] get ',
    props<{ patientId: number }>()

);

export const getMyLabResultsSuccess = createAction(
    '[LabResults] get  Success',
    props<{ LabResultList: any }>()
);

export const getMyLabResultsFailure = createAction(
    '[LabResults ] get  Failure',
    props<{ error: string }>()
);
