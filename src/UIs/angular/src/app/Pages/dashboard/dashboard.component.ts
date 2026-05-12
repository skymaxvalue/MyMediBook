import { Component } from "@angular/core";
import { MyAppointmentComponent } from "../my-appointment/my-appointment.component";
import { SpecialitiesComponent } from "../specialities/specialities.component";
import { MedicineOrdersComponent } from "../medicine-orders/medicine-orders.component";
import { CheckDocAvailableComponent } from "../check-doc-available/check-doc-available.component";

@Component({
  selector: "app-dashboard",
  imports: [MyAppointmentComponent, SpecialitiesComponent, CheckDocAvailableComponent, MedicineOrdersComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {
  activeTab = "appointments";
  selectedDoctor: any;

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
  searchText: string = '';

  specialities = [
    {
      category: 'General Physician',
      doctors: [
        {
          name: 'Dr. Kumar',
          degree: 'MBBS',
          department: 'GENERAL',
          image: 'images/doc.jpg',
          time: '11:00 AM - 04:30 PM'
        },
        {
          name: 'Dr. Bose',
          degree: 'MBBS',
          department: 'INTERNAL MEDICINE',
          image: 'images/doc.jpg',
          time: '12:00 PM - 05:30 PM'
        }
      ]
    },
    {
      category: 'Cardiology',
      doctors: [
        {
          name: 'Dr. Raman',
          degree: 'MBBS, MD',
          department: 'DNB (CARDIOLOGY)',
          image: 'images/doc.jpg',
          time: '09:00 AM - 12:30 PM'
        }
      ]
    }
  ];

  onDoctorSelected(doctor: any): void {
    // debugger
    this.selectedDoctor = doctor;
    console.log('Received from child:', doctor);
  }
  backToSpecialities() {
    this.selectedDoctor = null;
  }
}
