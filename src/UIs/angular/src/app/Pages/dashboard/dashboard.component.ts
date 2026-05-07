import { Component } from "@angular/core";
import { MyAppointmentComponent } from "../my-appointment/my-appointment.component";
import { SpecialitiesComponent } from "../specialities/specialities.component";
import { MedicineOrdersComponent } from "../medicine-orders/medicine-orders.component";

@Component({
  selector: "app-dashboard",
  imports: [MyAppointmentComponent, SpecialitiesComponent, MedicineOrdersComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  activeTab = "appointments";
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
  ];
}
