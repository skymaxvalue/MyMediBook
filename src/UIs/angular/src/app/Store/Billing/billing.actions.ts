import { createAction, props } from '@ngrx/store';
import { LabResultModel } from 'src/app/core/Models/lab-result.model';


export const getMyAllBills = createAction(
    '[bills] get ',
    props<{ patientId: number }>()

);

export const getMyAllBillsSuccess = createAction(
    '[bills] get  Success',
    props<{ myBillList: any }>()
);

export const getMyAllBillsFailure = createAction(
    '[bills ] get  Failure',
    props<{ error: string }>()
);
