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


/* =========================================================
   INSURANCE MODAL
   ========================================================= */

function closeInsuranceModal() {

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";

    /* Cancel = remove selection */
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

    const provider =
        document.getElementById("provider").value.trim();

    const policy =
        document.getElementById("policy").value.trim();

    if (!provider || !policy) {
    return;
}

    insuranceData = {
        provider,
        policy
    };

    /* Confirm = preserve selection and data */
    document.getElementById(
        "insuranceModal"
    ).style.display = "none";
}


/* =========================================================
   PAYMENT MODAL
   ========================================================= */

function closePaymentModal() {

    document.getElementById(
        "paymentModal"
    ).style.display = "none";

    /* Cancel = remove selection */
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

    const card =
        document.getElementById(
            "cardNumber"
        ).value.trim();

    const cvv =
        document.getElementById(
            "cvv"
        ).value.trim();

    if (!card || !cvv) {

        return;
    }

    paymentData = {
        card,
        cvv
    };

    /* Confirm = preserve selection and data */
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


    const genderSelect =
        document.querySelector(
            '.form-group select[required]'
        );

    const addressField =
        document.querySelector(
            'textarea[placeholder="Street, City, State, ZIP Code"]'
        );



        const otpMethod =
    document.querySelector(
        'input[name="otp"]:checked'
    )?.value || "";



   const appointment = {

    firstName:
        document.getElementById("firstName").value.trim(),

    lastName:
        document.getElementById("lastName").value.trim(),

    phone:
        document.getElementById("phone").value.trim(),

    email:
        document.querySelector(
            'input[type="email"]'
        ).value.trim(),

    dateOfBirth:
        document.getElementById("dateOfBirth").value,

    age:
        document.getElementById("age").value,

    gender:
        genderSelect
            ? genderSelect.value
            : "",

    address:
        addressField
            ? addressField.value.trim()
            : "",

    insurance:
        insuranceChoice,

    insuranceData:
        insuranceData,

    paymentData:
        paymentData,

    otpMethod:
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




