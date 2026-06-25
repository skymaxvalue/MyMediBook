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

@Component({
  selector: "app-dashboard",
  imports: [MyAppointmentComponent, SpecialitiesComponent, CheckDocAvailableComponent, MedicineOrdersComponent, MessagesComponent, LabResultComponent, BillingComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  activeTab = "appointments";
  selectedDoctor: any;



  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.callInitialAPI()


  }

  callInitialAPI() {
    this.store.dispatch(
      loadDoctorSpecialities());

    this.store.select(selectDoctorSpecialities)
      .subscribe((res: any) => {
        this.specialities = res;
      });
  }
  appointments = [
    {
      visitPurpose: "ENT",
      patientName: "Ramesh",
      appointmentDate: "Mar 31 2026",
      appointmentTime: "11:00 AM - 11:30AM",
      doctorName: "Dr. Vaishali",
      status: "Completed",
    },
    {
      visitPurpose: "Fever",
      patientName: "Self",
      appointmentDate: "Apr 08 2026",
      appointmentTime: "03:00 PM - 03:30PM",
      doctorName: "Dr. Arun",
      status: "Completed",
    },
    {
      visitPurpose: "Follow Up",
      patientName: "Raman",
      appointmentDate: "May 05 2026",
      appointmentTime: "05:00 PM - 05:30PM",
      doctorName: "Dr. Kumar",
      status: "Upcoming",
    },
    {
      visitPurpose: "ENT",
      patientName: "Ramesh",
      appointmentDate: "Mar 31 2026",
      appointmentTime: "11:00 AM - 11:30 AM",
      doctorName: "Dr. Vaishali",
      status: "Completed",
    },
    {
      visitPurpose: "Dental Checkup",
      patientName: "Ramesh",
      appointmentDate: "Apr 15 2026",
      appointmentTime: "10:00 AM - 10:30 AM",
      doctorName: "Dr. Mehta",
      status: "Completed",
    },
    {
      visitPurpose: "General Checkup",
      patientName: "Self",
      appointmentDate: "Apr 08 2026",
      appointmentTime: "03:00 PM - 03:30 PM",
      doctorName: "Dr. Arun",
      status: "Completed",
    },
    {
      visitPurpose: "Eye Consultation",
      patientName: "Self",
      appointmentDate: "Jun 25 2026",
      appointmentTime: "12:00 PM - 12:30 PM",
      doctorName: "Dr. Shah",
      status: "Upcoming",
    },
    {
      visitPurpose: "Follow Up",
      patientName: "Raman",
      appointmentDate: "May 05 2026",
      appointmentTime: "05:00 PM - 05:30 PM",
      doctorName: "Dr. Kumar",
      status: "Upcoming",
    },
    {
      visitPurpose: "Cardiology",
      patientName: "Raman",
      appointmentDate: "Jun 20 2026",
      appointmentTime: "09:00 AM - 09:30 AM",
      doctorName: "Dr. Joshi",
      status: "Current",
    },
    {
      visitPurpose: "Orthopedic",
      patientName: "Sunita",
      appointmentDate: "Feb 18 2026",
      appointmentTime: "02:00 PM - 02:30 PM",
      doctorName: "Dr. Patil",
      status: "Completed",
    },
    {
      visitPurpose: "Diabetes Review",
      patientName: "Sunita",
      appointmentDate: "Jul 10 2026",
      appointmentTime: "04:00 PM - 04:30 PM",
      doctorName: "Dr. Deshmukh",
      status: "Upcoming",
    },
    {
      visitPurpose: "Skin Allergy",
      patientName: "Rahul",
      appointmentDate: "Jun 19 2026",
      appointmentTime: "11:00 AM - 11:30 AM",
      doctorName: "Dr. Kulkarni",
      status: "Current",
    },
    {
      visitPurpose: "Dermatology",
      patientName: "Rahul",
      appointmentDate: "Jan 12 2026",
      appointmentTime: "01:00 PM - 01:30 PM",
      doctorName: "Dr. Nair",
      status: "Completed",
    },
    {
      visitPurpose: "ENT",
      patientName: "Ramesh",
      appointmentDate: "Mar 31 2026",
      appointmentTime: "11:00 AM - 11:30 AM",
      doctorName: "Dr. Vaishali",
      status: "Completed",
    }

  ];
  searchText: string = '';

  specialities = [

  ];

  onDoctorSelected(doctor: any): void {
    this.selectedDoctor = doctor;
    console.log('Received from child:', doctor);
  }
  backToSpecialities() {
    this.selectedDoctor = null;
  }
  goToSpecialities() {
    this.selectedDoctor = null;
    this.activeTab = "specialities";
  }

  changeTab(tab: string) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    this.activeTab = tab;

    console.log('Tab Changed:', tab);

    // Your custom event logic here

    if (tab === 'appointments') {

      // call API
      // refresh data
      this.selectedDoctor = null;
    }

    if (tab === 'specialities') {

      this.selectedDoctor = null;
    }
  }
}
