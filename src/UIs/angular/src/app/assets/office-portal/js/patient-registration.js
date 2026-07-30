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

        dobInput.addEventListener(
            "change",
            updateAgeFromDob
        );

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

    const radios =
        document.querySelectorAll(
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

}


function confirmInsurance() {

    const provider =
        document.getElementById("provider").value;

    const policy =
        document.getElementById("policy").value;

    if (!provider || !policy) {

        alert(
            "Please complete insurance details."
        );

        return;

    }

    insuranceData = {

        provider,
        policy

    };

    closeInsuranceModal();

}


function closePaymentModal() {

    document.getElementById(
        "paymentModal"
    ).style.display = "none";

}


function confirmPayment() {

    const card =
        document.getElementById(
            "cardNumber"
        ).value;

    const cvv =
        document.getElementById(
            "cvv"
        ).value;

    if (!card || !cvv) {

        alert(
            "Please complete payment details."
        );

        return;

    }

    paymentData = {

        card,
        cvv

    };

    closePaymentModal();

}


function confirmBooking() {

    if (!insuranceChoice) {

        alert(
            "Please select insurance option."
        );

        return;

    }

    if (

        insuranceChoice === "yes"
        &&
        !insuranceData

    ) {

        alert(
            "Please enter insurance details."
        );

        return;

    }

    if (

        insuranceChoice === "no"
        &&
        !paymentData

    ) {

        alert(
            "Please enter payment details."
        );

        return;

    }

    const appointment = {

    firstName:
        document.getElementById("firstName").value,

    lastName:
        document.getElementById("lastName").value,

    phone:
        document.getElementById("phone").value,

    email:
        document.querySelector('input[type="email"]').value,

    otpMethod:
        document.querySelector(
            'input[name="otp"]:checked'
        ).value,

    date:
        localStorage.getItem("selectedDate") || "",

    time:
        localStorage.getItem("selectedTime") || ""

};

localStorage.setItem(
    "latestAppointment",
    JSON.stringify(appointment)
);

localStorage.setItem(
    "tempAppointment",
    JSON.stringify(appointment)
);



window.location.href =
    "registration-otp.html";

}



function updateAgeFromDob() {

    const dobInput =
        document.getElementById(
            "dateOfBirth"
        );

    const ageInput =
        document.getElementById(
            "age"
        );

    const yearsRadio =
        document.querySelector(
            'input[name="ageType"][value="years"]'
        );

    const monthsRadio =
        document.querySelector(
            'input[name="ageType"][value="months"]'
        );

    if (!dobInput.value) {

        ageInput.value = "";

        ageInput.readOnly = false;

        ageInput.disabled = false;

        yearsRadio.checked = false;

        monthsRadio.checked = false;

        return;

    }

    const dob =
        new Date(
            dobInput.value + "T00:00:00"
        );

    const today =
        new Date();

    if (dob > today) {

        ageInput.value = "";

        yearsRadio.checked = false;

        monthsRadio.checked = false;

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

        let totalMonths =
            Math.max(months, 0);

        ageInput.value =
            totalMonths;

        ageInput.disabled = true;

        monthsRadio.checked = true;

        yearsRadio.checked = false;

        return;

    }

    ageInput.value =
        years;

    ageInput.disabled = true;

    yearsRadio.checked = true;

    monthsRadio.checked = false;

}



document.addEventListener(

    "reset",

    function () {

        insuranceChoice = null;

        insuranceData = null;

        paymentData = null;

        const age =
            document.getElementById(
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

            event.key === "Enter"
            &&
            event.target.tagName !== "TEXTAREA"

        ) {

            event.preventDefault();

        }

    }

);