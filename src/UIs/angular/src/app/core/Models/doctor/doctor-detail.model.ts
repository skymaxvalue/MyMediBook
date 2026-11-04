export interface DoctorProfileModel {
  associateId: number;
  name: string;
  degree: string | null;
  image: string | null;
  department: string;
  designationName: string | null;
  fromTime: string | null;
  toTime: string | null;
  fromDate: string | null;
  toDate: string | null;
  availableWeekDays: string[];
}

export interface DoctorSpeciality {
  specialityId: number;
  category: string;
  doctors: DoctorProfileModel[];
}

export interface DoctorSpecialityResponse {
  data: DoctorSpeciality[];
  statusMessage: string;
  statusCode: number;
  result: number;
  tokenKey: string | null;
  refreshToken: string | null;
}
