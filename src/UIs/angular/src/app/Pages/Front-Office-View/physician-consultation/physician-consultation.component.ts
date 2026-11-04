import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";

import {
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";

import { Subject } from "rxjs";
import { distinctUntilChanged, filter, map, takeUntil, tap } from "rxjs/operators";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../../core/Models/common/search-patient.model";
import { CommonFacade } from "../../../Store/Common/common.facade";
import { SharedPatientSearchComponent } from "../../../shared/Components/shared-patient-search/shared-patient-search.component";
import { LoadStatus } from "../../../utils/enum/load-status.enum";
import { AsyncPipe, NgFor } from "@angular/common";
import { DoctorFacade } from "../../../Store/Doctor/doctor.facade";
import { AuthFacade } from "../../../Store/Auth/auth.facade";
import {
  ICityModel,
  ICountryModel,
  IStateModel,
} from "../../../core/Models/location/location-master.model";
import { MasterFacade } from "../../../Store/Master/master.facade";
import { IRelationTypeModel } from "../../../core/Models/master/relation-type.model";
import { IOtpTypeModel } from "../../../core/Models/master/otp-type.model";
import { IStatusMaster } from "../../../core/Models/master/status-master.model";
import {
  DoctorProfileModel,
  DoctorSpeciality,
} from "../../../core/Models/doctor/doctor-detail.model";

@Component({
  selector: "app-physician-consultation",
  standalone: true,
  imports: [ReactiveFormsModule, SharedPatientSearchComponent, AsyncPipe],
  templateUrl: "./physician-consultation.component.html",
  styleUrl: "./physician-consultation.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicianConsultationComponent implements OnInit, OnDestroy {
  currentStep = 1;
  painLevel: number | null = null;
  destroy$ = new Subject<void>();
  painLevels: number[] = Array.from({ length: 11 }, (_, index) => index);
  noMedications = false;

  allergyOptions: string[] = ["No Known Allergies", "Allergies Present"];
  allergyStatus: string | null = null;

  urgency = "Routine";
  urgencies = [
    { value: "Routine", hint: "Standard" },
    { value: "Soon", hint: "Within days" },
    { value: "Urgent", hint: "Prompt care" },
    { value: "Emergency", hint: "Immediate" },
  ];

  selectedSpecialty = "";
  specialtyIcons: Record<string, string> = {
    Cardiology: "♡",
    Neurology: "◉",
    Orthopedics: "✚",
    Pulmonology: "◌",
    Ophthalmology: "◉",
    Endocrinology: "+",
    Surgery: "✚",
    Psychiatry: "○",
    Nephrology: "♢",
    Oncology: "+",
  };

  physicianList: DoctorSpeciality[] = [];
  filteredPhysicians: DoctorProfileModel[] = [];

  patientType: "existing" | "new" = "existing";
  accountHolder: "self" | "other" | null = null;

  rpState: "search" | "found" | "notFound" | "linked" = "search";
  consultationForm!: UntypedFormGroup;
  searchedPatients: ISearchPatientResponseModel[] = [];
  // isSearching: LoadStatus = LoadStatus.NotLoaded;
  selectedPatient: ISearchPatientResponseModel | null = null;

  patients$ = this.commonFacade.searchedPatient$;
  isSearching$ = this.commonFacade.patientSearchLoadingStatus$;
  LoadStatus = LoadStatus;
  countryList: ICountryModel[] = [];
  stateList: IStateModel[] = [];
  cityList: ICityModel[] = [];
  relationTypeList: IRelationTypeModel[] = [];
  otpTypeList: IOtpTypeModel[] = [];
  visitTypeList: IStatusMaster[] = [];
  visitPurposeList: IStatusMaster[] = [];
  specialties: { value: string; icon: string }[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private commonFacade: CommonFacade,
    private doctorFacade: DoctorFacade,
    private authFacade: AuthFacade,
    private masterFacade: MasterFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeMasterData();

    this.masterFacade.loadRelationTypeList();
    this.masterFacade.loadOtpTypeList();
    this.masterFacade.getStatusKeyList();
    this.doctorFacade.getDoctorList();
    this.authFacade.getCountries();

    // Country selected -> load states
    this.patientForm
      .get("address.country")
      ?.valueChanges.pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((countryId) => {
        this.patientForm.get("address")?.patchValue({ state: "", city: "" }, { emitEvent: false });
        this.stateList = [];
        this.cityList = [];
        this.authFacade.getStates(Number(countryId));
      });

    // State selected -> load cities
    this.patientForm
      .get("address.state")
      ?.valueChanges.pipe(
        filter((id) => !!id),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((stateId) => {
        this.patientForm.get("address")?.patchValue({ city: "" }, { emitEvent: false });
        this.cityList = [];
        this.authFacade.getCities(Number(stateId));
      });

    this.addMedication();
    this.subscribePhysicianList();
    this.historyForm
      .get("vitals.vitalHeight")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateBMI());

    this.historyForm
      .get("vitals.vitalWeight")
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateBMI());
  }

  subscribePhysicianList(): void {
    this.doctorFacade.getDoctorList$
      .pipe(
        takeUntil(this.destroy$),
        tap((data: DoctorSpeciality[]) => {
          this.physicianList = data ?? [];

          this.specialties = this.physicianList.map((specialty) => ({
            value: specialty.category,
            icon: this.specialtyIcons[specialty.category] ?? "✚",
          }));
        })
      )
      .subscribe();
  }

  subscribeMasterData() {
    // 1. Subscribe to the store streams first
    this.authFacade.selectCountry$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.countryList = data ?? [];
      console.log(this.countryList);
      this.cdr.markForCheck();
    });

    this.authFacade.selectState$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.stateList = data ?? [];
      this.cdr.markForCheck();
    });

    this.authFacade.selectCity$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.cityList = data ?? [];
      this.cdr.markForCheck();
    });
    this.masterFacade.getRelationsList$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.relationTypeList = data ?? [];
    });
    this.masterFacade.getOtpTypeList$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.otpTypeList = data ?? [];
    });
    this.masterFacade.statusKeyList$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const categories = data ?? [];

      this.visitTypeList = categories.find((x) => x.category === "VisitType")?.statuses ?? [];

      this.visitPurposeList = categories.find((x) => x.category === "VisitPurpose")?.statuses ?? [];
    });
  }

  initForm() {
    this.consultationForm = this.fb.group({
      // STEP 1: Patient Information
      patient: this.fb.group({
        patientType: ["existing"],
        selectedPatientId: [""],

        personalInfo: this.fb.group({
          firstName: [""],
          phone: [""],
          dateOfBirth: [""],
          gender: [""],
          email: [""],
          preferredLanguage: [""],
        }),

        account: this.fb.group({
          accountHolder: [""],
          accountHolderName: [""],
          relationToPatient: [""],
        }),

        address: this.fb.group({
          address: [""],
          country: [""],
          city: [""],
          state: [""],
          pinCode: [""],
        }),

        insurance: this.fb.group({
          provider: [""],
          policy: [""],
          coverageType: [""],
          insuranceCard: [null as File | null],
        }),

        emergencyContact: this.fb.group({
          emergencyName: [""],
          emergencyRelation: [""],
          emergencyPhone: [""],
          emergencyAlternatePhone: [""],
        }),

        communication: this.fb.group({
          contactMethod: [""],
          appointmentReminder: [""],
        }),

        pharmacy: this.fb.group({
          pharmacyName: [""],
          pharmacyPhone: [""],
          pharmacyAddress: [""],
        }),
      }),

      // STEP 2: Appointment Information
      appointment: this.fb.group({
        preferredDate: [""],
        preferredTime: [""],
        consultationMode: [""],
        visitType: [""],
        reasonForVisit: [""],
        referredBy: [""],

        specialty: [""],
        preferredPhysician: [""],
        referralSource: [""],
        appointmentNotes: [""],
      }),

      // STEP 3: Symptoms
      symptoms: this.fb.group({
        chiefComplaint: [""],
        symptomDuration: [""],
        symptomOnset: [""],

        hpi: this.fb.group({
          location: [""],
          quality: [""],
          severity: [""],
          pattern: [""],
          aggravating: [""],
          relieving: [""],
          progression: [""],
        }),

        associatedSymptoms: [[] as string[]],
        otherSymptoms: [""],

        painLevel: [null as number | null],
        urgency: ["Routine"],
      }),

      // STEP 4: Medical History
      history: this.fb.group({
        medical: this.fb.group({
          existingConditions: [""],
          previousDiagnoses: [""],
          chronicIllnesses: [""],
        }),

        surgical: this.fb.group({
          previousSurgeries: [""],
          surgicalProcedure: [""],
          surgeryDate: [""],
          surgeryNotes: [""],
        }),

        allergies: this.fb.group({
          allergyStatus: [""],
          drugAllergies: [""],
          foodAllergies: [""],
          otherAllergies: [""],
          allergyReaction: [""],
        }),

        noMedications: [false],
        medications: this.fb.array([]),

        vitals: this.fb.group({
          vitalBp: [""],
          vitalHr: [""],
          vitalTemp: [""],
          vitalRr: [""],
          vitalSpo2: [""],
          vitalHeight: [""],
          vitalWeight: [""],
          vitalBmi: [""],
        }),

        screening: this.fb.group({
          redFlags: [""],
          fallRisk: [""],
          mobilityAssist: [""],
          interpreterRequired: [""],
          pregnancyStatus: [""],
        }),

        familyHistory: [[] as string[]],

        lifestyle: this.fb.group({
          smoking: [""],
          alcohol: [""],
          exercise: [""],
          lifestyleNotes: [""],
        }),

        documents: this.fb.group({
          labReports: [[] as File[]],
          medicalReports: [[] as File[]],
        }),
      }),

      // STEP 5: Consent
      consent: this.fb.group({
        consentAccurate: [false],
        consentConsultation: [false],
        consentPrivacy: [false],
        consentTelemedicine: [false],
      }),
    });
  }

  private createMedicationGroup(): FormGroup {
    return this.fb.group({
      name: [""],
      dose: [""],
      route: [""],
      frequency: [""],
      indication: [""],
      takingStatus: [""],
      notes: [""],
    });
  }
  get medicationsArray(): FormArray {
    return this.consultationForm.get("history.medications") as FormArray;
  }

  get patientForm(): FormGroup {
    return this.consultationForm.get("patient") as FormGroup;
  }

  get appointmentForm(): FormGroup {
    return this.consultationForm.get("appointment") as FormGroup;
  }

  get symptomsForm(): FormGroup {
    return this.consultationForm.get("symptoms") as FormGroup;
  }

  get historyForm(): FormGroup {
    return this.consultationForm.get("history") as FormGroup;
  }

  get consentForm(): FormGroup {
    return this.consultationForm.get("consent") as FormGroup;
  }

  get accountForm(): FormGroup {
    return this.patientForm.get("account") as FormGroup;
  }

  onInsuranceCardChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.patientForm.get("insurance.insuranceCard")?.setValue(file);

    this.patientForm.get("insurance.insuranceCard")?.markAsDirty();
  }

  addMedication(): void {
    this.medicationsArray.push(this.createMedicationGroup());
  }

  removeMedication(index: number): void {
    this.medicationsArray.removeAt(index);
  }

  onAccountHolderChange(value: "self" | "other"): void {
    this.accountHolder = value;

    this.patientForm.get("account.accountHolder")?.setValue(value);
    this.patientForm.get("account.accountHolder")?.markAsDirty();

    this.rpState = "search";
  }

  onPatientTypeChange(type: "existing" | "new"): void {
    this.patientType = type;

    this.patientForm.get("patientType")?.setValue(type);
    this.patientForm.get("patientType")?.markAsDirty();

    if (type === "new") {
      this.patientForm.get("personalInfo")?.reset();
    }
  }

  onPatientSelected(patient: ISearchPatientResponseModel): void {
    this.selectedPatient = patient;

    // Explicitly keep the Existing Patient flow
    this.patientType = "existing";

    this.consultationForm.patchValue({
      patient: {
        selectedPatientId: patient.patientId,
        patientType: "existing",
        personalInfo: {
          firstName: patient.firstName ?? "",
          lastName: patient.lastName ?? "",
          phone: patient.phoneNumber ?? "",
          dateOfBirth: patient.dateOfBirth ?? "",
          gender: patient.gender ?? "",
          email: patient.email ?? "",
        },
      },
    });

    this.goToStep(1);
  }

  clearPatientSearch(): void {
    this.commonFacade.clearPatientSearch();
    this.searchedPatients = [];
    this.selectedPatient = null;
  }

  onSwitchPatientProfile(): void {
    const payload: ISearchPatientRequestModel = {
      name: null,
      dob: null,
      mobileNo: null,
      fromDate: null,
      toDate: null,
    };

    this.commonFacade.searchPatient(payload);
  }

  selectSpecialty(specialty: string): void {
    this.selectedSpecialty = specialty;

    // Update the form control
    this.appointmentForm.get("specialty")?.setValue(specialty);

    // Find the selected speciality from API response
    const selected = this.physicianList.find((s) => s.category === specialty);

    // Filter doctors belonging to that speciality
    this.filteredPhysicians = selected?.doctors ?? [];

    // Reset previously selected physician
    this.appointmentForm.get("preferredPhysician")?.reset("");
  }

  selectAllergy(status: string): void {
    this.allergyStatus = status;

    const control = this.historyForm.get("allergies.allergyStatus");
    control?.setValue(status);
    control?.markAsDirty();
  }

  selectUrgency(value: string): void {
    this.urgency = value;

    const control = this.symptomsForm.get("urgency");
    control?.setValue(value);
    control?.markAsDirty();
  }

  selectPainLevel(level: number): void {
    this.painLevel = level;

    const control = this.symptomsForm.get("painLevel");
    control?.setValue(level);
    control?.markAsDirty();
  }
  toggleNoMedications(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.noMedications = checked;

    const control = this.consultationForm.get("history.noMedications");
    control?.setValue(checked);
    control?.markAsDirty();

    if (checked) {
      this.medicationsArray.clear();
    } else if (this.medicationsArray.length === 0) {
      this.addMedication();
    }
  }

  goToStep(step: number): void {
    if (step < 1 || step > 5) return;

    this.currentStep = step;

    // When navigating to the Patient step,
    // don't reset an already selected patient.
    if (step === 1 && this.selectedPatient) {
      this.patientType = "existing";
    }
  }

  private calculateBMI(): void {
    const heightCm = Number(this.historyForm.get("vitals.vitalHeight")?.value);

    const weightKg = Number(this.historyForm.get("vitals.vitalWeight")?.value);

    const bmiControl = this.historyForm.get("vitals.vitalBmi");

    if (heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      const bmi = weightKg / (heightM * heightM);

      bmiControl?.setValue(bmi.toFixed(1), {
        emitEvent: false,
      });
    } else {
      bmiControl?.setValue("", {
        emitEvent: false,
      });
    }
  }

  nextStep(): void {
    if (this.currentStep < 5) this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  toggleArrayValue(controlPath: string, value: string, event: Event): void {
    const control = this.consultationForm.get(controlPath);
    const checkbox = event.target as HTMLInputElement;

    const currentValues: string[] = control?.value ?? [];

    const updatedValues = checkbox.checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value);

    control?.setValue(updatedValues);
    control?.markAsDirty();
  }

  onDocumentsChange(event: Event, controlName: "labReports" | "medicalReports"): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.consultationForm.get(`history.documents.${controlName}`)?.setValue(files);

    this.consultationForm.get(`history.documents.${controlName}`)?.markAsDirty();
  }

  saveDraft(): void {
    const draftData = this.consultationForm.getRawValue();

    console.log("Consultation Draft:", draftData);
  }

  searchPatientRequest(payload: ISearchPatientRequestModel): void {
    this.commonFacade.searchPatient(payload);
  }

  submitConsultation(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    const formData = this.consultationForm.getRawValue();

    console.log("Consultation Submitted:", formData);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
