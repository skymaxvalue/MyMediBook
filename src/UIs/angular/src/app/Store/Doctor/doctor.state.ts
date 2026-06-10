export interface DoctorSpecialityState {
    specialities: any[];
    isLoading: boolean;
    error: any;
}

export const initialState: DoctorSpecialityState = {
    specialities: [],
    isLoading: false,
    error: null
};