export type LabStatus = 'Normal' | 'Critical' | 'Pending';

export interface LabResult {
    id: number;
    patient: string;
    test: string;
    code: string;
    date: string;
    result: string;
    range: string;
    status: LabStatus;
    lab: string;
    image: string;
}