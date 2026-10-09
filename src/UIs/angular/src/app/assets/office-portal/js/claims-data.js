(function (g) {
    'use strict';

    const STORAGE_KEY = 'healthHavenClaimsDemoV1';

    const C = {
        locale: 'en-IN',
        currency: 'INR',
        endpoint: null,

        statuses: [
            'Approved',
            'Pending',
            'Denied',
            'Needs Action'
        ],

        attentionStatuses: [
            'Denied',
            'Needs Action'
        ],

        trendStatuses: [
            'Approved',
            'Pending',
            'Denied'
        ],

        routes: {
            dashboard: 'claims-dashboard.html',
            claims: 'claims-dashboard.html',
            list: 'claims-list.html',
            details: 'claim-details.html',
            newClaim: 'new-claim.html'
        }
    };

    const clone = value => JSON.parse(JSON.stringify(value));

    const today = () => new Date().toISOString().slice(0, 10);

    function readCreated() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];

            return Array.isArray(parsed) ? parsed : [];
        } catch (_) {
            return [];
        }
    }

    function writeCreated(rows) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(rows)
            );
        } catch (_) {}
    }

    function allRows() {
        const base = Array.isArray(g.CLAIMS_DEMO_DATA)
            ? clone(g.CLAIMS_DEMO_DATA)
            : [];

        const created = readCreated();
        const map = new Map(base.map(row => [row.id, row]));

        created.forEach(row => {
            map.set(row.id, row);
        });

        return [...map.values()];
    }

    function matches(row, filters) {
        const search = String(filters.search || '')
            .trim()
            .toLowerCase();

        if (search) {
            const haystack = [
                row.id,
                row.patientName,
                row.patientId,
                row.payer,
                row.policyId
            ]
                .join(' ')
                .toLowerCase();

            if (!haystack.includes(search)) {
                return false;
            }
        }

        const statuses = Array.isArray(filters.statuses)
            ? filters.statuses
            : [];

        if (
            statuses.length &&
            !statuses.includes(row.status)
        ) {
            return false;
        }

        if (
            filters.payer &&
            row.payer !== filters.payer
        ) {
            return false;
        }

        if (
            filters.from &&
            row.serviceDate < filters.from
        ) {
            return false;
        }

        if (
            filters.to &&
            row.serviceDate > filters.to
        ) {
            return false;
        }

        return true;
    }

    function sortRows(rows, key, direction) {
        const multiplier = direction === 'asc' ? 1 : -1;

        const value = row => {
            if (key === 'amount') {
                return Number(row.amount) || 0;
            }

            if (
                key === 'patientName' ||
                key === 'payer' ||
                key === 'id' ||
                key === 'status'
            ) {
                return String(row[key] || '').toLowerCase();
            }

            return String(row[key] || '');
        };

        return rows.sort((a, b) => {
            const aValue = value(a);
            const bValue = value(b);

            if (aValue < bValue) {
                return -1 * multiplier;
            }

            if (aValue > bValue) {
                return 1 * multiplier;
            }

            return 0;
        });
    }

    function summary(filters) {
        const rows = allRows().filter(row =>
            matches(row, filters || {})
        );

        const byStatus = Object.fromEntries(
            C.statuses.map(status => [status, 0])
        );

        const byPayer = new Map();

        rows.forEach(row => {
            byStatus[row.status] =
                (byStatus[row.status] || 0) + 1;

            byPayer.set(
                row.payer,
                (byPayer.get(row.payer) || 0) + 1
            );
        });

        const topPayers = [...byPayer.entries()]
            .map(([payer, count]) => ({
                payer,
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return Promise.resolve({
            total: rows.length,
            byStatus,
            topPayers
        });
    }

    function list(filters) {
        const f = filters || {};

        let rows = allRows().filter(row =>
            matches(row, f)
        );

        sortRows(
            rows,
            f.sort || 'lastUpdated',
            f.dir || 'desc'
        );

        const pageSize = Math.max(
            1,
            Number(f.pageSize) || 10
        );

        const pages = Math.max(
            1,
            Math.ceil(rows.length / pageSize)
        );

        const page = Math.min(
            Math.max(1, Number(f.page) || 1),
            pages
        );

        const start = (page - 1) * pageSize;

        return Promise.resolve({
            items: rows.slice(
                start,
                start + pageSize
            ),
            total: rows.length,
            page,
            pages,
            pageSize
        });
    }

    function get(id) {
        return Promise.resolve(
            allRows().find(row => row.id === id) || null
        );
    }

    function payers() {
        return Promise.resolve(
            [
                ...new Set(
                    allRows()
                        .map(row => row.payer)
                        .filter(Boolean)
                )
            ].sort()
        );
    }

    function trend(options) {
        const months = Math.max(
            1,
            Math.min(
                12,
                Number(options?.months) || 6
            )
        );

        const now = new Date();
        const labels = [];
        const buckets = [];

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            labels.push(
                date.toLocaleDateString(
                    C.locale,
                    { month: 'short' }
                )
            );

            buckets.push({
                y: date.getFullYear(),
                m: date.getMonth()
            });
        }

        const rows = allRows().filter(row =>
            matches(row, {
                search: options?.search,
                payer: options?.payer
            })
        );

        const series = Object.fromEntries(
            C.trendStatuses.map(status => [
                status,
                buckets.map(() => 0)
            ])
        );

        rows.forEach(row => {
            const date = new Date(
                row.serviceDate + 'T00:00:00'
            );

            const index = buckets.findIndex(
                bucket =>
                    bucket.y === date.getFullYear() &&
                    bucket.m === date.getMonth()
            );

            if (
                index >= 0 &&
                series[row.status]
            ) {
                series[row.status][index]++;
            }
        });

        return Promise.resolve({
            labels,
            series
        });
    }

    function nextId() {
        const max = allRows().reduce(
            (highest, row) => {
                const match = String(row.id)
                    .match(/(\d+)$/);

                return Math.max(
                    highest,
                    match ? Number(match[1]) : 0
                );
            },
            0
        );

        return `CLM-${new Date().getFullYear()}-${String(
            max + 1
        ).padStart(5, '0')}`;
    }

    function create(input) {
        const amount = Number(input.amount);

        const row = {
            id: nextId(),
            patientName: String(
                input.patientName || ''
            ).trim(),
            patientId: String(
                input.patientId || ''
            ).trim(),
            payer: String(
                input.payer || ''
            ).trim(),
            policyId: String(
                input.policyId || ''
            ).trim(),
            serviceDate: input.serviceDate,
            submittedDate: today(),
            lastUpdated: today(),
            amount: Math.round(amount * 100) / 100,
            status: 'Pending',
            notes: [
                {
                    date: today(),
                    text: 'Claim created in frontend demo mode.'
                }
            ]
        };

        const created = readCreated();

        created.push(row);
        writeCreated(created);

        return Promise.resolve(clone(row));
    }

    g.ClaimsService = {
        CONFIG: C,
        STATUSES: C.statuses,
        TREND_STATUSES: C.trendStatuses,
        isDemo: () => true,
        list,
        get,
        summary,
        payers,
        trend,
        create
    };
})(window);