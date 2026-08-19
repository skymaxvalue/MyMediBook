import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
interface Appointment {
  doctor?: string;
  department?: string;
  room?: string;
}
interface Doctor {
  name: string;
  department: string;
  room: string;
}
@Component({
  selector: "app-next-in-queue",
  imports: [FormsModule],
  templateUrl: "./next-in-queue.component.html",
  styleUrl: "./next-in-queue.component.css",
})
export class NextInQueueComponent implements OnInit {

  doctors: Doctor[] = [];

  filteredDoctors: Doctor[] = [];

  selectedDoctor: Doctor | null = null;

  doctorSearch = '';

  isDropdownOpen = false;

  validationMessage = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDoctors();
  }


  getAppointments(): Appointment[] {

    try {

      const storedAppointments =
        localStorage.getItem('myMediBookAppointments');

      if (!storedAppointments) {
        return [];
      }

      const appointments = JSON.parse(storedAppointments);

      return Array.isArray(appointments)
        ? appointments
        : [];

    } catch (error) {

      console.error('Error loading appointments:', error);

      return [];
    }
  }



  loadDoctors(): void {

    const appointments = this.getAppointments();

    const doctorMap = new Map<string, Doctor>();

    appointments.forEach((appointment) => {

      if (!appointment.doctor) {
        return;
      }

      const doctorName = appointment.doctor.trim();

      if (!doctorName) {
        return;
      }

      if (!doctorMap.has(doctorName)) {

        doctorMap.set(doctorName, {
          name: doctorName,
          department: appointment.department || '',
          room: appointment.room || ''
        });

      }

    });

    this.doctors = Array.from(doctorMap.values());

    this.filteredDoctors = [...this.doctors];
  }



  searchDoctor(): void {

    const searchTerm =
      this.doctorSearch.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter(
      doctor =>
        doctor.name
          .toLowerCase()
          .includes(searchTerm)
    );

    this.selectedDoctor = null;

    this.validationMessage = '';

    this.isDropdownOpen = true;
  }



  openDropdown(): void {

    this.filteredDoctors = [...this.doctors];

    this.isDropdownOpen = true;
  }




  selectDoctor(doctor: Doctor): void {

    this.selectedDoctor = doctor;

    this.doctorSearch = doctor.name;

    this.validationMessage = '';

    this.isDropdownOpen = false;
  }



  clearSelection(): void {

    this.selectedDoctor = null;

    this.doctorSearch = '';

    this.validationMessage = '';

    this.isDropdownOpen = false;

    this.filteredDoctors = [...this.doctors];
  }



  viewQueue(): void {

    if (!this.selectedDoctor) {

      this.validationMessage =
        'Please select a doctor to continue.';

      return;
    }

    localStorage.setItem(
      'selectedDoctor',
      JSON.stringify({
        name: this.selectedDoctor.name,
        department: this.selectedDoctor.department || '',
        room: this.selectedDoctor.room || ''
      })
    );

    this.router.navigate(['/doctor-queue']);
  }



  closeDropdown(): void {

    this.isDropdownOpen = false;
  }
}
