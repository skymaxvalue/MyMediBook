import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface AppointmentData {
  firstName?: string;
  lastName?: string;
  date?: string;
  time?: string;
  visitType?: string;
}

interface SummaryRow {
  label: string;
  value: string;
  mono?: boolean;
}

@Component({
  selector: "app-succses",
  imports: [CommonModule,
    RouterModule],
  templateUrl: "./succses.component.html",
  styleUrl: "./succses.component.css",
})
export class SuccsesComponent implements OnInit {

  appointment: AppointmentData | null = null;

  summaryRows: SummaryRow[] = [];

  showSuccess = false;
  showEmpty = false;

  private readonly BOOKING_ID_KEY = 'latestBookingId';
  private readonly BOOKING_ID_FOR_KEY = 'latestBookingIdFor';
  displayData: any;

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.loadAppointmentData();
    this.displayData = history.state.successData;

  }

  private loadAppointmentData(): void {

    try {

      const raw = localStorage.getItem('latestAppointment');

      if (!raw) {
        this.showEmptyState();
        return;
      }

      const data: AppointmentData = JSON.parse(raw);

      if (!data) {
        this.showEmptyState();
        return;
      }

      this.appointment = data;

      this.getBookingId(data);

      this.summaryRows = this.buildSummaryRows(data);

      this.showSuccessState();

    } catch (error) {

      console.error(
        'Error reading appointment data:',
        error
      );

      this.showEmptyState();
    }
  }

  private getBookingId(
    data: AppointmentData
  ): string {

    const fingerprint = JSON.stringify(data);

    const storedFor =
      localStorage.getItem(this.BOOKING_ID_FOR_KEY);

    const storedId =
      localStorage.getItem(this.BOOKING_ID_KEY);

    // Same appointment → keep same booking ID
    if (
      storedId &&
      storedFor === fingerprint
    ) {
      return storedId;
    }


    const id =
      'APT-' +
      Date.now()
        .toString()
        .slice(-8);

    localStorage.setItem(
      this.BOOKING_ID_KEY,
      id
    );

    localStorage.setItem(
      this.BOOKING_ID_FOR_KEY,
      fingerprint
    );

    return id;
  }



  private formatDate(value?: string): string {

    if (
      !value ||
      value === 'Not Selected'
    ) {
      return value || 'Not selected';
    }

    const parsed = new Date(value);

    if (isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  }


  private buildSummaryRows(
    data: AppointmentData
  ): SummaryRow[] {

    const patientName =
      [
        data.firstName,
        data.lastName
      ]
        .filter(Boolean)
        .join(' ') || '—';

    const doctorName =
      localStorage.getItem(
        'selectedDoctorName'
      ) || 'Dr. Kumar';

    const specialty =
      localStorage.getItem(
        'selectedSpecialty'
      ) || 'General Physician';

    const consultationType =
      data.visitType ||
      localStorage.getItem(
        'selectedVisitType'
      ) ||
      'Consultation';

    return [

      {
        label: 'Patient Name',
        value: patientName
      },

      {
        label: 'Doctor',
        value: doctorName
      },

      {
        label: 'Specialty',
        value: specialty
      },

      {
        label: 'Date',
        value: this.formatDate(data.date)
      },

      {
        label: 'Time',
        value: data.time || 'Not selected'
      },

      {
        label: 'Consultation Type',
        value: consultationType
      }

    ];
  }


  private showSuccessState(): void {

    this.showSuccess = true;
    this.showEmpty = false;
  }

  private showEmptyState(): void {

    this.showSuccess = false;
    this.showEmpty = true;
  }


  goToDashboard(): void {

    this.router.navigate([
      '/front-office/dashboard'
    ]);
  }

  bookAnotherAppointment(): void {

    this.router.navigate([
      '/front-office/specialities'
    ]);
  }

  goToBookAppointment(): void {

    this.router.navigate([
      '/front-office/book-appointment'
    ]);
  }


  contactSupport(): void {

    // Replace with your actual support route
    this.router.navigate([
      '/front-office/contact-support'
    ]);
  }
}
