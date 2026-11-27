import { Claim, ClaimsSummaryResponse, ClaimsTrendResponse, Patient } from "src/app/core/Models/claims/claims.interface";


export const CLAIMS_SUMMARY_DATA: ClaimsSummaryResponse = {
    total: 5,
    byStatus: {
        Approved: 2,
        Pending: 1,
        Denied: 1,
        'Needs Action': 1
    },
    topPayers: [
        { payer: 'Blue Cross', count: 2 },
        { payer: 'Aetna', count: 2 },
        { payer: 'United Healthcare', count: 1 }
    ]
};
export const CLAIMS_DATA: Claim[] = [
    {
        id: 'CLM-2026-001',
        patientName: 'Rajesh Sharma',
        patientId: 'PT-1001',
        payer: 'Blue Cross',
        claimDate: '2026-10-06',
        amount: 12500,
        status: 'Approved',
        submitedDate: '2026-10-07',
        lastUpdatedDate: '2026-10-08',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-002',
        patientName: 'Priya Patel',
        patientId: 'PT-1002',
        payer: 'United Healthcare',
        claimDate: '2026-10-05',
        amount: 8500,
        status: 'Pending',
        submitedDate: '2026-10-06',
        lastUpdatedDate: '2026-10-07',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-003',
        patientName: 'Amit Deshmukh',
        patientId: 'PT-1003',
        payer: 'Aetna',
        claimDate: '2026-10-04',
        amount: 15000,
        status: 'Denied',
        submitedDate: '2026-10-05',
        lastUpdatedDate: '2026-10-06',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-004',
        patientName: 'Sneha Kulkarni',
        patientId: 'PT-1004',
        payer: 'Cigna',
        claimDate: '2026-10-03',
        amount: 6200,
        status: 'Needs Action',
        submitedDate: '2026-10-04',
        lastUpdatedDate: '2026-10-05',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-005',
        patientName: 'Rahul Patil',
        patientId: 'PT-1005',
        payer: 'Blue Cross',
        claimDate: '2026-10-02',
        amount: 9800,
        status: 'Approved',
        submitedDate: '2026-10-03',
        lastUpdatedDate: '2026-10-04',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-006',
        patientName: 'Neha Joshi',
        patientId: 'PT-1006',
        payer: 'Aetna',
        claimDate: '2026-10-01',
        amount: 11200,
        status: 'Pending',
        submitedDate: '2026-10-02',
        lastUpdatedDate: '2026-10-03',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-007',
        patientName: 'Karan Mehta',
        patientId: 'PT-1007',
        payer: 'Cigna',
        claimDate: '2026-09-29',
        amount: 7400,
        status: 'Denied',
        submitedDate: '2026-09-30',
        lastUpdatedDate: '2026-10-01',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-008',
        patientName: 'Pooja Shah',
        patientId: 'PT-1008',
        payer: 'United Healthcare',
        claimDate: '2026-09-28',
        amount: 13200,
        status: 'Needs Action',
        submitedDate: '2026-09-29',
        lastUpdatedDate: '2026-09-30',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-009',
        patientName: 'Arjun Singh',
        patientId: 'PT-1009',
        payer: 'Blue Cross',
        claimDate: '2026-09-27',
        amount: 5600,
        status: 'Approved',
        submitedDate: '2026-09-28',
        lastUpdatedDate: '2026-09-29',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    },
    {
        id: 'CLM-2026-010',
        patientName: 'Meera Nair',
        patientId: 'PT-1010',
        payer: 'Aetna',
        claimDate: '2026-09-26',
        amount: 9200,
        status: 'Pending',
        submitedDate: '2026-09-27',
        lastUpdatedDate: '2026-09-28',
        notes: [
            {
                text: "Created by claim department",
                date: "2026-10-08"
            },
            {
                text: "Appove by claim department",
                date: "2026-10-20"
            }
        ]
    }
];
export const CLAIMS_TREND_DATA: ClaimsTrendResponse = {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    series: {
        Approved: [12, 18, 22, 28, 35, 42],
        Pending: [8, 12, 10, 15, 18, 20],
        Denied: [5, 7, 6, 9, 8, 11],
        'Needs Action': [3, 5, 8, 6, 10, 7]
    }
};

export const PATIENTS: Patient[] = [
    {
        patientId: 'HH24567',
        patientName: 'Rajesh Sharma',
        mobileNo: '9876543210',
        visits: [
            {
                visitId: 101,
                visitDate: '2026-11-20',
                appointmentType: 'Consultation',
                status: 'Completed'
            },
            {
                visitId: 102,
                visitDate: '2026-11-15',
                appointmentType: 'Follow-up',
                status: 'Completed'
            },
            {
                visitId: 103,
                visitDate: '2026-11-05',
                appointmentType: 'Consultation',
                status: 'Completed'
            }
        ]
    },
    {
        patientId: 'HH24568',
        patientName: 'Priya Patel',
        mobileNo: '9876543211',
        visits: [
            {
                visitId: 104,
                visitDate: '2026-11-22',
                appointmentType: 'Consultation',
                status: 'Completed'
            },
            {
                visitId: 105,
                visitDate: '2026-11-12',
                appointmentType: 'Follow-up',
                status: 'Completed'
            }
        ]
    },
    {
        patientId: 'HH24569',
        patientName: 'Amit Deshmukh',
        mobileNo: '9876543212',
        visits: [
            {
                visitId: 106,
                visitDate: '2026-11-18',
                appointmentType: 'Lab Visit',
                status: 'Completed'
            },
            {
                visitId: 107,
                visitDate: '2026-11-10',
                appointmentType: 'Consultation',
                status: 'Completed'
            }
        ]
    },
    {
        patientId: 'HH24570',
        patientName: 'Sneha Kulkarni',
        mobileNo: '9876543213',
        visits: [
            {
                visitId: 108,
                visitDate: '2026-11-21',
                appointmentType: 'Consultation',
                status: 'Completed'
            }
        ]
    }
];