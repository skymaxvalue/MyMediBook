import { LabResultModel } from 'src/app/core/Models/lab-result.model';

export interface billsState {
    profileBill: any;
    isLoading: boolean;
    error: string | null;
    myBillList: any[];

}

export const initialLabResultState: billsState = {
    profileBill: {} as any,
    isLoading: false,
    error: null,
    myBillList: [],

};