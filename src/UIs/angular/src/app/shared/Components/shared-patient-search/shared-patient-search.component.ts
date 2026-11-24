import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../../core/Models/common/search-patient.model";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoadStatus } from "../../../utils/enum/load-status.enum";
import { CommonFacade } from "../../../Store/Common/common.facade";
import { Dialog } from "@angular/cdk/dialog";
import { PatientSelectionDialogComponent } from "./patient-selection-dialog/patient-selection-dialog.component";
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  selector: "app-shared-patient-search",
  styleUrl: "./shared-patient-search.component.css",
  templateUrl: "./shared-patient-search.component.html",
})
export class SharedPatientSearchComponent {
  @Input() patients: ISearchPatientResponseModel[] = [];
  @Input() loading: LoadStatus = LoadStatus.NotLoaded;
  @Input() layout: "default" | "inline" = "default";
  @Input() title = "Select Patient Profile";

  @Output() searchRequested = new EventEmitter<ISearchPatientRequestModel>();
  @Output() clearRequested = new EventEmitter<void>();
  @Output() patientSelected = new EventEmitter<ISearchPatientResponseModel>();
  @Output() switchProfile = new EventEmitter<void>();

  LoadStatus = LoadStatus;
  lastName = "";
  dob = "";
  mobileNo = "";
  selectedPatient: ISearchPatientResponseModel | null = null;

  constructor(private dialog: Dialog) {}

  get searchPayload(): ISearchPatientRequestModel {
    return {
      name: this.lastName.trim() || null,
      dob: this.dob || null,
      mobileNo: this.mobileNo.trim(),
      fromDate: null,
      toDate: null,
    };
  }

  searchPatient(): void {
    if (this.loading === LoadStatus.Loading) {
      return;
    }

    if (!this.lastName.trim() && !this.dob && !this.mobileNo.trim()) {
      return;
    }

    this.searchRequested.emit(this.searchPayload);
  }

  clearSearch(): void {
    this.lastName = "";
    this.dob = "";
    this.mobileNo = "";

    this.clearRequested.emit();
  }

  selectPatient(patient: ISearchPatientResponseModel): void {
    this.selectedPatient = patient;
    this.patientSelected.emit(patient);
  }

  switchPatientProfile(): void {
    this.dialog
      .open<ISearchPatientResponseModel | null>(PatientSelectionDialogComponent, {
        width: "600px",
        maxWidth: "95vw",
        height: "auto",
        maxHeight: "85vh",
      })
      .closed.subscribe((patient) => {
        if (patient) this.selectPatient(patient);
      });
  }
}
