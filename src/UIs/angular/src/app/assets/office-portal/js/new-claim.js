document.addEventListener('DOMContentLoaded', async () => {
    const S = ClaimsService;
    const U = ClaimsUI;

    U.bindRoutes();

    const form = document.getElementById('clForm');
    const error = document.getElementById('clFormError');
    const demo = document.getElementById('clDemoNotice');
    const payerList = document.getElementById('clPayerList');



    const serviceDate = document.getElementById('fServiceDate');

        const today = new Date();
        const todayString =
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

serviceDate.max = todayString;

    if (demo) {
        demo.hidden = !S.isDemo();
    }

    try {
        const payers = await S.payers();

        payerList.innerHTML = payers
            .map(
                payer =>
                    `<option value="${U.esc(payer)}"></option>`
            )
            .join('');
    } catch (_) {}

    const fields = [
        'patientName',
        'patientId',
        'payer',
        'policyId',
        'serviceDate',
        'amount'
    ];

    const fieldEl = name =>
        form.elements[name];

    const errEl = name =>
        document.getElementById(
            {
                patientName: 'ePatientName',
                patientId: 'ePatientId',
                payer: 'ePayer',
                policyId: 'ePolicyId',
                serviceDate: 'eServiceDate',
                amount: 'eAmount'
            }[name]
        );

    const clearErrors = () => {
        fields.forEach(name => {
            fieldEl(name).removeAttribute(
                'aria-invalid'
            );

            errEl(name).textContent = '';
        });

        error.hidden = true;
        error.textContent = '';
    };

    const setError = (name, text) => {
        fieldEl(name).setAttribute(
            'aria-invalid',
            'true'
        );

        errEl(name).textContent = text;
    };

    form.addEventListener(
        'submit',
        async event => {
            event.preventDefault();

            clearErrors();

            let firstBad = null;

            fields.forEach(name => {
                if (
                    !String(
                        fieldEl(name).value || ''
                    ).trim()
                ) {
                    setError(
                        name,
                        'This field is required.'
                    );

                    firstBad ||= name;
                }
            });



            const selectedServiceDate = fieldEl('serviceDate').value;

if (selectedServiceDate && selectedServiceDate > todayString) {
    setError(
        'serviceDate',
        'Service date cannot be in the future.'
    );

    firstBad ||= 'serviceDate';
}

            const amount = Number(
                fieldEl('amount').value
            );

            if (
                fieldEl('amount').value &&
                (
                    !Number.isFinite(amount) ||
                    amount <= 0
                )
            ) {
                setError(
                    'amount',
                    'Enter an amount greater than 0.'
                );

                firstBad ||= 'amount';
            }

            if (firstBad) {
                fieldEl(firstBad).focus();

                error.hidden = false;
                error.textContent =
                    'Please complete the required fields.';

                return;
            }

            const submit =
                document.getElementById(
                    'clSubmit'
                );

            submit.disabled = true;
            submit.textContent =
                'Submitting…';

            try {
                const claim = await S.create({
                    patientName:
                        fieldEl('patientName').value,

                    patientId:
                        fieldEl('patientId').value,

                    payer:
                        fieldEl('payer').value,

                    policyId:
                        fieldEl('policyId').value,

                    serviceDate:
                        fieldEl('serviceDate').value,

                    amount,

                    notes:
                        fieldEl('notes').value
                });

                location.href =
                    U.detailsUrl
                        ? U.detailsUrl(claim.id)
                        : `claim-details.html?id=${encodeURIComponent(claim.id)}`;
            } catch (err) {
                error.hidden = false;
                error.textContent =
                    err.message ||
                    'The claim could not be created.';

                error.focus();

                submit.disabled = false;
                submit.textContent =
                    'Submit Claim';
            }
        }
    );
});