import { UPDATE } from "@ngrx/store"

export const APIEndpoints = {
    DOCTOR_LIST: "Doctor/GetDoctorList",
    GET_DOCTOR_AVAILABILITIES_BY_DOCTOR_ID: "Doctor/GetDoctorAvailabilities/",
    GET_DEPARTMENT: "Department/GetDepartmentList",
    GET_ALL_SPECIALITYLIST: "Doctor/GetDoctorSpecialityList",
    GET_TIME_SLOTE_BYDOCTOR_ID: "Doctor/GetDoctorTimeSlotById",
    GET_ROLES: "Role/GetRoleList",
    GET_DASHBOARD_DATA: "Dashboard/Receptionist/GetDashboardSummary",
    GET_DASHBOARD_DATA_FOR_DOCTOR: "Dashboard/Receptionist/GetRecentPatientList",
    GET_DASHBOARD_DATA_FOR_RECEPTIONIST: "Dashboard/Receptionist/GetPatientQueueList",
    APPOINTMENT_STATUS_KEY: "Master/GetStatusKeyList",


}
export const MedicineOrderEndPoints = {
    GET_MEDICINE_OF_PATIENT: "RxOrder/GetRxOrderByPatientProfileId"
}

export const AppointmentApiEndPoint = {
    CANCEL_MY_APPOINTMENT: "Appointment/CancelAppointmentById",
    RESCHEULE_MY_APPOINTMENT: "Appointment/UpdateAppointmentSchedule",
    CREATE_APPOINTMENT: "Appointment/CreateAppointment",
    GET_AVAILABLE_APPOINTMENTS: "Appointment/GetAvailableAppointments",
    GET_MYAPPOINTMENTS_BY_PATIONT_ID: "Appointment/Patient/GetMyAppointmentList/",
    GET_APPOINTMENT_LIST_BY_ASSOCIATE_LIST: "Appointment/Doctor/GetMyAppointmentList/"
}
export const PatientApiEndPoint = {
    UPDATE_PATIONT_DTAILS: "Patient/UpdatePatientDetails",
    GET_PROFILE_BASED_ON_PATIENT: "Patient/GetPatientProfileListById/",
    GET_PROFILE_BASED_ON_PROFILEID: "Patient/GetPatientProfileByProfileId/",
    GET_PATIENT_PROFILE_BY_ID: "Patient/GetPatientById/",
}

export const AssociateApiEndPoint = {
    GET_ASSOCIATE_LIST: "Associate/GetAssociateList",
    CREATE_SCHEDULE_ASSOCIATE: "Associate/CreateAssociateSchedule",
    GET_ASSOCIATE_BY_ITS_ID: "Associate/GetAssociatebyId/",
    UPDATE_ASSOCIATE_BY_ITS_ID: "Associate/UpdateAssociateDetail",
    DELETE_ASSOCIATE_BY_ITS_ID: "Associate/DeleteAssociate"
}
export const LabResult = {
    CREATE_LAB_REPORT: "Lab/CreateLabResult",
    GET_LAB_RESULT_BY_DETAILS_ID: "Lab/GetLabResultDetailById/",
    GET_LAB_RESULT_BY_PATIENT_ID: "Lab/GetLabResultsByPatientId/",
    GET_LCB_RESULT_BY_PROFILE_ID: "Lab/GetLabResultsByProfileId/"
}
export const BillingAPiEndPoints = {
    GET_ALL_BILSS_BY_BILL_ID: "Billing/GetBillsById{id}",
    GET_ALL_BILL_BY_PATIENT_ID: "Billing/GetBillsByPatientId/"

}


export const LocationAPIEndPoint = {
    GET_COUNTRIES: "Location/GetCountriesList",
    GET_STAETES: "Location/GetStatesByCountryList/",
    GET_CITIES: "Location/GetCitiesByStateList/",
}
export const MasterAPIEndPoints = {
    GET_SECURITY_QUESTIONS: "Master/GetSecurityQuestionList",
    GET_RELATIONSHIP_TYPE: "Master/GetRelationTypeList",
    GET_ROLE_SPECIALITY_AVAILABITY: "Master/GetRoleDepartmentSpecialityList",
    GET_DAYS_OF_WEEKEND: "Master/GetWeekDaysList",
    GET_AGE_TYPE: "Master/GetAgeTypeList",

}
export const MessageEndPoints = {
    GET_MESSAGE_BY_ITS_ID: "Message/MessageListById/",
    UPDATE_MESSAGE_BY_ID: "Message/UpdateMessageToRead"

}
export const AuthEndPoints = {
    PATIENT_REGISTER: "Auth/CreatePatientAccount",
    REQUEST_OTP: "Auth/RequestOtp",
    VERIFY_OTP: "Auth/VerifyForgotPasswordOtp",
    REFRESH_TOKEN: "Auth/RefreshToken",
    REGISTER_ASSOCIATION: "Auth/RegisterAssociate",
    FORGET_PASSWORD_RESETL: "Auth/ResetForgotPassword",
    RESET_PASS_FOR_ASSOCIATE: "Auth/ResetAssociatePassword",
    doLOGIN: "Auth/doLogin",
}

export const cancelRules = [
    {
        type: 'success',
        title: 'Free cancellation',
        description: 'Up to 24 hours before your appointment.'
    },
    {
        type: 'warning',
        title: 'Late cancellation fee may apply',
        description: 'If cancelled within 24 hours, a cancellation fee may apply.'
    },
    {
        type: 'danger',
        title: 'Cannot cancel after start time',
        description: 'Once the appointment has started, cancellation is not allowed.'
    }
];

export const rescheduleRules = [
    {
        type: 'success',
        title: 'Free rescheduling',
        description: 'Up to 24 hours before your appointment.'
    },
    {
        type: 'warning',
        title: 'Late reschedule fee may apply',
        description: 'If requested within 24 hours, a fee may apply.'
    },
    {
        type: 'info',
        title: 'Maximum of 2 reschedules',
        description: 'Each appointment can only be rescheduled twice.'
    },
    {
        type: 'danger',
        title: 'Cannot reschedule after start time',
        description: 'Once the appointment has started, rescheduling is not allowed.'
    }
];

export interface ConfirmationModalConfig {
    type: 'cancel' | 'reschedule';


    title: string;
    subTitle: string;

    confirmTitle: string;
    confirmText: string;

    confirmButton?: string;
    cancelButton: string;

    appointment: any;


    disableConfirm?: boolean;
    infoMessage?: string;
    displayRules: any[]
}

export interface ModalRule {
    title: string;
    description: string;
    type: 'success' | 'warning' | 'danger' | 'info';
}
export interface ModalResult {
    confirmed: boolean;
}