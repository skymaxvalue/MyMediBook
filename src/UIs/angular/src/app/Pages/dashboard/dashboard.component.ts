import { Component, OnInit } from "@angular/core";
import { MyAppointmentComponent } from "../my-appointment/my-appointment.component";
import { SpecialitiesComponent } from "../specialities/specialities.component";
import { MedicineOrdersComponent } from "../medicine-orders/medicine-orders.component";
import { CheckDocAvailableComponent } from "../check-doc-available/check-doc-available.component";
import { DoctorSpecialityState } from "src/app/Store/Doctor/doctor.state";
import { Store } from "@ngrx/store";
import { loadDoctorSpecialities } from "src/app/Store/Doctor/doctor.action";
import { selectDoctorSpecialities } from "src/app/Store/Doctor/doctor.selectors";
import { AsyncPipe } from "@angular/common";
import { DoctorSpeciality } from "src/app/Models/DoctorAndSpeciality-Model";
import { AppState } from "src/app/Store/app.state";
import { MessagesComponent } from "../messages/messages.component";
import { LabResultComponent } from "../lab-result/lab-result.component";
import { BillingComponent } from "../billing/billing.component";
import { getPetirntProfileListById } from "src/app/Store/Patient/patient.action";
import { selectGetProfileListByPatientId } from "src/app/Store/Patient/patient.selectors";
import { first } from "rxjs";
import { getMyAppointments } from "src/app/Store/Appointments/appointment.actions";
import { selectMyAppointmentList } from "src/app/Store/Appointments/appointment.selcetors";
import { TabServiceService } from "src/app/Services/tab-service.service";

@Component({
  selector: "app-dashboard",
  imports: [MyAppointmentComponent, SpecialitiesComponent, CheckDocAvailableComponent, MedicineOrdersComponent, MessagesComponent, LabResultComponent, BillingComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  activeTab = "appointments";
  selectedDoctor: any;
  user = JSON.parse(localStorage.getItem('user') || 'null')
  patientRelativeList: any[] = []
  updatesheduledpatient: any = null


  constructor(
    private store: Store<AppState>, private tabService: TabServiceService
  ) { }

  ngOnInit(): void {
    this.tabService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });

    this.tabService.reschedulePatient$.subscribe(patient => {

      if (!patient) {
        return;
      }

      this.updatesheduledpatient = patient;

      const speciality = this.specialities.find(
        s => s.category === patient.speciality
      );

      this.selectedDoctor = speciality?.doctors.find(
        (d: any) =>
          d.associateId === patient.associateId &&
          d.name === patient.doctorName
      ) ?? null;
      if (this.selectedDoctor && this.updatesheduledpatient) {

        this.tabService.changeTab('specialities');
      }


    });
    this.tabService.selectedDoctor$
      .subscribe(doctor => this.selectedDoctor = doctor);


    this.callInitialAPI()


  }

  async callInitialAPI() {
    console.log(this.user.patientId)
    this.store.dispatch(
      loadDoctorSpecialities());


    if (this.user.patientId) {
      await this.store.dispatch(getMyAppointments({ patientId: this.user.patientId }))
      this.store.dispatch(getPetirntProfileListById({ patientId: this.user.patientId }))
    }

    await this.store.select(selectMyAppointmentList).subscribe((res: any) => {
      if (res) {

        this.appointments = res.data
      }
    })

    this.store.select(selectGetProfileListByPatientId).subscribe((res: any) => {
      if (res) {

        this.patientRelativeList = res.data
      }
    })

    this.store.select(selectDoctorSpecialities)
      .subscribe((res: any) => {
        this.specialities = res;
      });

  }
  appointments: any = null

  searchText: string = '';

  specialities: any[] = [

  ];

  onDoctorSelected(doctor: any): void {
    // this.selectedDoctor = doctor;
    this.tabService.setSelectedDoctor(doctor);

    console.log('Received from child:', doctor);
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
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    this.activeTab = tab;
    this.updatesheduledpatient = null

    if (tab === 'appointments') {

      this.selectedDoctor = null;
    }

    if (tab === 'specialities') {

      // this.selectedDoctor = null;
    }
  }
}
