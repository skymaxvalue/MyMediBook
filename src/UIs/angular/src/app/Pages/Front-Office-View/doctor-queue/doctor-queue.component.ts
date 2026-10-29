import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, filter, map, Subject, takeUntil } from "rxjs";
import * as DoctorActions from "../../../Store/Doctor/doctor.action";
import * as DoctorSelector from "../../../Store/Doctor/doctor.selectors";
import { ListRequestModel } from "../../../core/Models/list-request.model";
import { AppointmentFacade } from "../../../Store/Appointments/appointment.facade";
import { MasterFacade } from "../../../Store/Master/master.facade";
import { UpdateConsultationStatusRequestModel } from "../../../core/Models/update-appointment-status.model";

interface QueuePatient {
  appointmentid: number;
  name: string;
  time: string;
  checkedIn: boolean;
  statusId: number;
  uhid?: string;
}

@Component({
  selector: "app-doctor-queue",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./doctor-queue.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./doctor-queue.component.css",
})
export class DoctorQueueComponent implements OnInit, OnDestroy {
  @ViewChild("dateInput") dateInput!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();
  private doctorId = 0;

  selectedDate = "";
  queuePatients: QueuePatient[] = [];
  statusOptions: { id: number; label: string; css: string }[] = [];

  private readonly CSS_BY_KEY: Record<string, string> = {
    Waiting: "waiting",
    "Next In Queue": "next",
    "In Consultation": "consultation",
    Completed: "completed",
  };

  doctor = { name: "", qualification: "", department: "", room: "" };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appointmentFacade: AppointmentFacade,
    private masterFacade: MasterFacade
  ) { }

  ngOnInit(): void {
    this.setDefaultDate();
    this.subscribeQueueData();
    this.LoadAndsubscribeStatusOptions();
    this.subscribeDoctorAndRoute();
  }

  private LoadAndsubscribeStatusOptions(): void {
    this.masterFacade.getStatusKeyList();
    this.masterFacade.stausKeyList$.pipe(takeUntil(this.destroy$)).subscribe((list: any) => {
      const groups = Array.isArray(list) ? list : (list ?? []);
      const g = groups.find((x: any) => x.category === "AppointmentConsultationStatus");
      this.statusOptions = (g?.statuses ?? []).map((s: any) => ({
        id: s.statusId,
        label: s.statusValue,
        css: this.CSS_BY_KEY[s.statusKey] ?? "",
      }));
    });
    console.log(this.statusOptions);
  }

  private subscribeDoctorAndRoute(): void {
    const id$ = this.route.paramMap.pipe(
      map((p) => Number(p.get("doctorId"))),
      filter((id) => id > 0)
    );
    const specs$ = this.store.select(DoctorSelector.selectDoctorSpecialities);

    combineLatest([id$, specs$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([id, specs]: [number, any]) => {
        if (id !== this.doctorId) {
          this.doctorId = id;
          this.loadQueue();
        }
        if (!specs) {
          this.store.dispatch(DoctorActions.loadDoctorSpecialities());
          return;
        }
        for (const s of specs) {
          const d = (s.doctors ?? []).find((x: any) => x.associateId === id);
          if (d) {
            this.doctor = {
              name: d.name ?? "",
              qualification: d.qualification ?? "",
              department: s.name ?? d.department ?? "",
              room: d.room ?? "N/A",
            };
            return;
          }
        }
      });
  }

  private loadQueue(): void {
    if (!this.doctorId || !this.selectedDate) return;

    const payload: ListRequestModel = {
      DoctorId: this.doctorId,
      FromDate: new Date(`${this.selectedDate}T00:00:00`).toISOString(),
      ToDate: new Date(`${this.selectedDate}T23:59:59.999`).toISOString(),
    };
    this.appointmentFacade.getDoctorAppointmentQueueList(payload);
  }

  private subscribeQueueData(): void {
    this.appointmentFacade.doctorAppointmentQueueList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows: any) => {
        this.queuePatients = (Array.isArray(rows) ? rows : []).map((a: any) => ({
          appointmentid: a.appointmentId,
          name: a.patientName ?? "-",
          time: `${a.slotStartTime} - ${a.slotEndTime}`,
          checkedIn: !!a.isCheckedIn,
          statusId: a.consultationStatusId ?? 15,
          uhid: a.profileId,
        }));
      });
  }

  get doctorName() {
    return this.doctor.name;
  }
  get doctorQualification() {
    return this.doctor.qualification;
  }
  get doctorDepartment() {
    return this.doctor.department;
  }
  get doctorRoom() {
    return this.doctor.room;
  }
  get queueCount() {
    return this.queuePatients.length;
  }

  statusClass(statusId: number): string {
    return this.statusOptions.find((o) => o.id === statusId)?.css ?? "";
  }

  onStatusChange(patient: QueuePatient, statusId: number): void {
    if (!patient.checkedIn || patient.statusId === statusId) return;
    const payload: UpdateConsultationStatusRequestModel = {
      AppointmentId: patient.appointmentid,
      ConsultationStatusId: statusId,
    };
    this.appointmentFacade.updateConsultationStatus(payload);
  }

  // ---------- date ----------
  get queueDateLabel(): string {
    const d = new Date(`${this.selectedDate}T00:00:00`);
    if (!this.selectedDate || isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    const weekday = d.toLocaleString("en-GB", { weekday: "long" }).toUpperCase();
    return `${day}-${month}-${d.getFullYear()} (${weekday})`;
  }

  private setDefaultDate(): void {
    const t = new Date();
    this.selectedDate = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  }

  openCalendar(): void {
    const input = this.dateInput.nativeElement;
    input.showPicker ? input.showPicker() : input.click();
  }

  onDateChange(): void {
    this.loadQueue();
  }

  backToSearch(): void {
    this.router.navigate(["/front-office/patient-check-in"]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
