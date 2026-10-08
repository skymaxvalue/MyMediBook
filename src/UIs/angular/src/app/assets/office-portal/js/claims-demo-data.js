(function (g) {
    let seed = 20260907;

    const rnd = () => (
        seed = (seed * 1664525 + 1013904223) % 4294967296
    ) / 4294967296;

    const pick = array =>
        array[Math.floor(rnd() * array.length)];

    const iso = milliseconds =>
        new Date(milliseconds).toISOString().slice(0, 10);

    const add = (date, days) =>
        iso(Date.parse(date) + days * 864e5);

    const first = [
        'Alex',
        'Maria',
        'Robert',
        'Emily',
        'James',
        'Sophia',
        'Daniel',
        'Olivia',
        'Ravi',
        'Priya',
        'Liam',
        'Chen',
        'Fatima',
        'Noah',
        'Ana',
        'Omar',
        'Grace',
        'Kenji'
    ];

    const last = [
        'Johnson',
        'Garcia',
        'Kim',
        'Davis',
        'Wilson',
        'Martinez',
        'Lee',
        'Brown',
        'Patel',
        'Singh',
        'Nguyen',
        'Okafor',
        'Silva',
        'Haddad'
    ];

    const payers = [
        'HealthSure Insurance',
        'MediCare Plus',
        'Prime Health',
        'City Medical Plan',
        'Downtown Health',
        'Westside Assurance'
    ];

    const denial = [
        [
            'CO-50',
            'Service not deemed medically necessary'
        ],
        [
            'CO-97',
            'Benefit included in another service'
        ],
        [
            'CO-16',
            'Claim lacks required information'
        ],
        [
            'PR-27',
            'Coverage terminated before service date'
        ]
    ];

    const actions = [
        'Prior authorization missing',
        'Eligibility verification required',
        'Supporting documentation requested',
        'Coding correction needed'
    ];

    const start = Date.UTC(2026, 2, 1);
    const end = Date.UTC(2026, 9, 5);
    const cap = '2026-10-06';

    const r2 = number =>
        Math.round(number * 100) / 100;

    const rows = [];

    for (let i = 0; i < 72; i++) {
        const serviceDate = iso(
            start + rnd() * (end - start)
        );

        const submittedDate = add(
            serviceDate,
            Math.floor(rnd() * 3)
        );

        const x = rnd();

        const status =
            x < 0.38
                ? 'Approved'
                : x < 0.62
                    ? 'Pending'
                    : x < 0.78
                        ? 'Denied'
                        : 'Needs Action';

        let lastUpdated = add(
            submittedDate,
            Math.floor(rnd() * 6)
        );

        if (lastUpdated > cap) {
            lastUpdated = cap;
        }

        rows.push({
            serviceDate,
            submittedDate,
            lastUpdated,
            status
        });
    }

    rows.sort((a, b) =>
        a.serviceDate.localeCompare(b.serviceDate)
    );

    g.CLAIMS_DEMO_DATA = rows.map((row, index) => {
        const amount = r2(
            60 + rnd() * 540
        );

        const claim = {
            id: `CLM-2026-${String(index + 1).padStart(5, '0')}`,
            patientName: `${pick(first)} ${pick(last)}`,
            patientId: `HH${24100 + index}`,
            payer: pick(payers),
            policyId: `POL-${700000 + Math.floor(rnd() * 99999)}`,
            serviceDate: row.serviceDate,
            submittedDate: row.submittedDate,
            lastUpdated: row.lastUpdated,
            amount,
            status: row.status,
            notes: [
                {
                    date: row.submittedDate,
                    text: 'Claim submitted to payer'
                }
            ]
        };

        if (row.status === 'Approved') {
            claim.approvedAmount = r2(
                amount * (0.8 + rnd() * 0.2)
            );

            claim.paidAmount =
                rnd() < 0.6
                    ? claim.approvedAmount
                    : r2(claim.approvedAmount * 0.5);
        }

        if (row.status === 'Denied') {
            const denialReason = pick(denial);

            claim.denialCode = denialReason[0];
            claim.denialReason = denialReason[1];
        }

        if (row.status === 'Needs Action') {
            claim.actionRequired = pick(actions);
        }

        if (row.lastUpdated !== row.submittedDate) {
            claim.notes.push({
                date: row.lastUpdated,
                text: `Status updated to ${row.status}`
            });
        }

        return claim;
    });
})(window);