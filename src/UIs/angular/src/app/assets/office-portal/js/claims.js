document.addEventListener('DOMContentLoaded', () => {


    const fromDate = document.querySelector('[data-from]');
const toDate = document.querySelector('[data-to]');

const today = new Date();
const todayString =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

if (fromDate) fromDate.max = todayString;
if (toDate) toDate.max = todayString;


    const S = ClaimsService;
    const U = ClaimsUI;
    const C = S.CONFIG;

    

    U.bindRoutes();

    const pct = (number, total) =>
        total
            ? Math.round((number / total) * 100)
            : 0;

    const COLORS = {
        Approved: '#1F9D55',
        Pending: '#E8A317',
        Denied: '#DC3545',
        'Needs Action': '#7C3AED'
    };

    const color = status =>
        COLORS[status] || '#6B7280';

    const $ = id =>
        document.getElementById(id);

    async function loadKpis() {
        const map = {
            kpiTotal: null,
            kpiPending: 'Pending',
            kpiApproved: 'Approved',
            kpiDenied: 'Denied',
            kpiAction: 'Needs Action'
        };

        try {
            const summary = await S.summary({});

            Object.entries(map).forEach(
                ([id, status]) => {
                    const number = status
                        ? summary.byStatus[status] || 0
                        : summary.total;

                    $(id).textContent =
                        number.toLocaleString(C.locale);

                    $(id + 'Sub').textContent =
                        status
                            ? summary.total
                                ? `${pct(number, summary.total)}% of all claims`
                                : ''
                            : 'All recorded claims';
                }
            );

            $('kpiError').hidden = true;
        } catch (error) {
            Object.keys(map).forEach(id => {
                $(id).textContent = '—';
                $(id + 'Sub').textContent = '';
            });

            $('kpiError').hidden = false;

            $('kpiErrorMsg').textContent =
                error.message ||
                'Claim totals could not be loaded.';
        }
    }

    $('kpiRetry').addEventListener(
        'click',
        loadKpis
    );

    function donut(byStatus, total) {
        const radius = 70;
        const circumference =
            2 * Math.PI * radius;

        let offset = 0;

        const parts = Object.entries(byStatus)
            .filter(([, number]) => number > 0);

        const arcs = parts
            .map(([status, number]) => {
                const length =
                    (number / total) *
                    circumference;

                const arc = `
                    <circle
                        cx="100"
                        cy="100"
                        r="${radius}"
                        fill="none"
                        stroke="${color(status)}"
                        stroke-width="26"
                        stroke-dasharray="${length} ${circumference - length}"
                        stroke-dashoffset="${-offset}"
                        transform="rotate(-90 100 100)"
                    >
                        <title>
                            ${U.esc(status)}: ${number}
                        </title>
                    </circle>
                `;

                offset += length;

                return arc;
            })
            .join('');

        return `
            <svg
                viewBox="0 0 200 200"
                role="img"
                aria-label="Claims by status, ${total} total"
            >
                <circle
                    cx="100"
                    cy="100"
                    r="${radius}"
                    fill="none"
                    stroke="#EEF2F7"
                    stroke-width="26"
                />

                ${arcs}

                <text
                    x="100"
                    y="98"
                    text-anchor="middle"
                    class="cl-donut__num"
                >
                    ${total.toLocaleString(C.locale)}
                </text>

                <text
                    x="100"
                    y="118"
                    text-anchor="middle"
                    class="cl-donut__lbl"
                >
                    Total Claims
                </text>
            </svg>
        `;
    }

    async function loadBreakdown(filters, filtered) {
        const body = $('statusBody');
        const payerBody = $('payerBody');

        $('scopeNote').textContent =
            filtered
                ? 'Reflects the current search, payer and date filters.'
                : '';

        try {
            const summary =
                await S.summary(filters);

            const entries =
                Object.entries(summary.byStatus);

            if (!summary.total) {
                body.innerHTML =
                    '<p class="chart-empty">No claims to chart.</p>';

                payerBody.innerHTML =
                    '<p class="chart-empty">No payer data available.</p>';

                return;
            }

            body.innerHTML = `
                <div class="cl-donut">
                    ${donut(
                        summary.byStatus,
                        summary.total
                    )}
                </div>

                <ul class="cl-legend-list">
                    ${entries
                        .map(
                            ([status, number]) => `
                                <li>
                                    <span
                                        class="cl-dot"
                                        style="background:${color(status)}"
                                    ></span>

                                    <span class="cl-payers__name">
                                        ${U.esc(status)}
                                    </span>

                                    <span class="cl-legend-list__val">
                                        ${number.toLocaleString(C.locale)}
                                        (${pct(number, summary.total)}%)
                                    </span>
                                </li>
                            `
                        )
                        .join('')}
                </ul>
            `;

            const max = Math.max(
                ...summary.topPayers.map(
                    payer => payer.count
                ),
                1
            );

            payerBody.innerHTML =
                summary.topPayers.length
                    ? `
                        <ol class="cl-payers">
                            ${summary.topPayers
                                .map(
                                    payer => `
                                        <li>
                                            <div class="cl-payers__row">
                                                <span>
                                                    ${U.esc(payer.payer)}
                                                </span>

                                                <strong>
                                                    ${payer.count.toLocaleString(C.locale)}
                                                </strong>
                                            </div>

                                            <div class="cl-bar">
                                                <span
                                                    style="width:${(payer.count / max) * 100}%"
                                                ></span>
                                            </div>
                                        </li>
                                    `
                                )
                                .join('')}
                        </ol>
                    `
                    : '<p class="chart-empty">No payer data available.</p>';
        } catch (error) {
            const message = `
                <p class="chart-empty error">
                    ${U.esc(
                        error.message ||
                        'Could not load chart data.'
                    )}
                </p>
            `;

            body.innerHTML = message;
            payerBody.innerHTML = message;
        }
    }

    const niceMax = value => {
        if (value <= 5) {
            return 5;
        }

        const power =
            Math.pow(
                10,
                Math.floor(
                    Math.log10(value)
                )
            );

        return Math.ceil(value / power) * power;
    };

    function lineChart(trend) {
        const W = 640;
        const H = 250;

        const margin = {
            left: 36,
            right: 14,
            top: 12,
            bottom: 28
        };

        const innerWidth =
            W -
            margin.left -
            margin.right;

        const innerHeight =
            H -
            margin.top -
            margin.bottom;

        const names =
            S.TREND_STATUSES.filter(
                name => trend.series[name]
            );

        const max = niceMax(
            Math.max(
                ...names.flatMap(
                    name => trend.series[name]
                ),
                0
            )
        );

        const count =
            trend.labels.length;

        const x = index =>
            margin.left +
            (
                count === 1
                    ? innerWidth / 2
                    : (index / (count - 1)) *
                      innerWidth
            );

        const y = value =>
            margin.top +
            innerHeight -
            (value / max) *
                innerHeight;

        const grid = [0, 1, 2, 3, 4]
            .map(index => {
                const value =
                    (max / 4) * index;

                return `
                    <line
                        x1="${margin.left}"
                        x2="${W - margin.right}"
                        y1="${y(value)}"
                        y2="${y(value)}"
                        stroke="#E6ECF5"
                    ></line>

                    <text
                        x="${margin.left - 6}"
                        y="${y(value) + 4}"
                        text-anchor="end"
                        class="cl-axis"
                    >
                        ${Math.round(value)}
                    </text>
                `;
            })
            .join('');

        const labels =
            trend.labels
                .map(
                    (label, index) => `
                        <text
                            x="${x(index)}"
                            y="${H - 8}"
                            text-anchor="middle"
                            class="cl-axis"
                        >
                            ${U.esc(label)}
                        </text>
                    `
                )
                .join('');

        const lines =
            names
                .map(name => {
                    const points =
                        trend.series[name]
                            .map(
                                (value, index) =>
                                    `${x(index)},${y(value)}`
                            )
                            .join(' ');

                    const circles =
                        trend.series[name]
                            .map(
                                (value, index) => `
                                    <circle
                                        cx="${x(index)}"
                                        cy="${y(value)}"
                                        r="3.6"
                                        fill="${color(name)}"
                                    >
                                        <title>
                                            ${U.esc(name)}
                                            –
                                            ${U.esc(trend.labels[index])}:
                                            ${value}
                                        </title>
                                    </circle>
                                `
                            )
                            .join('');

                    return `
                        <polyline
                            points="${points}"
                            fill="none"
                            stroke="${color(name)}"
                            stroke-width="2.2"
                        ></polyline>

                        ${circles}
                    `;
                })
                .join('');

        return `
            <svg
                viewBox="0 0 ${W} ${H}"
                role="img"
                aria-label="Claims submitted per month by status"
            >
                ${grid}
                ${labels}
                ${lines}
            </svg>

            <ul class="cl-legend-list">
                ${names
                    .map(
                        name => `
                            <li>
                                <span
                                    class="cl-dot"
                                    style="background:${color(name)}"
                                ></span>

                                ${U.esc(name)}
                            </li>
                        `
                    )
                    .join('')}
            </ul>
        `;
    }

    let trendFilters = {};

    async function loadTrend() {
        const body = $('trendBody');

        try {
            const trend =
                await S.trend({
                    months: Number(
                        $('trendRange').value
                    ),
                    search:
                        trendFilters.search,
                    payer:
                        trendFilters.payer
                });

            const hasData =
                S.TREND_STATUSES.some(
                    status =>
                        (
                            trend.series[status] ||
                            []
                        ).some(
                            value => value > 0
                        )
                );

            body.innerHTML =
                hasData
                    ? lineChart(trend)
                    : '<p class="chart-empty">No submitted claims in this period.</p>';
        } catch (error) {
            body.innerHTML = `
                <p class="chart-empty error">
                    ${U.esc(
                        error.message ||
                        'Could not load trend data.'
                    )}
                </p>
            `;
        }
    }

    $('trendRange').addEventListener(
        'change',
        loadTrend
    );

    U.createTable(
        $('attentionCard'),
        {
            pageSize: 8,
            defaultStatus: 'attention',
            attention: true,

            onChange: (
                filters,
                filtered
            ) => {
                trendFilters = filters;

                loadBreakdown(
                    filters,
                    filtered
                );

                loadTrend();
            }
        }
    );

    loadKpis();
});