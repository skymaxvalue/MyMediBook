(function (g) {
    'use strict';

    const S = g.ClaimsService;
    const C = S.CONFIG;

    const esc = value =>
        String(value === null || value === undefined ? '' : value)
            .replace(
                /[&<>"']/g,
                char => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[char])
            );

    const dash = '—';

    function fmtDate(iso) {
        if (!iso) {
            return dash;
        }

        const parts = String(iso).split('-').map(Number);

        if (
            parts.length < 3 ||
            parts.some(isNaN)
        ) {
            return dash;
        }

        return new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        ).toLocaleDateString(
            C.locale,
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        );
    }

    const moneyFmt = new Intl.NumberFormat(
        C.locale,
        {
            style: 'currency',
            currency: C.currency
        }
    );

    const fmtMoney = value =>
        value === null || value === undefined
            ? dash
            : moneyFmt.format(value);

    const slug = value =>
        String(value)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');

    const debounce = (fn, ms) => {
        let timer;

        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(
                () => fn(...args),
                ms
            );
        };
    };

    const ICONS = {
        approved:
            '<path d="M5 12.5l4.5 4.5L19 7.5"/>',

        pending:
            '<circle cx="12" cy="12" r="8.5"/>' +
            '<path d="M12 7.5V12l3 2"/>',

        denied:
            '<path d="M6 6l12 12M18 6L6 18"/>',

        'needs-action':
            '<path d="M12 4l9 16H3z"/>' +
            '<path d="M12 10v4M12 17.2v.1"/>'
    };

    const icon = (key, size) => `
        <svg
            class="ico"
            width="${size || 12}"
            height="${size || 12}"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.4"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            ${ICONS[key] || '<circle cx="12" cy="12" r="4"/>'}
        </svg>
    `;

    const statusClass = status =>
        ({
            approved: 'cl-badge--approved',
            pending: 'cl-badge--pending',
            denied: 'cl-badge--denied',
            'needs-action': 'cl-badge--action'
        }[slug(status)] || 'cl-badge--other');

    const statusBadge = status => `
        <span class="cl-badge ${statusClass(status)}">
            ${icon(slug(status))}
            <span>${esc(status)}</span>
        </span>
    `;

    const detailsUrl = id =>
        `${C.routes.details}?id=${encodeURIComponent(id)}`;

    function bindRoutes(root) {
        (root || document)
            .querySelectorAll('[data-route]')
            .forEach(link => {
                if (C.routes[link.dataset.route]) {
                    link.setAttribute(
                        'href',
                        C.routes[link.dataset.route]
                    );
                }
            });

        const banner =
            document.querySelector('[data-demo-banner]');

        if (banner) {
            banner.hidden = !S.isDemo();
        }
    }

    function pageList(page, pages) {
        if (pages <= 7) {
            return Array.from(
                { length: pages },
                (_, index) => index + 1
            );
        }

        const set = new Set([
            1,
            pages,
            page - 1,
            page,
            page + 1
        ]);

        if (page <= 3) {
            [2, 3, 4].forEach(number =>
                set.add(number)
            );
        }

        if (page >= pages - 2) {
            [pages - 1, pages - 2, pages - 3]
                .forEach(number => set.add(number));
        }

        const numbers = [...set]
            .filter(
                number =>
                    number >= 1 &&
                    number <= pages
            )
            .sort((a, b) => a - b);

        const result = [];

        numbers.forEach((number, index) => {
            if (
                index &&
                number - numbers[index - 1] > 1
            ) {
                result.push('…');
            }

            result.push(number);
        });

        return result;
    }

    function renderPager(element, page, pages, go) {
        if (pages <= 1) {
            element.innerHTML = '';
            return;
        }

        const button = (
            label,
            number,
            extra,
            aria,
            disabled
        ) => `
            <button
                type="button"
                class="cl-pg ${extra || ''}"
                data-page="${number}"
                aria-label="${aria}"
                ${disabled ? 'disabled' : ''}
                ${extra === 'active'
                    ? 'aria-current="page"'
                    : ''}
            >
                ${label}
            </button>
        `;

        element.innerHTML =
            button(
                '‹',
                page - 1,
                '',
                'Previous page',
                page === 1
            ) +

            pageList(page, pages)
                .map(number =>
                    number === '…'
                        ? '<span class="page-gap" aria-hidden="true">…</span>'
                        : button(
                            number,
                            number,
                            number === page
                                ? 'active'
                                : '',
                            `Page ${number}`
                        )
                )
                .join('') +

            button(
                '›',
                page + 1,
                '',
                'Next page',
                page === pages
            );

        element
            .querySelectorAll(
                'button[data-page]:not([disabled])'
            )
            .forEach(buttonElement => {
                buttonElement.addEventListener(
                    'click',
                    () => go(
                        Number(
                            buttonElement.dataset.page
                        )
                    )
                );
            });
    }

    function createTable(root, options) {
        const query = selector =>
            root.querySelector(selector);

        const elements = {
            search: query('[data-search]'),
            status: query('[data-status]'),
            payer: query('[data-payer]'),
            from: query('[data-from]'),
            to: query('[data-to]'),
            clear: query('[data-clear]'),
            body: query('[data-rows]'),
            info: query('[data-info]'),
            pager: query('[data-pager]'),
            state: query('[data-state]'),
            wrap: query('[data-table]'),
            live: query('[data-live]')
        };

        const defaults = {
            search: '',
            status: options.defaultStatus || '',
            payer: '',
            from: '',
            to: '',
            sort: 'lastUpdated',
            dir: 'desc',
            page: 1
        };

        const state = Object.assign(
            {},
            defaults
        );

        const pageSize =
            options.pageSize || 10;

        let requestId = 0;

        const statusOptions = (
            options.attention
                ? [['attention', 'Requires Attention']]
                : []
        ).concat([
            ['', 'All Status'],
            ...C.statuses.map(status => [
                status,
                status
            ])
        ]);

        elements.status.innerHTML =
            statusOptions
                .map(
                    ([value, label]) =>
                        `<option value="${esc(value)}">${esc(label)}</option>`
                )
                .join('');

        elements.status.value =
            state.status;

        S.payers()
            .then(list => {
                elements.payer.innerHTML =
                    '<option value="">All Payers</option>' +
                    list
                        .map(
                            payer =>
                                `<option value="${esc(payer)}">${esc(payer)}</option>`
                        )
                        .join('');
            })
            .catch(() => {
                elements.payer.innerHTML =
                    '<option value="">All Payers</option>';
            });

        const statusesParam = () =>
            state.status === 'attention'
                ? C.attentionStatuses
                : state.status
                    ? [state.status]
                    : [];

        const chartFilters = () => ({
            search: state.search,
            payer: state.payer,
            from: state.from,
            to: state.to
        });

        const isFiltered = () =>
            [
                'search',
                'status',
                'payer',
                'from',
                'to'
            ].some(
                key => state[key] !== defaults[key]
            );

        function showState(kind, message, retry) {
            elements.state.hidden = false;

            elements.wrap.classList.toggle(
                'is-dim',
                kind === 'loading'
            );

            elements.state.className =
                `cl-state table-state ${kind}`;

            elements.state.innerHTML = `
                <p>${esc(message)}</p>
                ${
                    retry
                        ? '<button type="button" class="cl-btn cl-btn--ghost" data-retry>Try again</button>'
                        : ''
                }
            `;

            const retryButton =
                elements.state.querySelector(
                    '[data-retry]'
                );

            if (retryButton) {
                retryButton.addEventListener(
                    'click',
                    load
                );
            }
        }

        const hideState = () => {
            elements.state.hidden = true;
            elements.wrap.classList.remove(
                'is-dim'
            );
        };

        function renderHead() {
            root
                .querySelectorAll('th[data-key]')
                .forEach(th => {
                    const active =
                        th.dataset.key === state.sort;

                    th.setAttribute(
                        'aria-sort',
                        active
                            ? state.dir === 'asc'
                                ? 'ascending'
                                : 'descending'
                            : 'none'
                    );

                    th.classList.toggle(
                        'sorted',
                        active
                    );

                    const indicator =
                        th.querySelector('.cl-sort__ind');

                    if (indicator) {
                        indicator.textContent =
                            active
                                ? state.dir === 'asc'
                                    ? '▲'
                                    : '▼'
                                : '↕';
                    }
                });
        }

        function renderRows(result) {
            elements.body.innerHTML =
                result.items
                    .map(claim => `
                        <tr>
                            <td data-label="Claim ID">
                                <a
                                    class="cl-idlink"
                                    href="${esc(detailsUrl(claim.id))}"
                                >
                                    ${esc(claim.id)}
                                </a>
                            </td>

                            <td data-label="Patient Name">
                                ${esc(claim.patientName || dash)}
                            </td>

                            <td data-label="Payer / Insurance">
                                ${esc(claim.payer || dash)}
                            </td>

                            <td
                                data-label="Service Date"
                                class="nowrap"
                            >
                                ${fmtDate(claim.serviceDate)}
                            </td>

                            <td
                                data-label="Claim Amount"
                                class="num"
                            >
                                ${fmtMoney(claim.amount)}
                            </td>

                            <td
                                data-label="Submitted Date"
                                class="nowrap"
                            >
                                ${fmtDate(claim.submittedDate)}
                            </td>

                            <td data-label="Status">
                                ${statusBadge(claim.status)}
                            </td>

                            <td
                                data-label="Last Updated"
                                class="nowrap"
                            >
                                ${fmtDate(claim.lastUpdated)}
                            </td>

                            <td
                                data-label="Actions"
                                class="actions"
                            >
                                <a
                                    class="cl-link-btn"
                                    href="${esc(detailsUrl(claim.id))}"
                                    aria-label="View claim ${esc(claim.id)}"
                                >
                                    View
                                </a>
                            </td>
                        </tr>
                    `)
                    .join('');

            const from =
                (result.page - 1) *
                result.pageSize +
                1;

            const to =
                from +
                result.items.length -
                1;

            elements.info.textContent =
                `Showing ${from} to ${to} of ${result.total.toLocaleString(C.locale)} claim${result.total === 1 ? '' : 's'}`;

            renderPager(
                elements.pager,
                result.page,
                result.pages,
                page => {
                    state.page = page;
                    load();
                }
            );
        }

        async function load() {
            const currentRequest =
                ++requestId;

            showState(
                'loading',
                'Loading claims…'
            );

            renderHead();

            try {
                const result = await S.list({
                    search: state.search,
                    statuses: statusesParam(),
                    payer: state.payer,
                    from: state.from,
                    to: state.to,
                    sort: state.sort,
                    dir: state.dir,
                    page: state.page,
                    pageSize
                });

                if (
                    currentRequest !== requestId
                ) {
                    return;
                }

                if (
                    result.total > 0 &&
                    state.page > result.pages
                ) {
                    state.page = result.pages;
                    return load();
                }

                elements.clear.disabled =
                    !isFiltered();

                if (!result.items.length) {
                    elements.body.innerHTML = '';
                    elements.pager.innerHTML = '';
                    elements.info.textContent =
                        'Showing 0 claims';

                    const hasFilters =
                        (
                            isFiltered() &&
                            state.status !==
                                defaults.status
                        ) ||
                        state.search ||
                        state.payer ||
                        state.from ||
                        state.to;

                    let message;

                    if (hasFilters) {
                        message =
                            'No claims match the current search or filters.';
                    } else if (
                        state.status === 'attention'
                    ) {
                        message =
                            'No claims currently require attention.';
                    } else {
                        message =
                            'No claims have been recorded yet.';
                    }

                    showState(
                        'empty',
                        message
                    );
                } else {
                    renderRows(result);
                    hideState();
                }

                if (elements.live) {
                    elements.live.textContent =
                        `${result.total} claims found`;
                }

                if (options.onChange) {
                    options.onChange(
                        chartFilters(),
                        isFiltered()
                    );
                }
            } catch (error) {
                if (
                    currentRequest !== requestId
                ) {
                    return;
                }

                elements.body.innerHTML = '';
                elements.pager.innerHTML = '';
                elements.info.textContent = '';

                showState(
                    'error',
                    error.message ||
                        'Claims could not be loaded.',
                    true
                );
            }
        }

        const reset = () => {
            Object.assign(
                state,
                defaults
            );

            elements.search.value = '';
            elements.status.value =
                defaults.status;
            elements.payer.value = '';
            elements.from.value = '';
            elements.to.value = '';
            elements.from.max = '';
            elements.to.min = '';
        };

        const apply = () => {
            state.page = 1;
            load();
        };

        elements.search.addEventListener(
            'input',
            debounce(() => {
                state.search =
                    elements.search.value;
                apply();
            }, 250)
        );

        elements.search.addEventListener(
            'keydown',
            event => {
                if (event.key === 'Enter') {
                    state.search =
                        elements.search.value;
                    apply();
                }
            }
        );

        elements.status.addEventListener(
            'change',
            () => {
                state.status =
                    elements.status.value;
                apply();
            }
        );

        elements.payer.addEventListener(
            'change',
            () => {
                state.payer =
                    elements.payer.value;
                apply();
            }
        );

        elements.from.addEventListener(
            'change',
            () => {
                state.from =
                    elements.from.value;
                elements.to.min =
                    state.from;
                apply();
            }
        );

        elements.to.addEventListener(
            'change',
            () => {
                state.to =
                    elements.to.value;
                elements.from.max =
                    state.to;
                apply();
            }
        );

        elements.clear.addEventListener(
            'click',
            () => {
                reset();
                load();
                elements.search.focus();
            }
        );

        root
            .querySelectorAll(
                'th[data-key] button'
            )
            .forEach(button => {
                button.addEventListener(
                    'click',
                    () => {
                        const key =
                            button.closest(
                                'th'
                            ).dataset.key;

                        if (
                            state.sort === key
                        ) {
                            state.dir =
                                state.dir === 'asc'
                                    ? 'desc'
                                    : 'asc';
                        } else {
                            state.sort = key;

                            state.dir =
                                [
                                    'serviceDate',
                                    'submittedDate',
                                    'lastUpdated',
                                    'amount'
                                ].includes(key)
                                    ? 'desc'
                                    : 'asc';
                        }

                        state.page = 1;
                        load();
                    }
                );
            });

        load();

        return {
            reload: load,
            filters: chartFilters
        };
    }

    g.ClaimsUI = {
        esc,
        fmtDate,
        fmtMoney,
        statusBadge,
        icon,
        slug,
        detailsUrl,
        bindRoutes,
        createTable,
        debounce
    };
})(window);