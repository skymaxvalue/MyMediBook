import { createActionGroup, emptyProps, props } from "@ngrx/store";
import {
  DraftResult,
  Patient,
  PatientDetails,
  PatientSearchCriteria,
  Physician,
  RefillRequestPayload,
  RefillResult,
} from "../prescription-refill.models/Model";

export const PrescriptionRefillActions = createActionGroup({
  source: "Prescription Refill",
  events: {
    "Search Patients": props<{ criteria: PatientSearchCriteria }>(),
    "Search Patients Success": props<{ patients: Patient[] }>(),
    "Search Patients Failure": props<{ error: string }>(),
    "Clear Search": emptyProps(),

    "Select Patient": props<{ patientId: string }>(),
    "Load Patient Details Success": props<{ details: PatientDetails }>(),
    "Load Patient Details Failure": props<{ error: string }>(),

    "Load Physicians": emptyProps(),
    "Load Physicians Success": props<{ physicians: Physician[] }>(),
    "Load Physicians Failure": props<{ error: string }>(),

    "Submit Refill": props<{ payload: RefillRequestPayload }>(),
    "Submit Refill Success": props<{ result: RefillResult }>(),
    "Submit Refill Failure": props<{ error: string }>(),

    "Save Draft": props<{ payload: Partial<RefillRequestPayload> }>(),
    "Save Draft Success": props<{ result: DraftResult }>(),
    "Save Draft Failure": props<{ error: string }>(),

    "Clear Results": emptyProps(),
    "Reset Form": emptyProps(),
  },
});
