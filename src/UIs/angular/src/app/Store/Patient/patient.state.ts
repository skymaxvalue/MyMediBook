import { PatientRegister } from "../../Models/Patient-Model"


export interface PatientState {
    patientDetails: PatientRegister | null;
    error: any,
    isLoading: boolean;
    myappintments: any[];
    updatedPatient: any;
    patientProfiles: any[];
    patientProfileData: any;

}

export const initialAuthState: PatientState = {
    patientDetails: null,
    error: null,
    isLoading: false,
    myappintments: [],
    updatedPatient: null,
    patientProfiles: [],
    patientProfileData: null

}