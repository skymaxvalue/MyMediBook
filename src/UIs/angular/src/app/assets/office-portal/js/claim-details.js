document.addEventListener('DOMContentLoaded', async () => {
    const S = ClaimsService;
    const U = ClaimsUI;
    const $ = id => document.getElementById(id);

    U.bindRoutes();

    const id = new URLSearchParams(location.search).get('id');
    const host = $('detailsBody');

    const msg = (text, retry) => {
        host.innerHTML = `
            <div class="cl-state ${retry ? 'cl-state--error' : ''}">
                <div class="cl-state__title">${U.esc(text)}</div>
                ${retry ? '<button type="button" class="cl-btn cl-btn--ghost" id="retry">Try again</button>' : ''}
            </div>
        `;

        const retryButton = $('retry');

        if (retryButton) {
            retryButton.addEventListener('click', load);
        }
    };

    const row = (key, value) => `
        <div class="cl-kv">
            <dt>${U.esc(key)}</dt>
            <dd>${value}</dd>
        </div>
    `;

    const val = value => {
        if (value === null || value === undefined || value === '') {
            return '<span class="is-empty">—</span>';
        }

        return U.esc(value);
    };

    const card = (title, rows) => `
        <section class="cl-card cl-detail">
            <div class="cl-card__head">
                <h2>${U.esc(title)}</h2>
            </div>

            <dl>
                ${rows.join('')}
            </dl>
        </section>
    `;

    async function load() {
        if (!id) {
            return msg('No claim was specified.');
        }

        host.innerHTML = `
            <div class="cl-state">
                <div class="cl-spinner"></div>
                <div class="cl-state__title">Loading claim…</div>
            </div>
        `;

        try {
            const claim = await S.get(id);

            if (!claim) {
                return msg(`Claim ${id} could not be found.`);
            }

            document.title = `Claim ${claim.id} – Front Office`;

            $('crumbCurrent').textContent = claim.id;
            $('claimTitle').textContent = claim.id;
            $('claimStatus').innerHTML = U.statusBadge(claim.status);

            const approved = Number.isFinite(Number(claim.approvedAmount))
                ? Number(claim.approvedAmount)
                : null;

            const paid = Number.isFinite(Number(claim.paidAmount))
                ? Number(claim.paidAmount)
                : null;

            const outstanding =
                approved !== null && paid !== null
                    ? approved - paid
                    : null;

            const workflow = [
                row('Status', U.statusBadge(claim.status))
            ];

            if (claim.denialCode || claim.denialReason) {
                workflow.push(
                    row('Denial code', val(claim.denialCode)),
                    row('Denial reason', val(claim.denialReason))
                );
            }

            if (claim.actionRequired) {
                workflow.push(
                    row('Action required', val(claim.actionRequired))
                );
            }

            const history = claim.notes?.length
                ? `
                    <ul class="cl-timeline">
                        ${claim.notes.map(note => `
                            <li>
                                <span class="cl-timeline__when">
                                    ${U.fmtDate(note.date)}
                                </span>
                                <span>${val(note.text)}</span>
                            </li>
                        `).join('')}
                    </ul>
                `
                : '<p class="cl-muted">No notes recorded.</p>';

            host.innerHTML = `
                <div class="cl-detail-grid">

                    ${card('Claim', [
                        row('Claim ID', val(claim.id)),
                        row('Service date', U.fmtDate(claim.serviceDate)),
                        row('Submitted date', U.fmtDate(claim.submittedDate)),
                        row('Last updated', U.fmtDate(claim.lastUpdated))
                    ])}

                    ${card('Patient', [
                        row('Patient name', val(claim.patientName)),
                        row('Patient ID (UHID)', val(claim.patientId))
                    ])}

                    ${card('Payer / Insurance', [
                        row('Payer', val(claim.payer)),
                        row('Policy / Member ID', val(claim.policyId))
                    ])}

                    ${card('Financial', [
                        row('Claim amount', U.fmtMoney(claim.amount)),
                        row('Approved amount', U.fmtMoney(claim.approvedAmount)),
                        row('Paid amount', U.fmtMoney(claim.paidAmount)),
                        row('Outstanding', U.fmtMoney(outstanding))
                    ])}

                    ${card('Workflow', workflow)}

                    <section class="cl-card cl-detail cl-detail--full">
                        <div class="cl-card__head">
                            <h2>Notes &amp; History</h2>
                        </div>

                        ${history}
                    </section>

                </div>
            `;
        } catch (error) {
            msg(
                error.message || 'The claim could not be loaded.',
                true
            );
        }
    }

    load();
});