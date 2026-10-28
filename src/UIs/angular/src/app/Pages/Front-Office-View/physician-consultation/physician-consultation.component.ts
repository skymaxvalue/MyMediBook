import { ChangeDetectionStrategy, Component } from "@angular/core";

interface Medication {
  id: number;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  indication: string;
  takingStatus: string;
  notes: string;
}

@Component({
  selector: "app-physician-consultation",
  standalone: true,
  imports: [],
  templateUrl: "./physician-consultation.component.html",
  styleUrl: "./physician-consultation.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicianConsultationComponent {
  currentStep = 1;
  painLevel: number | null = null;
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
  specialties = [
    { value: "Cardiology", icon: "♡" },
    { value: "Neurology", icon: "◉" },
    { value: "Orthopedics", icon: "✚" },
    { value: "Pulmonology", icon: "◌" },
    { value: "Ophthalmology", icon: "◉" },
    { value: "Endocrinology", icon: "+" },
    { value: "Surgery", icon: "✚" },
    { value: "Psychiatry", icon: "○" },
    { value: "Nephrology", icon: "♢" },
    { value: "Oncology", icon: "+" },
  ];

  private nextMedicationId = 2;
  medications: Medication[] = [
    {
      id: 1,
      name: "",
      dose: "",
      route: "",
      frequency: "",
      indication: "",
      takingStatus: "",
      notes: "",
    },
  ];

  patientType: "existing" | "new" = "existing";

  accountHolder: "self" | "other" | null = null;
  rpState: "search" | "found" | "notFound" | "linked" = "search";

  onAccountHolderChange(value: "self" | "other") {
    this.accountHolder = value;
    this.rpState = "search"; 
  }

  onPatientTypeChange(type: "existing" | "new"): void {
    this.patientType = type;
  }

  selectSpecialty(specialty: string): void {
    this.selectedSpecialty = specialty;
  }

  selectAllergy(status: string): void {
    this.allergyStatus = status;
  }

  selectUrgency(value: string): void {
    this.urgency = value;
  }

  addMedication(): void {
    this.medications = [
      ...this.medications,
      {
        id: this.nextMedicationId++,
        name: "",
        dose: "",
        route: "",
        frequency: "",
        indication: "",
        takingStatus: "",
        notes: "",
      },
    ];
  }

  removeMedication(id: number): void {
    this.medications = this.medications.filter((medication) => medication.id !== id);
  }

  updateMedication(
    id: number,
    field: "name" | "dose" | "route" | "frequency" | "indication" | "takingStatus" | "notes",
    value: string
  ): void {
    this.medications = this.medications.map((medication) =>
      medication.id === id ? { ...medication, [field]: value } : medication
    );
  }

  toggleNoMedications(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.noMedications = checked;

    if (checked) {
      this.medications = [];
    } else if (this.medications.length === 0) {
      this.addMedication();
    }
  }

  selectPainLevel(level: number): void {
    this.painLevel = level;
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 5) this.currentStep = step;
  }

  nextStep(): void {
    if (this.currentStep < 5) this.currentStep++;
  }

  previousStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  searchPatientRequest() {}
}
