export interface ISearchPatientRequestModel {
  name: string | null;
  dob: string | null;
  mobileNo: number | null;
  fromDate: string;
  toDate: string;
}

export interface ISearchPatientResponseModel {
  profileId: number;
  patientId: number;
  appointmentId: number;
  doctorId: number;
  doctorName: number;
  speciality: string;
  appointmentDate: string;
  appointmentDay: string;
  appointmentStatus: string;
  slotStartTime: string;
  slotEndTime: string;
  isCheckedIn: number;
  checkedInAt: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  age: number;
  ageTypeId: number;
  ageTypeName: string | null;
  gender: string | null;
  email: string | null;
  phoneNumber: string | null;
  relationTypeId: number;
  relationTypeName: string | null;
  isActive: boolean;
  createdDate: string;
  updatedDate: string | null;
  isSuccess: number;
  status: number;
  responseMessage: string;
}
