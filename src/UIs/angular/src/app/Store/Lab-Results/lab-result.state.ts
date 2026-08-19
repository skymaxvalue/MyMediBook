import { LabResultModel } from 'src/app/core/Models/lab-result.model';

export interface labResultState {
    LabResult: LabResultModel;
    isLoading: boolean;
    error: string | null;
    relations: any[];
    LabResultList: any[];

}

export const initialLabResultState: labResultState = {
    LabResult: {} as LabResultModel,
    isLoading: false,
    error: null,
    relations: [],
    LabResultList: [],

};