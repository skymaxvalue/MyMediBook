import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Doctor {
  name: string;
  department: string;
  room: string;
}

interface QueuePatient {
  id: number;
  name: string;
  time: string;
  checkedIn: boolean;
  status: string;
  uhid?: string;
}

@Component({
  selector: 'app-doctor-queue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './doctor-queue.component.html',
  styleUrl: './doctor-queue.component.css'
})
export class DoctorQueueComponent implements OnInit {

  @ViewChild('dateInput')
  dateInput!: ElementRef<HTMLInputElement>;

  selectedDate = '2026-04-10';
  // ==========================================
  // DOCTOR
  // ==========================================

  doctor: Doctor = {
    name: 'Dr. Kumaravel',
    department: 'General Physician',
    room: '#5, 2nd Floor'
  };

  // ==========================================
  // QUEUE
  // ==========================================

  queuePatients: QueuePatient[] = [];

  selectedPatient: QueuePatient | null = null;


  openCalendar(): void {

    const input = this.dateInput.nativeElement;

    if (input.showPicker) {
      input.showPicker();
    } else {
      input.click();
    }
  }


  // ==========================================
  // MODALS
  // ==========================================

  showConfirmModal = false;
  showSuccessModal = false;

  checkInTime = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }


  // ==========================================
  // GETTERS
  // ==========================================

  get doctorName(): string {
    return this.doctor.name;
  }

  get doctorDepartment(): string {
    return this.doctor.department;
  }

  get doctorRoom(): string {
    return this.doctor.room;
  }

  get queueDateLabel(): string {

    if (!this.selectedDate) {
      return '';
    }

    const date = new Date(
      this.selectedDate + 'T00:00:00'
    );

    if (isNaN(date.getTime())) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const weekdayNames = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];

    const month =
      monthNames[date.getMonth()];

    const year =
      date.getFullYear();

    const weekday =
      weekdayNames[date.getDay()];

    return `${day}-${month}-${year} (${weekday})`;
  }


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.getSelectedDoctor();

    this.setDefaultDate();

    this.loadQueue();
  }


  // ==========================================
  // GET SELECTED DOCTOR
  // ==========================================

  getSelectedDoctor(): void {

    const storedDoctor =
      localStorage.getItem('selectedDoctor');

    if (storedDoctor) {

      try {

        this.doctor = JSON.parse(storedDoctor);

      } catch (error) {

        console.error(
          'Unable to read selected doctor',
          error
        );

      }
    }

    this.route.queryParams.subscribe(params => {

      const doctorName = params['doctor'];

      if (doctorName) {
        this.doctor.name = doctorName;
      }

    });
  }


  // ==========================================
  // DATE
  // ==========================================

  setDefaultDate(): void {

    const today = new Date();

    this.selectedDate =
      this.formatDateForInput(today);
  }


  formatDateForInput(date: Date): string {

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, '0');

    const day =
      String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  onDateChange(): void {

    this.loadQueue();
  }


  // ==========================================
  // LOAD QUEUE
  // ==========================================

  loadQueue(): void {

    const storedQueue =
      localStorage.getItem(
        'myMediBookDoctorQueue'
      );

    if (!storedQueue) {

      this.queuePatients = [];

      return;
    }

    try {

      const queueData =
        JSON.parse(storedQueue);

      this.queuePatients =
        queueData[this.selectedDate] || [];

    } catch (error) {

      console.error(
        'Unable to load queue',
        error
      );

      this.queuePatients = [];
    }
  }


  // ==========================================
  // CHECK-IN
  // ==========================================

  openConfirmModal(
    patient: QueuePatient
  ): void {

    if (patient.checkedIn) {
      return;
    }

    this.selectedPatient = patient;

    this.showConfirmModal = true;
  }


  confirmCheckIn(): void {

    if (!this.selectedPatient) {
      return;
    }

    const storedQueue =
      localStorage.getItem(
        'myMediBookDoctorQueue'
      );

    if (!storedQueue) {
      return;
    }

    try {

      const queueData =
        JSON.parse(storedQueue);

      const patients =
        queueData[this.selectedDate];

      if (!patients) {
        return;
      }

      const patient =
        patients.find(
          (item: QueuePatient) =>
            item.id === this.selectedPatient?.id
        );

      if (!patient) {
        return;
      }

      // Check-in
      patient.checkedIn = true;

      // Move to next queue
      patient.status = 'Next in queue';

      // Save
      localStorage.setItem(
        'myMediBookDoctorQueue',
        JSON.stringify(queueData)
      );

      // Check-in time
      this.checkInTime =
        this.formatCheckInTime();

      // Close confirmation
      this.showConfirmModal = false;

      // Refresh queue
      this.loadQueue();

      // Show success
      this.showSuccessModal = true;

    } catch (error) {

      console.error(
        'Unable to confirm check-in',
        error
      );

    }
  }


  // ==========================================
  // STATUS
  // ==========================================

  updatePatientStatus(
    patient: QueuePatient
  ): void {

    this.saveQueue();
  }


  saveQueue(): void {

    const storedQueue =
      localStorage.getItem(
        'myMediBookDoctorQueue'
      );

    if (!storedQueue) {
      return;
    }

    try {

      const queueData =
        JSON.parse(storedQueue);

      queueData[this.selectedDate] =
        this.queuePatients;

      localStorage.setItem(
        'myMediBookDoctorQueue',
        JSON.stringify(queueData)
      );

    } catch (error) {

      console.error(
        'Unable to save queue',
        error
      );

    }
  }


  // ==========================================
  // CHECK-IN TIME
  // ==========================================

  formatCheckInTime(): string {

    const now = new Date();

    let hours =
      now.getHours();

    const minutes =
      String(
        now.getMinutes()
      ).padStart(2, '0');

    const period =
      hours >= 12 ? 'PM' : 'AM';

    hours =
      hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    const day =
      String(
        now.getDate()
      ).padStart(2, '0');

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const month =
      monthNames[now.getMonth()];

    const year =
      now.getFullYear();

    return `${hours}:${minutes} ${period}, ${day} ${month} ${year}`;
  }


  // ==========================================
  // CONFIRM MODAL
  // ==========================================

  closeConfirmModal(): void {

    this.showConfirmModal = false;

    this.selectedPatient = null;
  }


  closeConfirmModalOnOutsideClick(
    event: MouseEvent
  ): void {

    if (
      event.target ===
      event.currentTarget
    ) {
      this.closeConfirmModal();
    }
  }


  // ==========================================
  // SUCCESS MODAL
  // ==========================================

  closeSuccessModal(): void {

    this.showSuccessModal = false;

    this.selectedPatient = null;
  }


  closeSuccessModalOnOutsideClick(
    event: MouseEvent
  ): void {

    if (
      event.target ===
      event.currentTarget
    ) {
      this.closeSuccessModal();
    }
  }


  // ==========================================
  // VIEW QUEUE
  // ==========================================

  viewQueue(): void {

    this.showSuccessModal = false;

    this.selectedPatient = null;

    this.loadQueue();
  }


  // ==========================================
  // DONE
  // ==========================================

  done(): void {

    this.showSuccessModal = false;

    this.selectedPatient = null;
  }


  // ==========================================
  // BACK
  // ==========================================

  backToSearch(): void {

    this.router.navigate([
      '/front-office/patient-check-in'
    ]);
  }

}