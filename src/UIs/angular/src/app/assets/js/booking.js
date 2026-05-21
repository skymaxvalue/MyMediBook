let insuranceData = null;
let paymentData = null;
let insuranceChoice = null;

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("bookingForm");
    const dobInput = document.getElementById("dateOfBirth");

    form.addEventListener("submit", function (e) {

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        e.preventDefault();

        confirmBooking();

    });




    const radios =
    document.querySelectorAll('input[name="insurance"]');

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




    dobInput.addEventListener(
        "change",
        updateAgeFromDob
    );

});





function closeInsuranceModal() {

    document.getElementById(
        "insuranceModal"
    ).style.display = "none";

}



function closePaymentModal() {

    document.getElementById(
        "paymentModal"
    ).style.display = "none";

}




function confirmInsurance() {

    const provider =
    document.getElementById("provider").value;

    const policy =
    document.getElementById("policy").value;

    if (!provider || !policy) {

        alert("Please fill all insurance fields");

        return;
    }

    insuranceData = { provider, policy };

    closeInsuranceModal();

    const selected =
    document.querySelector(
        'input[name="insurance"]:checked'
    );

    if (selected) {

        selected.parentElement.style.color = "green";

    }

}




function confirmPayment() {

    const card =
    document.getElementById("cardNumber").value;

    const cvv =
    document.getElementById("cvv").value;

    if (!card || !cvv) {

        alert("Please fill all payment details");

        return;
    }

    paymentData = { card, cvv };

    closePaymentModal();

    const selected =
    document.querySelector(
        'input[name="insurance"]:checked'
    );

    if (selected) {

        selected.parentElement.style.color = "green";

    }

}




function confirmBooking() {

    if (!insuranceChoice) {

        alert("Please choose Yes or No");

        return;
    }

    if (
        insuranceChoice === "yes"
        && !insuranceData
    ) {

        alert("Please fill Insurance Details");

        return;
    }

    if (
        insuranceChoice === "no"
        && !paymentData
    ) {

        alert("Please fill Payment Details");

        return;
    }



    const appointment = {

        firstName:
        document.getElementById(
            "firstName"
        ).value,

        lastName:
        document.getElementById(
            "lastName"
        ).value,

        phone:
        document.getElementById(
            "phone"
        ).value,

        date:
        localStorage.getItem(
            "selectedDate"
        ) || "Not Selected",

        time:
        localStorage.getItem(
            "selectedTime"
        ) || "Not Selected"

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
    "otp-verification.html";

}




function updateAgeFromDob() {

    const dobInput =
    document.getElementById("dateOfBirth");

    const ageInput =
    document.getElementById("age");

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
    new Date(dobInput.value + "T00:00:00");

    const today = new Date();



    if (dob > today) {

        ageInput.value = "";

        ageInput.readOnly = false;

        ageInput.disabled = false;

        yearsRadio.checked = false;

        monthsRadio.checked = false;

        return;
    }



    let years =
    today.getFullYear() - dob.getFullYear();

    let months =
    today.getMonth() - dob.getMonth();

    const days =
    today.getDate() - dob.getDate();



    if (days < 0) {

        months -= 1;

    }



    if (months < 0) {

        years -= 1;

        months += 12;

    }



    if (years <= 0) {

        let totalMonths = months;

        if (days < 0 && totalMonths > 0) {

            totalMonths -= 1;

        }

        ageInput.value =
        Math.max(totalMonths, 0);

        ageInput.readOnly = true;

        ageInput.disabled = true;

        monthsRadio.checked = true;

        yearsRadio.checked = false;

        return;
    }



    ageInput.value = years;

    ageInput.readOnly = true;

    ageInput.disabled = true;

    yearsRadio.checked = true;

    monthsRadio.checked = false;

}