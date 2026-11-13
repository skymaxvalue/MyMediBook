import { AssociateFacade } from "./../../../Store/Associate/associate.facade";
import { AppointmentFacade } from "./../../../Store/Appointments/appointment.facade";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";

import {
  DoctorModelDto,
} from "../../../core/Models/doctor/doctor-detail.model";

import { DoctorFacade } from "../../../Store/Doctor/doctor.facade";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-next-in-queue",
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: "./next-in-queue.component.html",
  styleUrl: "./next-in-queue.component.css",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class NextInQueueComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedDoctor: DoctorModelDto | null = null;
  doctorSearchText = "";
  isDoctorDropdownOpen = false;
  validationMessage = "";

  constructor(
    public doctorFacade: DoctorFacade,
    private elementRef: ElementRef,
    private appointmentFacade: AppointmentFacade,
    private associateFacade: AssociateFacade
  ) {}

  ngOnInit(): void {
    this.doctorFacade.getDoctorList();
  }

  onDoctorSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;

    this.doctorSearchText = searchTerm;
    this.isDoctorDropdownOpen = true;

    this.doctorFacade.filterDoctors(searchTerm);
  }

  toggleDoctorDropdown(): void {
    this.isDoctorDropdownOpen = !this.isDoctorDropdownOpen;

    if (this.isDoctorDropdownOpen) {
      this.doctorFacade.filterDoctors(this.doctorSearchText);
    }
  }

  selectDoctor(doctor: DoctorModelDto): void {
    this.selectedDoctor = doctor;
    this.doctorSearchText = doctor.name;

    // Close dropdown after selection
    this.isDoctorDropdownOpen = false;

    // Reset search filter
    this.doctorFacade.filterDoctors("");
  }

  clearSelection(event?: MouseEvent): void {
    event?.stopPropagation();

    this.selectedDoctor = null;
    this.doctorSearchText = "";
    this.isDoctorDropdownOpen = false;

    this.doctorFacade.filterDoctors("");
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;
    const dropdownWrapper = this.elementRef.nativeElement.querySelector(".doctor-select-wrapper");

    if (dropdownWrapper && !dropdownWrapper.contains(target)) {
      this.isDoctorDropdownOpen = false;
    }
  }

  onViewQueueClick(): void {
    if (!this.selectedDoctor) {
      this.validationMessage = "Please select a doctor.";
      return;
    }

    this.validationMessage = "";

    this.associateFacade.setSelectedAssociateId(this.selectedDoctor.associateId);

    this.appointmentFacade.redirectToAppointmentCheckInsPage(this.selectedDoctor.associateId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
