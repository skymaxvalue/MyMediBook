import { AuthState } from "./Auth/auth.state";
import { PatientState } from "./Patient/patient.state";

export interface AppState {
    auth: AuthState;
    patient: PatientState
}