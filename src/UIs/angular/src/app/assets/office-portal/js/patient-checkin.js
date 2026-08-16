document.addEventListener("DOMContentLoaded", () => {

    initializePatientCheckIn();

    });

const appointments = [

    {
        id: 1,
        patientName: "Ravi Kumar",
        dob: "01/04/2001",
        appointmentDate: "14/07/2026",
        address: "123 MG Road, Delhi",
        phone: "+91 98765 43210",
        email: "ravi.kumar@email.com",
        doctor: "Dr. Kumaravel",
        department: "General Physician",
        room: "#5, 2nd Floor",
        appointmentTime: "10:00 AM",
        uhid: "HH24567",
        checkedIn: false
    },

    {
        id: 2,
        patientName: "Raveen Kumar",
        dob: "04/01/2001",
        appointmentDate: "14/07/2026",
        address: "45 Park Street, Mumbai",
        phone: "+91 91234 56789",
        email: "raveen.kumar@email.com",
        doctor: "Dr. Kumaravel",
        department: "General Physician",
        room: "#5, 2nd Floor",
        appointmentTime: "10:30 AM",
        uhid: "HH24568",
        checkedIn: false
    },

    {
        id: 3,
        patientName: "Ananya Sharma",
        dob: "15/08/1998",
        appointmentDate: "14/07/2026",
        address: "22 Lake Road, Kolkata",
        phone: "+91 98765 12345",
        email: "ananya.sharma@email.com",
        doctor: "Dr. Kumaravel",
        department: "General Physician",
        room: "#5, 2nd Floor",
        appointmentTime: "11:00 AM",
        uhid: "HH24569",
        checkedIn: false
    },

    {
        id: 4,
        patientName: "Sourav Das",
        dob: "22/11/1995",
        appointmentDate: "14/07/2026",
        address: "18 Station Road, Kolkata",
        phone: "+91 98301 45678",
        email: "sourav.das@email.com",
        doctor: "Dr. Priya",
        department: "Cardiology",
        room: "#8, 3rd Floor",
        appointmentTime: "09:00 AM",
        uhid: "HH24570",
        checkedIn: false
    },

    {
        id: 5,
        patientName: "Priyanka Sen",
        dob: "08/03/2000",
        appointmentDate: "14/07/2026",
        address: "67 Salt Lake, Kolkata",
        phone: "+91 98745 67890",
        email: "priyanka.sen@email.com",
        doctor: "Dr. Priya",
        department: "Cardiology",
        room: "#8, 3rd Floor",
        appointmentTime: "09:30 AM",
        uhid: "HH24571",
        checkedIn: false
    },

    {
        id: 6,
        patientName: "Arindam Roy",
        dob: "12/06/1989",
        appointmentDate: "14/07/2026",
        address: "34 VIP Road, Kolkata",
        phone: "+91 91236 78901",
        email: "arindam.roy@email.com",
        doctor: "Dr. Priya",
        department: "Cardiology",
        room: "#8, 3rd Floor",
        appointmentTime: "10:00 AM",
        uhid: "HH24572",
        checkedIn: false
    },

    {
        id: 7,
        patientName: "Neha Gupta",
        dob: "19/02/1997",
        appointmentDate: "14/07/2026",
        address: "56 MG Road, Delhi",
        phone: "+91 98123 45678",
        email: "neha.gupta@email.com",
        doctor: "Dr. Arjun",
        department: "Orthopedics",
        room: "#12, 4th Floor",
        appointmentTime: "11:00 AM",
        uhid: "HH24573",
        checkedIn: false
    },

    {
        id: 8,
        patientName: "Rahul Mehta",
        dob: "05/09/1992",
        appointmentDate: "14/07/2026",
        address: "89 Park Street, Kolkata",
        phone: "+91 98761 23456",
        email: "rahul.mehta@email.com",
        doctor: "Dr. Arjun",
        department: "Orthopedics",
        room: "#12, 4th Floor",
        appointmentTime: "11:30 AM",
        uhid: "HH24574",
        checkedIn: false
    },

    {
        id: 9,
        patientName: "Moumita Ghosh",
        dob: "27/12/2002",
        appointmentDate: "14/07/2026",
        address: "41 Garia Road, Kolkata",
        phone: "+91 90070 12345",
        email: "moumita.ghosh@email.com",
        doctor: "Dr. Arjun",
        department: "Orthopedics",
        room: "#12, 4th Floor",
        appointmentTime: "12:00 PM",
        uhid: "HH24575",
        checkedIn: false
    }

];

let selectedAppointment = null;

function initializePatientCheckIn() {
    const searchBtn = document.getElementById("searchBtn");
    const checkInBtn = document.getElementById("checkInBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
    }

    if (checkInBtn) {
        checkInBtn.addEventListener("click", handleCheckIn);
    }

    renderInitialResults();
    setupModalEvents();

    const doctorInput = document.getElementById("doctorName");
const doctorDropdown = document.getElementById("doctorDropdown");

const doctors = [
    "Dr. Kumaravel",
    "Dr. Priya",
    "Dr. Arjun"
];

let selectedDoctor = "";

function renderDoctorDropdown(list) {
    doctorDropdown.innerHTML = "";

    if (!list.length) {
        doctorDropdown.innerHTML = `
            <div class="doctor-no-results">
                No doctors found
            </div>
        `;

        doctorDropdown.classList.add("show");
        return;
    }

    list.forEach(doctor => {
        const option = document.createElement("div");

        option.className = "doctor-option";
        option.textContent = doctor;

        option.addEventListener("click", () => {
            selectedDoctor = doctor;
            doctorInput.value = doctor;
            doctorDropdown.classList.remove("show");
            searchBtn.disabled = false;
        });

        doctorDropdown.appendChild(option);
    });

    doctorDropdown.classList.add("show");
}

doctorInput.addEventListener("focus", () => {
    renderDoctorDropdown(
        doctors.filter(doctor =>
            doctor.toLowerCase().includes(
                doctorInput.value.trim().toLowerCase()
            )
        )
    );
});

doctorInput.addEventListener("input", () => {
    selectedDoctor = "";

    const value = doctorInput.value
        .trim()
        .toLowerCase();

    const filteredDoctors = doctors.filter(doctor =>
        doctor.toLowerCase().includes(value)
    );

    searchBtn.disabled = true;

    renderDoctorDropdown(filteredDoctors);
});

document.addEventListener("click", event => {
    if (
        !doctorInput.contains(event.target) &&
        !doctorDropdown.contains(event.target)
    ) {
        doctorDropdown.classList.remove("show");
    }
});
};






    


function renderInitialResults() {
    const resultsBody = document.getElementById("resultsBody");
    const resultCount = document.getElementById("resultCount");

    if (resultCount) {
        resultCount.textContent = "0 Appointments Found";
    }

    if (resultsBody) {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-results">
                    No appointments searched yet.
                </td>
            </tr>
        `;
    }

    selectedAppointment = null;

    const checkInBtn = document.getElementById("checkInBtn");

    if (checkInBtn) {
        checkInBtn.disabled = true;
    }
}



function handleSearch() {

    const patientName =
        document
            .getElementById("patientName")
            .value
            .trim();

    const dob =
        document
            .getElementById("dob")
            .value;

    const doctorName =
        document
            .getElementById("doctorName")
            .value;

    if (doctorName) {

        searchByDoctor(doctorName);

        return;
    }

    if (!patientName || !dob) {

        renderResults([]);

        return;
    }

    searchByPatient(
        patientName,
        dob
    );

}

function searchByPatient(
    patientName,
    dob
) {

    const formattedDob =
        formatInputDate(dob);

    const searchName =
        patientName.toLowerCase();

    const results =
        appointments.filter(
            appointment => {

                const nameMatches =
                    appointment.patientName
                        .toLowerCase()
                        .includes(searchName);

                const dobMatches =
                    appointment.dob === formattedDob;

                return (
                    nameMatches &&
                    dobMatches
                );

            }
        );

    renderResults(results);

}

function formatInputDate(value) {

    if (!value) {
        return "";
    }

    const parts =
        value.split("-");

    if (parts.length !== 3) {
        return value;
    }

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}

function searchByDoctor(doctorName) {
    const doctorAppointments = appointments.filter(appointment =>
        appointment.doctor.toLowerCase() === doctorName.toLowerCase()
    );

    renderResults(doctorAppointments);
}

function renderResults(
    results
) {

    const resultsBody =
        document.getElementById(
            "resultsBody"
        );

    const resultCount =
        document.getElementById(
            "resultCount"
        );

    if (!resultsBody) {
        return;
    }

    selectedAppointment = null;

    document.getElementById(
        "checkInBtn"
    ).disabled = true;

    if (resultCount) {

        resultCount.textContent =
            `${results.length} Appointment${results.length === 1 ? "" : "s"} Found`;

    }

    if (!results.length) {

        resultsBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="empty-results">

                    <strong>
    No Appointments Found
</strong>

No appointment was found for the details entered.
                </td>

            </tr>

        `;

        return;
    }

    resultsBody.innerHTML =
        results.map(
            (appointment, index) => `

            <tr>

                <td>

                    <input
                        type="radio"
                        name="selectedPatient"
                        class="patient-radio"
                        value="${appointment.id}"
                    >

                    ${index + 1}

                </td>

                <td>
                    ${appointment.patientName}
                </td>

                <td>
                    ${appointment.dob}
                </td>

                <td>
                    ${appointment.address}
                </td>

                <td>
                    ${appointment.phone}
                </td>

                <td>
                    ${appointment.email}
                </td>

                <td>
                    ${appointment.doctor}
                </td>

                <td>
                    ${appointment.room}
                </td>

                <td>

                    <button
                        type="button"
                        class="select-patient"
                        data-id="${appointment.id}">

                        Select

                    </button>

                </td>

            </tr>

        `
        ).join("");

    document
        .querySelectorAll(
            ".patient-radio"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    function() {

                        selectAppointment(
                            Number(this.value)
                        );

                    }
                );

            }
        );

    document
        .querySelectorAll(
            ".select-patient"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        selectAppointment(
                            Number(
                                this.dataset.id
                            )
                        );

                    }
                );

            }
        );

}

function selectAppointment(
    id
) {

    selectedAppointment =
        appointments.find(
            appointment =>
                appointment.id === id
        );

    if (!selectedAppointment) {
        return;
    }

    document
        .querySelectorAll(
            ".patient-radio"
        )
        .forEach(
            radio => {

                radio.checked =
                    Number(radio.value) === id;

            }
        );

    document
        .querySelectorAll(
            ".select-patient"
        )
        .forEach(
            button => {

                const selected =
                    Number(
                        button.dataset.id
                    ) === id;

                button.classList.toggle(
                    "selected",
                    selected
                );

                button.textContent =
                    selected
                        ? "Selected"
                        : "Select";

            }
        );

    document.getElementById(
        "checkInBtn"
    ).disabled = false;

}

function handleCheckIn() {

    if (!selectedAppointment) {
        return;
    }

    openConfirmModal(
        selectedAppointment
    );

}

function openConfirmModal(
    appointment
) {

    document.getElementById(
        "confirmDetails"
    ).innerHTML = `

        <div class="detail-row">

            <span>
                Patient Name
            </span>

            <span>
                ${appointment.patientName}
            </span>

        </div>

        <div class="detail-row">

            <span>
                UHID
            </span>

            <span>
                ${appointment.uhid}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Doctor
            </span>

            <span>
                ${appointment.doctor}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Appointment Time
            </span>

            <span>
                ${appointment.appointmentTime}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Room Number
            </span>

            <span>
                ${appointment.room}
            </span>

        </div>

    `;

    showModal(
        "confirmModal"
    );

}

document
    .getElementById(
        "confirmCheckInBtn"
    )
    .addEventListener(
        "click",
        confirmCheckIn
    );

function confirmCheckIn() {

    if (!selectedAppointment) {
        return;
    }

    selectedAppointment.checkedIn = true;

    const checkInData = {

        patientId:
            selectedAppointment.id,

        patientName:
            selectedAppointment.patientName,

        uhid:
            selectedAppointment.uhid,

        doctor:
            selectedAppointment.doctor,

        department:
            selectedAppointment.department,

        room:
            selectedAppointment.room,

        appointmentTime:
            selectedAppointment.appointmentTime,

        checkInTime:
            getCurrentTime(),

        checkInDate:
            getCurrentDate()

    };

    localStorage.setItem(
        "currentCheckIn",
        JSON.stringify(
            checkInData
        )
    );

    closeModal(
        "confirmModal"
    );

    openSuccessModal(
        selectedAppointment
    );

}

function openSuccessModal(
    appointment
) {

    document.getElementById(
        "successDetails"
    ).innerHTML = `

        <div class="detail-row">

            <span>
                Patient Name
            </span>

            <span>
                ${appointment.patientName}
            </span>

        </div>

        <div class="detail-row">

            <span>
                UHID
            </span>

            <span>
                ${appointment.uhid}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Doctor
            </span>

            <span>
                ${appointment.doctor}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Appointment Time
            </span>

            <span>
                ${appointment.appointmentTime}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Room Number
            </span>

            <span>
                ${appointment.room}
            </span>

        </div>

        <div class="detail-row">

            <span>
                Check-In Time
            </span>

            <span>
                ${getCurrentTime()}
            </span>

        </div>

    `;

    showModal(
        "successModal"
    );

}

document
    .getElementById(
        "viewQueueBtn"
    )
    .addEventListener(
        "click",
        viewQueue
    );

function viewQueue() {

    if (!selectedAppointment) {
        return;
    }

    localStorage.setItem(
        "selectedDoctor",
        selectedAppointment.doctor
    );

    window.location.href =
        "doctor-queue.html?doctor=" +
        encodeURIComponent(
            selectedAppointment.doctor
        );

}

document
    .getElementById(
        "doneBtn"
    )
    .addEventListener(
        "click",
        function() {

            closeModal(
                "successModal"
            );

            selectedAppointment =
                null;

            document.getElementById(
                "checkInBtn"
            ).disabled = true;

        }
    );

function showModal(
    id
) {

    document
        .getElementById(id)
        .classList.add("show");

}

function closeModal(
    id
) {

    document
        .getElementById(id)
        .classList.remove("show");

}

function setupModalEvents() {

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function() {

                        closeModal(
                            this.dataset.close
                        );

                    }
                );

            }
        );

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            modal => {

                modal.addEventListener(
                    "click",
                    function(event) {

                        if (
                            event.target ===
                            modal
                        ) {

                            closeModal(
                                modal.id
                            );

                        }

                    }
                );

            }
        );

}

function getCurrentTime() {

    return new Date().toLocaleTimeString(
        "en-IN",
        {
            hour:"2-digit",
            minute:"2-digit",
            hour12:true
        }
    );

}

function getCurrentDate() {

    return new Date().toLocaleDateString(
        "en-IN"
    );

}