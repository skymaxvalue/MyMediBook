
export type ClaimStatus =
    | 'Approved'
    | 'Pending'
    | 'Denied'
    | 'Needs Action';

export interface Claim {
    id: string;
    patientName: string;
    patientId: string;
    payer: string;
    claimDate: string;
    amount: number;
    status: ClaimStatus;
    submitedDate: string;
    lastUpdatedDate: string;

    // Claim details
    serviceDate?: string;
    policyId?: string;
    approvedAmount?: number | null;
    paidAmount?: number | null;
    denialCode?: string;
    denialReason?: string;
    actionRequired?: string;
    notes?: ClaimNote[];
}

export interface ClaimNote {
    date: string;
    text: string;
}

// Dashboard summary
export interface ClaimsSummary {
    total: number;
    pending: number;
    approved: number;
    denied: number;
    needsAction: number;
}

// API summary response
export interface ClaimsSummaryResponse {
    total: number;
    byStatus: {
        [status: string]: number;
    };
    topPayers: {
        payer: string;
        count: number;
    }[];
}

// Line chart request
export interface ClaimsTrendRequest {
    months: number;
    search?: string;
    payer?: string;
}

// Line chart response
export interface ClaimsTrendResponse {
    labels: string[];
    series: {
        [status: string]: number[];
    };
}

export interface Patient {
    patientName: string;
    patientId: string;
    mobileNo: string;
    visits: PatientVisit[];
}

export interface PatientVisit {
    visitId: number;
    visitDate: string;
    appointmentType: string;
    status: string;
}
