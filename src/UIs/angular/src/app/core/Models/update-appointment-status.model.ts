export interface UpdateAppointmentCheckInRequestModel {
  AppointmentId: number;
  IsCheckedIn: boolean;
}

export interface UpdateConsultationStatusRequestModel {
  AppointmentId: number;
  ConsultationStatusId: number;
}
