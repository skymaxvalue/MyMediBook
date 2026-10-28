import { createAction, props } from "@ngrx/store";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../core/Models/common/search-patient.model";

export const searchByFromAndEndDate = createAction(
  "[Common] Select Filter By From And End Date",
  props<{ fromDate: string; endDate: string }>()
);
export const searchByName = createAction("[Common] Search By Name", props<{ name: string }>());
export const searchByPhoneNumber = createAction(
  "[Common] Search By Phone Number",
  props<{ phoneNumber: number }>()
);
export const searchByDOB = createAction("[Common] Search By DOB", props<{ DOB: string }>());

export const searchPatients = createAction(
  "[Common] Search Patients",
  props<{ payload: ISearchPatientRequestModel }>()
);
export const searchPatientsSuccess = createAction(
  "[Common] Search Patients Success",
  props<{ response: ISearchPatientResponseModel[] }>()
);
export const searchPatientsFailure = createAction(
  "[Common] Search Patients Failure",
  props<{ error: any }>()
);

export const clearPatientSearch = createAction("[Common] Clear Patient Search");
