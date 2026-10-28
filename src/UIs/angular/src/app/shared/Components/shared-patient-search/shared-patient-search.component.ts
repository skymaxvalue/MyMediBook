import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../../core/Models/common/search-patient.model";

@Component({
  imports: [],
  selector: "app-shared-patient-search",
  styleUrl: "./shared-patient-search.component.css",
  templateUrl: "./shared-patient-search.component.html",
})
export class SharedPatientSearchComponent {
  @Input() patients: ISearchPatientResponseModel[] = [];
  @Input() loading = false;

  @Output() searchRequested = new EventEmitter<ISearchPatientRequestModel>();

  @Output() clearRequested = new EventEmitter<void>();

  @Output() patientSelected = new EventEmitter<ISearchPatientResponseModel>();

  @Output() switchProfile = new EventEmitter<void>();

  lastName = "";
  dob = "";
  mobileNo?: number;

  selectedPatient: ISearchPatientResponseModel | null = null;
  showPatientModal = false;

  get searchPayload(): ISearchPatientRequestModel {
    return {
      name: this.lastName.trim() || null,
      dob: this.dob || null,
      mobileNo: this.mobileNo || null,
      fromDate: "",
      toDate: "",
    };
  }

  searchPatient(): void {
    if (!this.lastName.trim() && !this.dob && !this.mobileNo) {
      return;
    }

    this.searchRequested.emit(this.searchPayload);
  }

  clearSearch(): void {
    this.lastName = "";
    this.dob = "";
    this.mobileNo = 0;

    this.clearRequested.emit();
  }

  selectPatient(patient: ISearchPatientResponseModel): void {
    this.selectedPatient = patient;
    this.patientSelected.emit(patient);
    this.showPatientModal = false;
  }

  openPatientModal(): void {
    this.showPatientModal = true;
  }

  closePatientModal(): void {
    this.showPatientModal = false;
  }

  switchPatientProfile(): void {
    this.selectedPatient = null;
    this.switchProfile.emit();
  }
}
