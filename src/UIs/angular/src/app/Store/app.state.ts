import { AppointmentState } from "./Appointments/appointment.state";
import { AuthState } from "./Auth/auth.state";
import { DoctorSpecialityState } from "./Doctor/doctor.state";
import { PatientState } from "./Patient/patient.state";

export interface AppState {
    auth: AuthState;
    patient: PatientState;
    appointment: AppointmentState;
    doctor: DoctorSpecialityState;
}