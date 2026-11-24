import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DialogRef } from "@angular/cdk/dialog";
import {
  ISearchPatientResponseModel,
  ISearchPatientRequestModel,
} from "../../../../core/Models/common/search-patient.model";
import { LoadStatus } from "../../../../utils/enum/load-status.enum";
import { CommonFacade } from "../../../../Store/Common/common.facade";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-patient-selection-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./patient-selection-dialog.component.html",
  styleUrl: "./patient-selection-dialog.component.css",
})
export class PatientSelectionDialogComponent {
  private readonly commonFacade = inject(CommonFacade);
  private readonly dialogRef = inject(DialogRef<ISearchPatientResponseModel | null>);

  patients$ = this.commonFacade.searchedPatient$;
  loading$ = this.commonFacade.patientSearchLoadingStatus$;
  readonly LoadStatus = LoadStatus;

  searchName = "";
  searchDob = "";
  selectedPatient: ISearchPatientResponseModel | null = null;

  constructor() {}

  filterPatients(list: ISearchPatientResponseModel[]): ISearchPatientResponseModel[] {
    const tokens = this.searchName.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const dob = this.searchDob; // yyyy-MM-dd from <input type="date">

    return list.filter((p) => {
      const name = (p.fullName ?? "").toLowerCase();
      const nameOk = tokens.every((t) => name.includes(t));
      const dobOk = !dob || (p.dateOfBirth ?? "").substring(0, 10) === dob;
      return nameOk && dobOk;
    });
  }

  onFilterChange(): void {
    this.selectedPatient = null; // avoid confirming a patient that is no longer visible
  }
  
  selectPatient(patient: ISearchPatientResponseModel): void {
    this.selectedPatient = patient;
  }

  confirmSelection(): void {
    if (this.selectedPatient) this.dialogRef.close(this.selectedPatient);
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
