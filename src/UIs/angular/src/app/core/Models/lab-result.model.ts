export type LabStatus = 'Normal' | 'Critical' | 'Pending';

export interface LabResultModel {
    resultId: number;
    profileId: number;
    patientId: number;
    patientName: string;

    testName: string;
    testCode: string;

    labName: string | null;

    reportDate: string;
    resultValue: string;
    referenceRange: string;

    resultStatus: string;
    notes: string | null;

    isSuccess: number;
    status: number;
    responseMessage: string
}