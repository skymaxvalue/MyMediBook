import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { rescheduleMyAppointment } from "src/app/Store/Appointments/appointment.actions";
import { selectRescheduledAppointment } from "src/app/Store/Appointments/appointment.selcetors";
import { getTimeSloteByDoctorID } from "src/app/Store/Doctor/doctor.action";
import { selectGetTimeSlotOfDoctor } from "src/app/Store/Doctor/doctor.selectors";

@Component({
  selector: "app-reschedule",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./reschedule.component.html",
  styleUrl: "./reschedule.component.css",
})
export class RescheduleComponent implements OnInit {
  logdinUser = JSON.parse(localStorage.getItem('user') || 'null')

  form!: FormGroup;

  appointment: any;

  minDate = '';

  selectedTime = '';
  timeSlots = []
  selectedSlot: any = {};
  // timeSlots = [
  //   { time: '09:00 AM', disabled: false },
  //   { time: '09:30 AM', disabled: false },
  //   { time: '10:00 AM', disabled: false },
  //   { time: '10:30 AM', disabled: false },
  //   { time: '11:00 AM', disabled: false },
  //   { time: '11:30 AM', disabled: true },
  //   { time: '12:00 PM', disabled: false },
  //   { time: '12:30 PM', disabled: false }
  // ];

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>) { }

  async ngOnInit(): Promise<void> {
    const navigation = this.router.currentNavigation();
    console.log(history.state);
    if (history.state) {
      const state = history.state
      this.appointment = state.appointment
      console.log(this.appointment);
      const [datePart] = this.appointment.appointmentDate.split(' ');
      const [month, day, year] = datePart.split('/');

      const localDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;


      // Create local midnight (IST)
      const payload = {
        associateId: this.appointment.associateId,
        fromDate: localDate,
        toDate: localDate,

      }
      await this.store.dispatch(getTimeSloteByDoctorID({ payload }))
      await this.store.select(selectGetTimeSlotOfDoctor)
        .subscribe((res: any) => {

          if (res?.data) {

            this.timeSlots = res.data.map((slot: any) => ({
              time: slot.startTime,
              booked: slot.isBooked,
              slotId: slot.slotId,
              isAvailable: slot.isAvailable
            }));

            // this.showSlotsModal = true;


            // console.log(res, "=========>")
            // let bookedSlots: string[] = [];

            // if (item.badgeClass === 'red') {
            //   bookedSlots = this.allSlots.slice(0, 10);
            // } else {
            //   bookedSlots = this.allSlots.slice(0, 3);
            // }

            // this.slots = this.allSlots.map(slot => ({
            //   time: slot,
            //   booked: bookedSlots.includes(slot)
            // }));
            // this.showSlotsModal = true;
          }
        })
    }

    this.form = this.fb.group({
      appointmentDate: ['', Validators.required],
      reason: ['', Validators.required],
      otherReason: [''],
      visitPurpose: [this.appointment.visitPurpose, Validators.required],
      visitType: [this.appointment.visitType, Validators.required]


    });

    // const data = localStorage.getItem('appointmentToReschedule');


    // this.appointment = JSON.parse(data);

    const currentDate = new Date(this.appointment.date);

    currentDate.setDate(currentDate.getDate() + 1);

    this.minDate = currentDate.toISOString().split('T')[0];

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
    this.selectedSlot = slot
    this.selectedTime = slot.time;
  }

  async onDateSelect(event: any) {
    const payload = {
      associateId: this.appointment.associateId,
      fromDate: new Date(`${event.target.value}T00:00:00`).toISOString(),
      toDate: new Date(`${event.target.value}T00:00:00`).toISOString()
    };
    await this.store.dispatch(getTimeSloteByDoctorID({ payload }))
    await this.store.select(selectGetTimeSlotOfDoctor)
      .subscribe((res: any) => {
        if (res?.data) {
          this.timeSlots = res.data.map((slot: any) => ({
            time: slot.startTime,
            booked: slot.isBooked,
            slotId: slot.slotId,
            isAvailable: slot.isAvailable
          }));

          // this.showSlotsModal = true;


          // console.log(res, "=========>")
          // let bookedSlots: string[] = [];

          // if (item.badgeClass === 'red') {
          //   bookedSlots = this.allSlots.slice(0, 10);
          // } else {
          //   bookedSlots = this.allSlots.slice(0, 3);
          // }

          // this.slots = this.allSlots.map(slot => ({
          //   time: slot,
          //   booked: bookedSlots.includes(slot)
          // }));
          // this.showSlotsModal = true;
        }
      })
  }
  async confirmReschedule() {

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
    const payload = {

      appointmentId: this.appointment.appointmentId,
      patientId: this.appointment.patientId,
      associateId: this.appointment.associateId,
      slotId: this.selectedSlot.slotId,
      visitPurpose: this.form.value.visitPurpose,
      visitType: this.form.value.visitType,
      lastUpdatedBy: this.logdinUser.firstName + " " + this.logdinUser.middleName + " " + this.logdinUser.lastName,
      associateRole: this.logdinUser.roleName,
      rescheduleReason: this.form.value.reason

    }

    await this.store.dispatch(rescheduleMyAppointment({ ...payload }))
    await this.store.select(selectRescheduledAppointment).subscribe((res: any) => {
      if (res) {


        console.log(res, "====>")

        this.router.navigate(
          ['/patient/dashboard/appointment-reschedule-successfull'],
          {
            // state: {
            //   appointment
            // }
          }
        );
        // this.store.dispatch(getMyAppointments({ patientId: this.updatesheduledpatient.patientId }))


      }
    })

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
