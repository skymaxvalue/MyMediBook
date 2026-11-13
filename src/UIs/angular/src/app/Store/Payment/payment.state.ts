import {
    ISearchPatientRequestModel,
    ISearchPatientResponseModel
} from 'src/app/core/Models/common/search-patient.model';

export interface PaymentState {
    patients: ISearchPatientResponseModel[];
    loading: boolean;
    error: string | null;
    searchRequest: ISearchPatientRequestModel | null;
}

export const initialPaymentState: PaymentState = {
    patients: [],
    loading: false,
    error: null,
    searchRequest: null
};