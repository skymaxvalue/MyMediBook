import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Appointment {
  id: number;
  patientName: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
  doctorName: string;
  roomNumber: string;
  department: string;
}

@Component({
  selector: "app-patient-check-in",
  imports: [FormsModule],
  templateUrl: "./patient-check-in.component.html",
  styleUrl: "./patient-check-in.component.css",
})
export class PatientCheckInComponent {
  patientName = signal('');
  dob = signal('');
  doctorName = signal('');


  showDoctorDropdown = signal(false);

  doctors = [
    'Dr. Arun',
    'Dr. Sneha Nair',
    'Dr. Rajesh Kumar',
    'Dr. Priya Sharma'
  ];

  filteredDoctors = computed(() => {
    const search = this.doctorName().toLowerCase();

    if (!search) {
      return this.doctors;
    }

    return this.doctors.filter(doctor =>
      doctor.toLowerCase().includes(search)
    );
  });


  appointments = signal<Appointment[]>([
    {
      id: 1,
      patientName: 'Ramesh Patil',
      dob: '1995-05-12',
      address: 'Pune, Maharashtra',
      phone: '9876543210',
      email: 'ramesh@gmail.com',
      doctorName: 'Dr. Arun',
      roomNumber: '101',
      department: 'General Physician'
    },
    {
      id: 2,
      patientName: 'Sneha Sharma',
      dob: '1998-08-20',
      address: 'Mumbai, Maharashtra',
      phone: '9876501234',
      email: 'sneha@gmail.com',
      doctorName: 'Dr. Sneha Nair',
      roomNumber: '102',
      department: 'General Physician'
    }
  ]);

  filteredAppointments = signal<Appointment[]>([]);

  selectedPatient = signal<Appointment | null>(null);


  showConfirmModal = signal(false);
  showSuccessModal = signal(false);


  searchAppointments() {

    const name = this.patientName().trim().toLowerCase();
    const dob = this.dob();
    const doctor = this.doctorName().trim().toLowerCase();

    const results = this.appointments().filter(appointment => {

      const nameMatch =
        !name ||
        appointment.patientName.toLowerCase().includes(name);

      const dobMatch =
        !dob ||
        appointment.dob === dob;

      const doctorMatch =
        !doctor ||
        appointment.doctorName.toLowerCase().includes(doctor);

      return nameMatch && dobMatch && doctorMatch;
    });

    this.filteredAppointments.set(results);
  }


  openDoctorDropdown() {
    this.showDoctorDropdown.set(true);
  }

  selectDoctor(doctor: string) {
    this.doctorName.set(doctor);
    this.showDoctorDropdown.set(false);
  }

  selectPatient(patient: Appointment) {
    this.selectedPatient.set(patient);
  }


  openConfirmModal() {

    if (!this.selectedPatient()) {
      return;
    }

    this.showConfirmModal.set(true);
  }

  confirmCheckIn() {

    const patient = this.selectedPatient();

    if (!patient) {
      return;
    }

    this.showConfirmModal.set(false);
    this.showSuccessModal.set(true);
  }


  closeConfirmModal() {
    this.showConfirmModal.set(false);
  }

  closeSuccessModal() {
    this.showSuccessModal.set(false);
    this.selectedPatient.set(null);
  }



  formatDate(date: string): string {

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}