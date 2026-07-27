export interface DoctorSpecialityState {
    specialities: any[];
    isLoading: boolean;
    error: any;
    allSpeciality: any[];
    allDepartments: any[];
    allRoles: any[];
    registerassociate: any;
    allRoleDepartSpeci: any[];
    weeakDays: any[];
    allAssociates: any[];
    associateSchedule: any;
    doctorTimeSlot: any[];
    accociateDetails: any;


}

export const initialState: DoctorSpecialityState = {
    specialities: [],
    isLoading: false,
    error: null,
    allSpeciality: [],
    allDepartments: [],
    allRoles: [],
    registerassociate: null,
    allRoleDepartSpeci: [],
    weeakDays: [],
    allAssociates: [],
    associateSchedule: null,
    doctorTimeSlot: [],
    accociateDetails: null

};