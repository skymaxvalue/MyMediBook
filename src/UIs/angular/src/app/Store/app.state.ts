import { AppointmentState } from "./Appointments/appointment.reducer";
import { AuthState } from "./Auth/auth.reducer";
import { billsState } from "./Billing/billing.state";
import { CommonState } from "./Common/common.reducer";
import { DoctorSpecialityState } from "./Doctor/doctor.state";
import { FrontOfficeState } from "./Front-Office/front-office.reducer";
import { labResultState } from "./Lab-Results/lab-result.state";
import { MasterState } from "./Master/master.reducer";
import { MessageState } from "./Messages/messages.state";
import { PatientState } from "./Patient/patient.state";

export interface AppState {
  auth: AuthState;
  patient: PatientState;
  appointment: AppointmentState;
  doctor: DoctorSpecialityState;
  labresult: labResultState;
  bills: billsState;
  message: MessageState;
  master: MasterState;
  frontOffice: FrontOfficeState;
  common: CommonState;
}
