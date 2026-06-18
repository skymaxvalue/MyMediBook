export interface DoctorSpecialityState {
    specialities: any[];
    isLoading: boolean;
    error: any;
    allSpeciality: any[];
    allDepartments: any[];
    allRoles: any[]
}

export const initialState: DoctorSpecialityState = {
    specialities: [],
    isLoading: false,
    error: null,
    allSpeciality: [],
    allDepartments: [],
    allRoles: []

};