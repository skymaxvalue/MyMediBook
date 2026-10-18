import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Subject, takeUntil } from "rxjs";
import { AppState } from "src/app/Store/app.state";
import * as AppointmentActions from "src/app/Store/Appointments/appointment.actions";
import * as AppointmentSelectors from "src/app/Store/Appointments/appointment.selectors";
import * as DoctorActions from "src/app/Store/Doctor/doctor.action";
import * as DoctorSelector from "src/app/Store/Doctor/doctor.selectors";

@Component({
  selector: "app-patient-check-in",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./patient-check-in.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./patient-check-in.component.css",
})
export class PatientCheckInComponent implements OnInit, OnDestroy {
  patientName = "";
  dob = "";
  doctorName = "";

  selectedDoctor: any = null;

  doctorSearch = "";

  showDoctorDropdown = false;

  hasSearched = false;

  checkInTime = "";

  doctorDropdownOpen = false;

  selectedAppointment: any | null = null;

  showConfirmModal = false;
  showSuccessModal = false;

  doctors: any[] = [];
  filteredDoctors: any[] = [...this.doctors];

  searchResults: any[] = [];

  searched = false;
  doctorList: any[] = [];

  appointments: any[] = [];

  private destroy$ = new Subject<void>();
  @ViewChild("doctorWrapper") doctorWrapper!: ElementRef<HTMLElement>;

  constructor(private store: Store<AppState>) {
    store.dispatch(DoctorActions.loadDoctorSpecialities());
  }
  ngOnInit(): void {
    this.getCheckInAppointmentList();
    this.subscribePatientCheckInList();
    this.subscribeDoctorSpecialities();
  }

  subscribeDoctorSpecialities(): void {
    this.store.select(DoctorSelector.selectDoctorSpecialities).subscribe((res: any) => {
      if (res) {
        this.doctors = res.flatMap((speciality: any) => speciality.doctors);
      }
    });
  }

  subscribePatientCheckInList(): void {
    this.store
      .select(AppointmentSelectors.selectFilteredCheckInAppointments)
      .pipe(takeUntil(this.destroy$))
      .subscribe((appointments) => {
        this.appointments = Array.isArray(appointments) ? appointments : [];
      });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.showDoctorDropdown &&
      !this.doctorWrapper?.nativeElement.contains(event.target as Node)
    ) {
      this.closeDoctorDropdown();
    }
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.closeDoctorDropdown();
  }

  getCheckInAppointmentList() {
    const today = new Date();

    const fromDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);
    this.store.dispatch(
      AppointmentActions.getAppointmentCheckInListByRiceptionist({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    );
  }

  openDoctorDropdown(): void {
    if (!this.showDoctorDropdown) {
      this.showDoctorDropdown = true;
      this.filteredDoctors = [...this.doctors];
    }
  }

  toggleDoctorDropdown(event: MouseEvent): void {
    event.stopPropagation();

    if (this.showDoctorDropdown) {
      this.showDoctorDropdown = false;
      return;
    }

    this.doctorSearch = "";
    this.filteredDoctors = [...this.doctors];
    this.showDoctorDropdown = true;
  }
  isSearchDisabled(): boolean {
    return !this.patientName && !this.dob && !this.doctorSearch;
  }
  closeConfirmModalOnOutsideClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showConfirmModal = false;
    }
  }
  closeSuccessModalOnOutsideClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.showSuccessModal = false;
    }
  }

  selectDoctor(doctor: any, event: MouseEvent): void {
    event.stopPropagation();

    this.selectedDoctor = doctor;
    this.doctorSearch = doctor.name;
    this.filteredDoctors = [...this.doctors];
    this.showDoctorDropdown = false;

    this.store.dispatch(
      AppointmentActions.filterCheckInByDoctor({
        doctorName: doctor.name,
      })
    );
  }

  closeDoctorDropdown(): void {
    this.showDoctorDropdown = false;
  }

  onDoctorInput(): void {
    this.selectedDoctor = null;

    const search = this.doctorSearch.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter((doctor: any) =>
      (doctor.name ?? "").toLowerCase().includes(search)
    );

    this.showDoctorDropdown = true;
  }

  filterDoctors(): void {
    const search = this.doctorSearch.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter((doctor: any) =>
      (doctor.name ?? "").toLowerCase().includes(search)
    );

    this.showDoctorDropdown = true;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  handleSearch() {
    this.store.dispatch(
      AppointmentActions.searchCheckInPatient({
        fullName: this.patientName,
        dateOfBirth: this.dob,
      })
    );
  }
  formatInputDate(value: string): string {
    if (!value) {
      return "";
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
      return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  selectAppointment(appointment: any): void {
    this.selectedAppointment = { ...appointment };
  }

  openCheckInDialog(): void {
    if (this.selectedAppointment) {
      this.store.dispatch(
        AppointmentActions.openPatientCheckInDialog({ appointment: this.selectedAppointment })
      );
    }
  }

  // confirmCheckIn(): void {
  //   if (this.selectedAppointment) {
  //     AppointmentActions.openPatientCheckInDialog()
  //   }

  //   this.selectedAppointment.checkedIn = true;
  //   console.log("Check-in confirmed for:", this.selectedAppointment);

  // //   const checkInData = {
  //     patientId: this.selectedAppointment.id,

  //     patientName: this.selectedAppointment.fullName,

  //     uhid: this.selectedAppointment.uhid,

  //     doctor: this.selectedAppointment.doctorProfile.name
  //       ? this.selectedAppointment?.doctorProfile.name
  //       : this.selectedDoctor.name,

  //     department: this.selectedAppointment.department
  //       ? this.selectedAppointment.department
  //       : this.selectedDoctor.department,

  //     room: this.selectedAppointment.room ? this.selectedAppointment.room : 2,

  //     appointmentTime: this.selectedAppointment.appointmentTime,

  //     checkInTime: this.getCurrentTime(),

  //     checkInDate: this.getCurrentDate(),
  //   };

  //   localStorage.setItem("currentCheckIn", JSON.stringify(checkInData));

  //   this.showConfirmModal = false;

  //   this.showSuccessModal = true;
  // }

  done(): void {
    this.showSuccessModal = false;

    this.selectedAppointment = null;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString("en-IN");
  }

  trackById(index: number, appointment: any): number {
    return appointment.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
