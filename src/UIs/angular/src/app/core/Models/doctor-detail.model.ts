export interface DoctorSpeciality {
    specialityId: number;
    specialityName: string;
    departmentName: string;
    doctorName: string;
    doctorId: number;
}

export interface DoctorSpecialityResponse {
    data: DoctorSpeciality[];
    statusMessage: string;
    statusCode: number;
    result: number;
    tokenKey: string | null;
}

export interface DoctorProfileModel {
  associateId: number;
  name: string;
  degree: string;
  image: string;
  department: string;
  designationName: string;
  fromTime: string;
  toTime: string;
  fromDate: string;
  toDate: string;
  availableWeekDays: string[];
}
