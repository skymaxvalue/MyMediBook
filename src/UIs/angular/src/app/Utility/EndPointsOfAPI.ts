export const APIEndpoints = {
    PATIENT_REGISTER: "Patient/CreatePatientDetails",
    LOGIN: "Patient/LoginPatient",
    REQUEST_OTP: "Auth/RequestOtp",
    VERIFY_OTP: "Auth/VerifyOtp",
    GET_AVAILABLE_APPOINTMENTS: "Appointment/GetAvailableAppointments",
    GET_SPECIALITIES: "Appointment/GetSpecialities",
    GET_MYAPPOINTMENTS_BY_PATIONT_ID: "Appointment/GetMyAppointments",
    GET_DOCTOR_AVAILABILITIES_BY_DOCTOR_ID: "Doctor/GetDoctorAvailabilities/",
    GET_SECURITY_QUESTIONS: "Auth/GetSecurityQuestionMaster",
    GET_COUNTRIES: "Location/GetCountriesList",
    GET_STAETES: "Location/GetStatesByCountryList/",
    GET_CITIES: "Location/GetCitiesByStateList/",
    GET_PATIENT_PROFILE_BY_ID: "Patient/GetPatientById/",
    UPDATE_PATIONT_DTAILS: "Patient/UpdatePatientDetails"

}