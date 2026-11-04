import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Inject, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import {
  ISearchPatientResponseModel,
  ISearchPatientRequestModel,
} from "../../../../core/Models/common/search-patient.model";
import { LoadStatus } from "../../../../utils/enum/load-status.enum";

export interface PatientSelectionDialogData {
  patients: ISearchPatientResponseModel[];
}

@Component({
  selector: "app-patient-selection-dialog",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./patient-selection-dialog.component.html",
  styleUrl: "./patient-selection-dialog.component.css",
})
export class PatientSelectionDialogComponent {
  @Input() loading: LoadStatus = LoadStatus.NotLoaded;

  @Output() searchRequested = new EventEmitter<ISearchPatientRequestModel>();

  searchName = "";
  searchDob = "";

  selectedPatient: ISearchPatientResponseModel | null = null;

  LoadStatus = LoadStatus;

  constructor(
    public dialogRef: DialogRef<
      ISearchPatientResponseModel | null,
      PatientSelectionDialogComponent
    >,
    @Inject(DIALOG_DATA)
    public data: ISearchPatientResponseModel[]
  ) {}

  get searchPayload(): ISearchPatientRequestModel {
    return {
      name: this.searchName.trim() || null,
      dob: this.searchDob || null,
      mobileNo: null,
      fromDate: null,
      toDate: null,
    };
  }

  get patients(): ISearchPatientResponseModel[] {
    return this.data ?? [];
  }

  searchPatients(): void {
    if (this.loading === LoadStatus.Loading) {
      return;
    }

    if (!this.searchName.trim() && !this.searchDob) {
      return;
    }

    this.selectedPatient = null;
    this.searchRequested.emit(this.searchPayload);
  }

  selectPatient(patient: ISearchPatientResponseModel): void {
    this.selectedPatient = patient;
  }

  confirmSelection(): void {
    if (!this.selectedPatient) return;

    this.dialogRef.close(this.selectedPatient);
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
