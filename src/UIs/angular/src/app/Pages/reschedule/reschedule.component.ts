import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: "app-reschedule",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./reschedule.component.html",
  styleUrl: "./reschedule.component.css",
})
export class RescheduleComponent {


  form!: FormGroup;

  appointment: any;

  minDate = '';

  selectedTime = '';

  timeSlots = [
    { time: '09:00 AM', disabled: false },
    { time: '09:30 AM', disabled: false },
    { time: '10:00 AM', disabled: false },
    { time: '10:30 AM', disabled: false },
    { time: '11:00 AM', disabled: false },
    { time: '11:30 AM', disabled: true },
    { time: '12:00 PM', disabled: false },
    { time: '12:30 PM', disabled: false }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      otherReason: ['']
    });

    const data = localStorage.getItem('appointmentToReschedule');

    if (data) {
      this.appointment = JSON.parse(data);

      const currentDate = new Date(this.appointment.date);

      currentDate.setDate(currentDate.getDate() + 1);

      this.minDate = currentDate.toISOString().split('T')[0];
    }

    this.form.get('reason')?.valueChanges.subscribe(value => {

      const otherControl = this.form.get('otherReason');

      if (value === 'other') {
        otherControl?.setValidators([Validators.required]);
      } else {
        otherControl?.clearValidators();
        otherControl?.setValue('');
      }

      otherControl?.updateValueAndValidity();
    });

  }

  selectTime(slot: any): void {

    if (slot.disabled) {
      return;
    }

    this.selectedTime = slot.time;
  }

  confirmReschedule(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedTime) {
      alert('Please select a new appointment time.');
      return;
    }

    this.appointment.currentDate = this.appointment.date;
    this.appointment.currentTime = this.appointment.time;

    this.appointment.date = this.formatDate(
      this.form.value.appointmentDate
    );

    this.appointment.time = this.selectedTime;

    this.appointment.newDate = this.appointment.date;
    this.appointment.newTime = this.selectedTime;

    this.appointment.reason = this.form.value.reason;

    this.appointment.otherReason =
      this.form.value.otherReason;

    localStorage.setItem(
      'appointmentToReschedule',
      JSON.stringify(this.appointment)
    );

    // Angular Routing
    // this.router.navigate(['/reschedule-success']);

    window.location.href = 'reschedule-success.html';
  }

  cancel(): void {
    history.back();
  }

  formatDate(date: string): string {

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  }

}
