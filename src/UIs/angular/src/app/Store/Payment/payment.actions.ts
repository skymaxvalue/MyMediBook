import { createAction, props } from '@ngrx/store';
import { ISearchPatientRequestModel, ISearchPatientResponseModel } from 'src/app/core/Models/common/search-patient.model';

// Search Patients
export const searchPatients = createAction(
    '[Payment] Search Patients',
    props<{ payload: ISearchPatientRequestModel }>()
);

// Search Patients Success
export const searchPatientsSuccess = createAction(
    '[Payment] Search Patients Success',
    props<{ patients: ISearchPatientResponseModel[] }>()
);

// Search Patients Failure
export const searchPatientsFailure = createAction(
    '[Payment] Search Patients Failure',
    props<{ error: any }>()
);

export const getPaymentListByPatientId = createAction(
    '[Payment] Get Payment List By Patient Id',
    props<{ patientId: string }>()
);

export const getPaymentListByPatientIdSuccess = createAction(
    '[Payment] Get Payment List By Patient Id Success',
    props<{ paymentList: any[] }>()
);

export const getPaymentListByPatientIdFailure = createAction(
    '[Payment] Get Payment List By Patient Id Failure',
    props<{ error: any }>()
);