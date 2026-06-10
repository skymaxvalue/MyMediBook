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

@Component({
  selector: "app-dashboard",
  imports: [MyAppointmentComponent, SpecialitiesComponent, CheckDocAvailableComponent, MedicineOrdersComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  activeTab = "appointments";
  selectedDoctor: any;



  constructor(
    private store: Store<DoctorSpecialityState>
  ) { }

  ngOnInit(): void {
    this.callInitialAPI()


  }

  callInitialAPI() {
    this.store.dispatch(
      loadDoctorSpecialities());

    this.store.select(selectDoctorSpecialities)
      .subscribe((specialities: DoctorSpeciality[]) => {

        const groupedData = specialities.reduce((acc: any[], item) => {

          let speciality = acc.find(
            x => x.category === item.specialityName
          );

          if (!speciality) {
            speciality = {
              category: item.specialityName,
              doctors: []
            };

            acc.push(speciality);
          }

          speciality.doctors.push({
            specialityId: item.specialityId,
            name: item.doctorName,
            degree: '',
            department: item.departmentName,
            image: 'assets/images/doc.jpg',
            time: ''
          });

          return acc;

        }, []);

        this.specialities = groupedData;

        console.log(this.specialities);
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
