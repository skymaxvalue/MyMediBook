import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Appointment {
  id: number;
  patientName: string;
  dob: string;
  appointmentDate: string;
  address: string;
  phone: string;
  email: string;
  doctor: string;
  department: string;
  room: string;
  appointmentTime: string;
  uhid: string;
  checkedIn: boolean;
}

@Component({
  selector: 'app-patient-check-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './patient-check-in.component.html',
  styleUrl: './patient-check-in.component.css'
})
export class PatientCheckInComponent {


  patientName = '';
  dob = '';
  doctorName = '';

  selectedDoctor = '';

  doctorSearch = '';

  showDoctorDropdown = false;

  hasSearched = false;

  checkInTime = '';


  doctorDropdownOpen = false;

  selectedAppointment: Appointment | null = null;

  showConfirmModal = false;
  showSuccessModal = false;


  doctors: string[] = [
    'Dr. Kumaravel',
    'Dr. Priya',
    'Dr. Arjun'
  ];
  filteredDoctors: string[] = [...this.doctors];


  appointments: Appointment[] = [

    {
      id: 1,
      patientName: 'Ravi Kumar',
      dob: '01/04/2001',
      appointmentDate: '14/07/2026',
      address: '123 MG Road, Delhi',
      phone: '+91 98765 43210',
      email: 'ravi.kumar@email.com',
      doctor: 'Dr. Kumaravel',
      department: 'General Physician',
      room: '#5, 2nd Floor',
      appointmentTime: '10:00 AM',
      uhid: 'HH24567',
      checkedIn: false
    },

    {
      id: 2,
      patientName: 'Raveen Kumar',
      dob: '04/01/2001',
      appointmentDate: '14/07/2026',
      address: '45 Park Street, Mumbai',
      phone: '+91 91234 56789',
      email: 'raveen.kumar@email.com',
      doctor: 'Dr. Kumaravel',
      department: 'General Physician',
      room: '#5, 2nd Floor',
      appointmentTime: '10:30 AM',
      uhid: 'HH24568',
      checkedIn: false
    },

    {
      id: 3,
      patientName: 'Ananya Sharma',
      dob: '15/08/1998',
      appointmentDate: '14/07/2026',
      address: '22 Lake Road, Kolkata',
      phone: '+91 98765 12345',
      email: 'ananya.sharma@email.com',
      doctor: 'Dr. Kumaravel',
      department: 'General Physician',
      room: '#5, 2nd Floor',
      appointmentTime: '11:00 AM',
      uhid: 'HH24569',
      checkedIn: false
    },

    {
      id: 4,
      patientName: 'Sourav Das',
      dob: '22/11/1995',
      appointmentDate: '14/07/2026',
      address: '18 Station Road, Kolkata',
      phone: '+91 98301 45678',
      email: 'sourav.das@email.com',
      doctor: 'Dr. Priya',
      department: 'Cardiology',
      room: '#8, 3rd Floor',
      appointmentTime: '09:00 AM',
      uhid: 'HH24570',
      checkedIn: false
    },

    {
      id: 5,
      patientName: 'Priyanka Sen',
      dob: '08/03/2000',
      appointmentDate: '14/07/2026',
      address: '67 Salt Lake, Kolkata',
      phone: '+91 98745 67890',
      email: 'priyanka.sen@email.com',
      doctor: 'Dr. Priya',
      department: 'Cardiology',
      room: '#8, 3rd Floor',
      appointmentTime: '09:30 AM',
      uhid: 'HH24571',
      checkedIn: false
    },

    {
      id: 6,
      patientName: 'Arindam Roy',
      dob: '12/06/1989',
      appointmentDate: '14/07/2026',
      address: '34 VIP Road, Kolkata',
      phone: '+91 91236 78901',
      email: 'arindam.roy@email.com',
      doctor: 'Dr. Priya',
      department: 'Cardiology',
      room: '#8, 3rd Floor',
      appointmentTime: '10:00 AM',
      uhid: 'HH24572',
      checkedIn: false
    },

    {
      id: 7,
      patientName: 'Neha Gupta',
      dob: '19/02/1997',
      appointmentDate: '14/07/2026',
      address: '56 MG Road, Delhi',
      phone: '+91 98123 45678',
      email: 'neha.gupta@email.com',
      doctor: 'Dr. Arjun',
      department: 'Orthopedics',
      room: '#12, 4th Floor',
      appointmentTime: '11:00 AM',
      uhid: 'HH24573',
      checkedIn: false
    },

    {
      id: 8,
      patientName: 'Rahul Mehta',
      dob: '05/09/1992',
      appointmentDate: '14/07/2026',
      address: '89 Park Street, Kolkata',
      phone: '+91 98761 23456',
      email: 'rahul.mehta@email.com',
      doctor: 'Dr. Arjun',
      department: 'Orthopedics',
      room: '#12, 4th Floor',
      appointmentTime: '11:30 AM',
      uhid: 'HH24574',
      checkedIn: false
    },

    {
      id: 9,
      patientName: 'Moumita Ghosh',
      dob: '27/12/2002',
      appointmentDate: '14/07/2026',
      address: '41 Garia Road, Kolkata',
      phone: '+91 90070 12345',
      email: 'moumita.ghosh@email.com',
      doctor: 'Dr. Arjun',
      department: 'Orthopedics',
      room: '#12, 4th Floor',
      appointmentTime: '12:00 PM',
      uhid: 'HH24575',
      checkedIn: false
    }

  ];



  searchResults: Appointment[] = [];

  searched = false;

  constructor(private router: Router) { }



  openDoctorDropdown(): void {
    this.showDoctorDropdown = true;
    this.filterDoctors();
  }

  toggleDoctorDropdown(): void {
    this.showDoctorDropdown = !this.showDoctorDropdown;

    if (this.showDoctorDropdown) {
      this.filterDoctors();
    }
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
  // get filteredDoctors(): string[] {

  //   const search = this.doctorName
  //     .trim()
  //     .toLowerCase();

  //   if (!search) {
  //     return this.doctors;
  //   }

  //   return this.doctors.filter(doctor =>
  //     doctor.toLowerCase().includes(search)
  //   );
  // }

  // openDoctorDropdown(): void {
  //   this.doctorDropdownOpen = true;
  // }

  selectDoctor(doctor: string): void {
    this.selectedDoctor = doctor;
    this.doctorSearch = doctor;
    this.showDoctorDropdown = false;
  }

  onDoctorInput(): void {

    this.selectedDoctor = '';

    this.doctorDropdownOpen = true;
  }

  filterDoctors(): void {
    const search = this.doctorSearch.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter(doctor =>
      doctor.toLowerCase().includes(search)
    );

    this.showDoctorDropdown = true;
  }

  // ==============================
  // Search
  // ==============================

  handleSearch(): void {

    this.selectedAppointment = null;
    this.hasSearched = true;
    this.searched = true;

    // ==============================
    // DOCTOR SEARCH
    // ==============================

    if (this.selectedDoctor) {

      this.searchByDoctor(this.selectedDoctor);

      return;
    }

    // If user typed doctor name manually
    const matchingDoctor = this.doctors.find(
      doctor =>
        doctor.toLowerCase() ===
        this.doctorSearch.trim().toLowerCase()
    );

    if (matchingDoctor) {

      this.selectedDoctor = matchingDoctor;

      this.searchByDoctor(matchingDoctor);

      return;
    }

    // ==============================
    // PATIENT SEARCH
    // ==============================

    if (this.patientName && this.dob) {

      this.searchByPatient(
        this.patientName,
        this.dob
      );

      return;
    }

    // No valid search criteria
    this.searchResults = [];
  }
  searchByPatient(
    patientName: string,
    dob: string
  ): void {

    const formattedDob =
      this.formatInputDate(dob);

    const searchName =
      patientName
        .trim()
        .toLowerCase();

    this.searchResults =
      this.appointments.filter(appointment => {

        const nameMatches =
          appointment.patientName
            .toLowerCase()
            .includes(searchName);

        const dobMatches =
          appointment.dob === formattedDob;

        return nameMatches && dobMatches;
      });
  }

  searchByDoctor(doctorName: string): void {

    this.searchResults =
      this.appointments.filter(
        appointment =>
          appointment.doctor.toLowerCase() ===
          doctorName.toLowerCase()
      );
  }

  formatInputDate(value: string): string {

    if (!value) {
      return '';
    }

    const parts = value.split('-');

    if (parts.length !== 3) {
      return value;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // ==============================
  // Select Appointment
  // ==============================

  selectAppointment(
    appointment: Appointment
  ): void {

    this.selectedAppointment = appointment;
  }

  // ==============================
  // Check In
  // ==============================

  handleCheckIn(): void {

    if (!this.selectedAppointment) {
      return;
    }

    this.showConfirmModal = true;
  }

  // ==============================
  // Confirm Check-In
  // ==============================

  confirmCheckIn(): void {

    if (!this.selectedAppointment) {
      return;
    }

    this.selectedAppointment.checkedIn = true;

    const checkInData = {

      patientId:
        this.selectedAppointment.id,

      patientName:
        this.selectedAppointment.patientName,

      uhid:
        this.selectedAppointment.uhid,

      doctor:
        this.selectedAppointment.doctor,

      department:
        this.selectedAppointment.department,

      room:
        this.selectedAppointment.room,

      appointmentTime:
        this.selectedAppointment.appointmentTime,

      checkInTime:
        this.getCurrentTime(),

      checkInDate:
        this.getCurrentDate()
    };

    localStorage.setItem(
      'currentCheckIn',
      JSON.stringify(checkInData)
    );

    this.showConfirmModal = false;

    this.showSuccessModal = true;
  }

  // ==============================
  // View Queue
  // ==============================

  viewQueue(): void {
    if (!this.selectedAppointment) {
      return;
    }

    this.router.navigate(
      ['/front-office/doctor-queue'],
      {
        queryParams: {
          doctor: this.selectedAppointment.doctor
        }
      }
    );
  }

  // ==============================
  // Done
  // ==============================

  done(): void {

    this.showSuccessModal = false;

    this.selectedAppointment = null;
  }

  // ==============================
  // Modal close
  // ==============================

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  // ==============================
  // Current date/time
  // ==============================

  getCurrentTime(): string {

    return new Date().toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
    );
  }

  getCurrentDate(): string {

    return new Date().toLocaleDateString(
      'en-IN'
    );
  }

  // ==============================
  // TrackBy
  // ==============================

  trackById(
    index: number,
    appointment: Appointment
  ): number {

    return appointment.id;
  }
}