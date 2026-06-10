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