import { DoctorProfileModel } from "../doctor-detail.model";
import { InsuranceData, PaymentData } from "./appointment.model";

export interface AppointmentDetailModel {
  appointmentId: number;
  patientId: number;
  profileId: number;
  slotId: number;

  patientName: string;
  dateOfBirth: string;
  patientEmail: string;
  phoneNumber: string;
  gender: string;
  relationType: string;

  slotDate: string;
  slotDay: string;
  slotStartTime: string;
  slotEndTime: string;

  appointmentStatus: string;
  visitPurpose: string;
  visitType: string;
  otpMethod: string;
  createdDate: string;

  insurance: boolean | null;
  isCheckedIn: boolean | null;
  checkedInAt: Date | null;
  consultationStatusId: number | null;

  doctorProfile: DoctorProfileModel | null;
  insuranceData: InsuranceData | null;
  paymentData: PaymentData | null;

  isSuccess: number;
  status: number;
  responseMessage: string;
}
