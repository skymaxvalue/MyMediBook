import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ISearchPatientRequestModel,
  ISearchPatientResponseModel,
} from "../../../core/Models/common/search-patient.model";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoadStatus } from "../../../utils/enum/load-status.enum";
import { CommonFacade } from "../../../Store/Common/common.facade";
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

  @Output() searchRequested = new EventEmitter<ISearchPatientRequestModel>();

  @Output() clearRequested = new EventEmitter<void>();

  @Output() patientSelected = new EventEmitter<ISearchPatientResponseModel>();

  @Output() switchProfile = new EventEmitter<void>();
  LoadStatus = LoadStatus;
  lastName = "";
  dob = "";
  mobileNo = "";

  selectedPatient: ISearchPatientResponseModel | null = null;
  showPatientModal = false;

  constructor(private commonFacade: CommonFacade) {}
  get searchPayload(): ISearchPatientRequestModel {
    return {
      name: this.lastName.trim() || null,
      dob: this.dob || null,
      mobileNo: this.mobileNo.trim() || null,
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
    this.showPatientModal = false;
  }

  openPatientModal(): void {
    this.showPatientModal = true;
  }

  closePatientModal(): void {
    this.showPatientModal = false;
  }

  switchPatientProfile(): void {
    this.commonFacade.openPatientSwitchDialog();
  }
}
