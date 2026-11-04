import { Injectable } from "@angular/core";
import { Observable, delay, map, of, throwError } from "rxjs";
import {
  DraftResult,
  Patient,
  PatientDetails,
  PatientSearchCriteria,
  Physician,
  RefillRequestPayload,
  RefillResult,
} from "../prescription-refill.models/Model";

/**
 * Mock API. Swap the bodies for HttpClient calls; the effects don't change.
 */
const PATIENTS: Patient[] = [
  {
    id: "p1",
    firstName: "Emily",
    lastName: "Carter",
    dob: "1985-04-12",
    gender: "Female",
    mrn: "MRN-204518",
    mobile: "(555) 201-4432",
    email: "emily.carter@example.com",
    address1: "1428 Maple Avenue",
    address2: "Suite 48",
    city: "Austin",
    state: "TX",
    postal: "78701",
  },
  {
    id: "p2",
    firstName: "Daniel",
    lastName: "Carter",
    dob: "1972-11-03",
    gender: "Male",
    mrn: "MRN-118342",
    mobile: "(555) 330-7781",
    email: "",
    address1: "77 Lakeview Drive",
    address2: "",
    city: "Dallas",
    state: "TX",
    postal: "75201",
  },
  {
    id: "p3",
    firstName: "Priya",
    lastName: "Sharma",
    dob: "1990-07-21",
    gender: "Female",
    mrn: "MRN-392004",
    mobile: "(555) 908-1120",
    email: "priya.s@example.com",
    address1: "9 Ridge Road",
    address2: "",
    city: "Denver",
    state: "CO",
    postal: "80202",
  },
];

const PHYSICIANS: Physician[] = [
  { id: "d1", name: "Dr. Sarah Johnson", department: "Internal Medicine", phone: "(555) 410-2200" },
  { id: "d2", name: "Dr. Michael Chen", department: "Cardiology", phone: "(555) 410-2301" },
  { id: "d3", name: "Dr. Aisha Rahman", department: "Endocrinology", phone: "(555) 410-2442" },
];

const MEDS: PatientDetails["medications"] = [
  {
    id: "m1",
    name: "Metformin",
    drugClass: "Biguanide",
    strength: "500 mg",
    form: "Tablet",
    directions: "Take 1 tablet twice daily with meals",
    lastFilled: "2026-09-28",
    refillsRemaining: 2,
    status: "Active",
    pharmacy: "Health Haven Pharmacy",
  },
  {
    id: "m2",
    name: "Lisinopril",
    drugClass: "ACE inhibitor",
    strength: "10 mg",
    form: "Tablet",
    directions: "Take 1 tablet once daily",
    lastFilled: "2026-09-15",
    refillsRemaining: 0,
    status: "Active",
    pharmacy: "Health Haven Pharmacy",
  },
  {
    id: "m3",
    name: "Atorvastatin",
    drugClass: "Statin",
    strength: "20 mg",
    form: "Tablet",
    directions: "Take 1 tablet at bedtime",
    lastFilled: "2026-10-02",
    refillsRemaining: 5,
    status: "Active",
    pharmacy: "Health Haven Pharmacy",
  },
  {
    id: "m4",
    name: "Ibuprofen",
    drugClass: "NSAID",
    strength: "400 mg",
    form: "Tablet",
    directions: "As needed",
    lastFilled: "2026-03-01",
    refillsRemaining: 0,
    status: "Inactive",
    pharmacy: "Health Haven Pharmacy",
  },
];

const digits = (v: string) => v.replace(/\D/g, "");

@Injectable({ providedIn: "root" })
export class PrescriptionRefillApiService {
  searchPatients(c: PatientSearchCriteria): Observable<Patient[]> {
    const last = c.lastName.trim().toLowerCase();
    const mobile = digits(c.mobile);
    const matches = PATIENTS.filter((p) => {
      const byName = !last || p.lastName.toLowerCase().includes(last);
      const byMobile = !mobile || digits(p.mobile).includes(mobile);
      const byDob = !c.dob || p.dob === c.dob;
      // "OR" semantics between last name and mobile; DOB narrows either.
      const identity = last && mobile ? byName || byMobile : byName && byMobile;
      return identity && byDob;
    });
    return of(matches).pipe(delay(350));
  }

  getPatientDetails(patientId: string): Observable<PatientDetails> {
    const patient = PATIENTS.find((p) => p.id === patientId);
    if (!patient) return throwError(() => new Error("Patient not found"));
    return of<PatientDetails>({
      patient,
      medications: MEDS,
      preferredPharmacyId: "hhp",
      clinical: {
        lastVisit: "2026-09-10",
        physicianId: "d1",
        diagnosis: ["Type 2 diabetes mellitus", "Essential hypertension"],
        monitoring: ["HbA1c every 3 months", "BP at each visit"],
      },
    }).pipe(delay(300));
  }

  getPhysicians(): Observable<Physician[]> {
    return of(PHYSICIANS).pipe(delay(150));
  }

  submitRefill(p: RefillRequestPayload): Observable<RefillResult> {
    return of(p).pipe(
      delay(600),
      map((req) => ({
        id: `RF-${Date.now().toString().slice(-6)}`,
        status: "Pending Review",
        patientName: req.patientName,
        medications: req.medicationNames,
        pharmacy: req.pharmacyName,
      }))
    );
  }

  saveDraft(_p: Partial<RefillRequestPayload>): Observable<DraftResult> {
    return of({ id: `DR-${Date.now().toString().slice(-6)}`, status: "Draft" }).pipe(delay(300));
  }
}
