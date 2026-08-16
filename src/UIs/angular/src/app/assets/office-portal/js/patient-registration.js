let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeRegistration();
});

function initializeRegistration() {
    const form = document.getElementById("bookingForm");
    const dobInput = document.getElementById("dateOfBirth");

    if (dobInput) {
        dobInput.addEventListener("change", updateAgeFromDob);
    }

    setupInsurance();

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            confirmBooking();
        });
    }
}

function setupInsurance() {
    const radios = document.querySelectorAll(
        'input[name="insurance"]'
    );

    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            insuranceChoice = this.value;

            if (this.value === "yes") {
                document.getElementById(
                    "insuranceModal"
                ).style.display = "flex";
            }

            if (this.value === "no") {
                document.getElementById(
                    "paymentModal"
                ).style.display = "flex";
            }
        });
    });
}

function closeInsuranceModal() {
    document.getElementById(
        "insuranceModal"
    ).style.display = "none";

    insuranceChoice = null;
    insuranceData = null;

    const yesRadio = document.querySelector(
        'input[name="insurance"][value="yes"]'
    );

    if (yesRadio) {
        yesRadio.checked = false;
    }
}

function confirmInsurance() {
    const provider = document
        .getElementById("provider")
        .value
        .trim();

    const policy = document
        .getElementById("policy")
        .value
        .trim();

    const groupId = document
        .getElementById("groupId")
        .value
        .trim();

    const holderName = document
        .getElementById("holderName")
        .value
        .trim();

    const insuranceAddress = document
        .getElementById("insuranceAddress")
        .value
        .trim();

    if (
        !provider ||
        !policy ||
        !holderName ||
        !insuranceAddress
    ) {
        return;
    }

    insuranceData = {
        provider,
        policy,
        groupId,
        holderName,
        insuranceAddress
    };

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";
}

function closePaymentModal() {
    document.getElementById(
        "paymentModal"
    ).style.display = "none";

    insuranceChoice = null;
    paymentData = null;

    const noRadio = document.querySelector(
        'input[name="insurance"][value="no"]'
    );

    if (noRadio) {
        noRadio.checked = false;
    }
}

function confirmPayment() {
    const paymentType = document
        .getElementById("paymentType")
        .value;

    const cardHolder = document
        .getElementById("cardHolder")
        .value
        .trim();

    const cardNumber = document
        .getElementById("cardNumber")
        .value
        .trim();

    const expiry = document
        .getElementById("expiry")
        .value
        .trim();

    const cvv = document
        .getElementById("cvv")
        .value
        .trim();

    if (
        !paymentType ||
        !cardHolder ||
        !cardNumber ||
        !expiry ||
        !cvv
    ) {
        return;
    }

    paymentData = {
        paymentType,
        cardHolder,
        cardNumber,
        expiry,
        cvv
    };

    document.getElementById(
        "paymentModal"
    ).style.display = "none";
}

function confirmBooking() {
    if (!insuranceChoice) {
        return;
    }

    if (
        insuranceChoice === "yes" &&
        !insuranceData
    ) {
        document.getElementById(
            "insuranceModal"
        ).style.display = "flex";

        return;
    }

    if (
        insuranceChoice === "no" &&
        !paymentData
    ) {
        document.getElementById(
            "paymentModal"
        ).style.display = "flex";

        return;
    }

    const genderSelect = document.querySelector(
        '#bookingForm .form-grid select'
    );

    const otpMethod = document.querySelector(
        'input[name="otp"]:checked'
    )?.value || "";

    const appointment = {
        firstName: document
            .getElementById("firstName")
            .value
            .trim(),

        lastName: document
            .getElementById("lastName")
            .value
            .trim(),

        phone: document
            .getElementById("phone")
            .value
            .trim(),

        email: document
            .getElementById("email")
            .value
            .trim(),

        dateOfBirth: document
            .getElementById("dateOfBirth")
            .value,

        age: document
            .getElementById("age")
            .value,

        gender: genderSelect
            ? genderSelect.value
            : "",

        address: document
            .getElementById("residentialAddress")
            .value
            .trim(),

        cityVillage: document
            .getElementById("cityVillage")
            .value
            .trim(),

        state: document
            .getElementById("state")
            .value,

        pinCode: document
            .getElementById("pinCode")
            .value
            .trim(),

        insurance: insuranceChoice,

        insuranceData,

        paymentData,

        otpMethod
    };

    localStorage.setItem(
        "tempAppointment",
        JSON.stringify(appointment)
    );

    if (otpMethod === "none") {
        window.location.href =
            "patient-registration-success.html";

        return;
    }

    window.location.href =
        "registration-otp.html";
}

function updateAgeFromDob() {
    const dobInput = document.getElementById(
        "dateOfBirth"
    );

    const ageInput = document.getElementById(
        "age"
    );

    const yearsRadio = document.querySelector(
        'input[name="ageType"][value="years"]'
    );

    const monthsRadio = document.querySelector(
        'input[name="ageType"][value="months"]'
    );

    if (!dobInput.value) {
        ageInput.value = "";
        ageInput.readOnly = false;
        ageInput.disabled = false;

        if (yearsRadio) {
            yearsRadio.checked = false;
        }

        if (monthsRadio) {
            monthsRadio.checked = false;
        }

        return;
    }

    const dob = new Date(
        dobInput.value + "T00:00:00"
    );

    const today = new Date();

    if (dob > today) {
        ageInput.value = "";

        if (yearsRadio) {
            yearsRadio.checked = false;
        }

        if (monthsRadio) {
            monthsRadio.checked = false;
        }

        return;
    }

    let years =
        today.getFullYear() -
        dob.getFullYear();

    let months =
        today.getMonth() -
        dob.getMonth();

    const days =
        today.getDate() -
        dob.getDate();

    if (days < 0) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    if (years <= 0) {
        const totalMonths =
            Math.max(months, 0);

        ageInput.value = totalMonths;
        ageInput.disabled = true;

        if (monthsRadio) {
            monthsRadio.checked = true;
        }

        if (yearsRadio) {
            yearsRadio.checked = false;
        }

        return;
    }

    ageInput.value = years;
    ageInput.disabled = true;

    if (yearsRadio) {
        yearsRadio.checked = true;
    }

    if (monthsRadio) {
        monthsRadio.checked = false;
    }
}

document.addEventListener(
    "reset",
    function () {
        insuranceChoice = null;
        insuranceData = null;
        paymentData = null;

        const age = document.getElementById(
            "age"
        );

        if (age) {
            age.disabled = false;
        }
    }
);

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "Enter" &&
            event.target.tagName !== "TEXTAREA"
        ) {
            event.preventDefault();
        }
    }
);