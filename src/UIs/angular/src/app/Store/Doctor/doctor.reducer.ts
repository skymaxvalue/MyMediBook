import { createReducer, on } from "@ngrx/store";
import * as DoctorSpecialityActions from "./doctor.action";
import { DoctorSpeciality } from "../../core/Models/doctor/doctor-detail.model";
import { IDoctorTimeSlotModel } from "../../core/Models/doctor/doctor-time-slots.model";

export const DOCTOR_FEATURE_KEY = "doctor";

export interface DoctorState {
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
  doctorTimeSlotList: IDoctorTimeSlotModel[];
  accociateDetails: any;
  updatedAssociate: any;
  doctorList: DoctorSpeciality[];
}

export const initialState: DoctorState = {
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
  doctorTimeSlotList: [],
  accociateDetails: null,
  updatedAssociate: null,
  doctorList: [],
};

export const doctorSpecialityReducer = createReducer(
  initialState,

  on(DoctorSpecialityActions.loadDoctorSpecialities, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.loadDoctorSpecialitiesSuccess, (state, { response }) => ({
    ...state,
    doctorList: response,
    isLoading: false,
    error: null,
  })),

  on(DoctorSpecialityActions.loadDoctorSpecialitiesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.loadAllSpecialities, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.loadAllSpecialitiesSuccess, (state, { allSpeciality }) => ({
    ...state,
    allSpeciality,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.loadAllSpecialitiesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.loadAllDepartments, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.loadAllDepartmentsSuccess, (state, { allDepartments }) => ({
    ...state,
    allDepartments,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.loadAllDepartmentsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.loadAllRoles, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.loadAllRolesSuccess, (state, { allRoles }) => ({
    ...state,
    allRoles,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.loadAllRolesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.registerAssociotion, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.registerAssociotionSuccess, (state, { associate }) => ({
    ...state,
    registerassociate: associate,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.registerAssociotionFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.getRoleDepaSpecia, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.getRoleDepaSpeciaSuccess, (state, { allRoleDepartSpeci }) => ({
    ...state,
    allRoleDepartSpeci: allRoleDepartSpeci,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getRoleDepaSpeciaFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getWeekDays, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.getWeekDaysSuccess, (state, { weeakDays }) => ({
    ...state,
    weeakDays: weeakDays,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getWeekDaysFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.getAllAssociates, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.getAllAssociatesSuccess, (state, { allAssociates }) => ({
    ...state,
    allAssociates: allAssociates,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getAllAssociatesFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.getAssociatesByID, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.getAssociatesByIDSuccess, (state, { accociateDetails }) => ({
    ...state,
    accociateDetails: accociateDetails,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getAssociatesByIDFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.createAssociatesSchedule, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.createAssociatesScheduleSuccess, (state, { associateSchedule }) => ({
    ...state,
    associateSchedule: associateSchedule,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.createAssociatesScheduleFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.getTimeSloteByDoctorID, (state) => ({
    ...state,
    isLoading: true,
    doctorTimeSlotList: [],
    error: null,
  })),

  on(DoctorSpecialityActions.getTimeSloteByDoctorIDSuccess, (state, { response }) => ({
    ...state,
    doctorTimeSlotList: response,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.getTimeSloteByDoctorIDFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false,
    doctorTimeSlotList: [],
  })),
  on(DoctorSpecialityActions.updateAssociatesAndItsSchedule, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    DoctorSpecialityActions.updateAssociatesAndItsScheduleSuccess,
    (state, { updatedAssociate }) => ({
      ...state,
      updatedAssociate: updatedAssociate,
      isLoading: false,
    })
  ),

  on(DoctorSpecialityActions.updateAssociatesAndItsScheduleFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(DoctorSpecialityActions.deleteAssociatesAndItsSchedule, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(DoctorSpecialityActions.deleteAssociatesAndItsScheduleSuccess, (state, { associate }) => ({
    ...state,
    associate: associate,
    isLoading: false,
  })),

  on(DoctorSpecialityActions.deleteAssociatesAndItsScheduleFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
