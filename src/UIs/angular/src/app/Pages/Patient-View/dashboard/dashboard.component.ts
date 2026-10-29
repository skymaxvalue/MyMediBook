import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { TabServiceService } from "src/app/core/Services/helper/tab-service/tab-service.service";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-dashboard",
  imports: [RouterOutlet],
  templateUrl: "./dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  activeTab = "appointments";
  selectedDoctor: any;
  user = JSON.parse(localStorage.getItem("user") || "null");
  patientRelativeList: any[] = [];
  updatesheduledpatient: any = null;

  constructor(
    private store: Store<AppState>,
    private tabService: TabServiceService
  ) {
    console.log("Dashboard Loaded");
  }

  ngOnInit(): void {
    this.tabService.activeTab$.subscribe((tab) => {
      this.activeTab = tab;
    });

    this.tabService.reschedulePatient$.subscribe((patient) => {
      if (!patient) {
        return;
      }

      this.updatesheduledpatient = patient;

      const speciality = this.specialities.find((s) => s.category === patient.speciality);

      this.selectedDoctor =
        speciality?.doctors.find(
          (d: any) => d.associateId === patient.associateId && d.name === patient.doctorName
        ) ?? null;
      if (this.selectedDoctor && this.updatesheduledpatient) {
        this.tabService.changeTab("specialities");
      }
    });
    this.tabService.selectedDoctor$.subscribe((doctor) => (this.selectedDoctor = doctor));

    this.callInitialAPI();
  }

  async callInitialAPI() {
    // console.log(this.user.patientId)
    // this.store.dispatch(getAllMecineDetailByPatientID({ patientId: this.user.patientId }))
    // if (this.user.patientId) {
    //   await this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }))
    //   this.store.dispatch(getPetirntProfileListById({ patientId: this.user.patientId }))
    // }
    // await this.store.select(selectMyAppointmentList).subscribe((res: any) => {
    //   if (res) {
    //     this.appointments = res.data
    //   }
    // })
    // this.store.select(selectGetProfileListByPatientId).subscribe((res: any) => {
    //   if (res) {
    //     this.patientRelativeList = res.data
    //   }
    // })
  }
  appointments: any = null;

  searchText: string = "";

  specialities: any[] = [];

  onDoctorSelected(doctor: any): void {
    // this.selectedDoctor = doctor;
    this.tabService.setSelectedDoctor(doctor);

    console.log("Received from child:", doctor);
  }
  backToSpecialities() {
    this.selectedDoctor = null;
  }
  // goToSpecialities(event?: any) {
  //   if (!event) {
  //     this.selectedDoctor = null;
  //     this.updatesheduledpatient = null;
  //     this.tabService.changeTab('specialities');
  //     return;
  //   }

  //   this.updatesheduledpatient = event;

  //   const speciality = this.specialities.find(
  //     s => s.category === event.speciality
  //   );

  //   this.selectedDoctor = speciality?.doctors.find(
  //     (d: any) =>
  //       d.associateId === event.associateId &&
  //       d.name === event.doctorName
  //   ) ?? null;

  //   this.tabService.changeTab('specialities');
  // }

  changeTab(tab: string) {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    this.activeTab = tab;
    this.updatesheduledpatient = null;

    if (tab === "appointments") {
      this.selectedDoctor = null;
    }

    if (tab === "specialities") {
      // this.selectedDoctor = null;
    }
  }
}
