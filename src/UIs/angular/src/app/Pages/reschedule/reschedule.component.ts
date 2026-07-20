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

  constructor(private fb: FormBuilder, private router: Router, private store: Store<AppState>) {


  }

  ngOnInit() {
    const navigation = this.router.currentNavigation();
    console.log(history.state);
    if (history.state) {
      const state = history.state
      this.appointment = state.appointment
      console.log(this.appointment);
      const [datePart] = this.appointment.appointmentDate.split(' ');
      const [month, day, year] = datePart.split('/');

      const localDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;

      this.form = this.fb.group({
        appointmentDate: [localDate.split('T')[0], Validators.required],
        reason: ['', Validators.required],
        otherReason: [''],
        visitPurpose: [this.appointment.visitPurpose, Validators.required],
        visitType: [this.appointment.visitType, Validators.required]


      });

      const payload = {
        associateId: this.appointment.associateId,
        fromDate: localDate,
        toDate: localDate,

      }
      this.store.dispatch(getTimeSloteByDoctorID({ payload }))
      this.store.select(selectGetTimeSlotOfDoctor)
        .subscribe((res: any) => {

          if (res?.data) {

            this.timeSlots = res.data.map((slot: any) => ({
              time: slot.startTime,
              booked: slot.isBooked,
              slotId: slot.slotId,
              isAvailable: slot.isAvailable,
              disabled: false
            }));
            if (this.isToday(localDate)) {
              this.disablePastSlots();
            }

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


    // const data = localStorage.getItem('appointmentToReschedule');



    const currentDate = new Date(this.appointment.appointmentDate);

    if (!isNaN(currentDate.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      currentDate.setDate(currentDate.getDate() + 1);
      this.minDate = today.toISOString().split('T')[0];
    }





    currentDate.setDate(currentDate.getDate() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today.toISOString().split('T')[0];

    // const currentDate = new Date(this.appointment.date);



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
    this.selectedTime = ""
    const selectedDate = `${event.target.value}T00:00:00`
    const payload = {
      associateId: this.appointment.associateId,
      fromDate: selectedDate,
      toDate: selectedDate
    };
    await this.store.dispatch(getTimeSloteByDoctorID({ payload }))
    await this.store.select(selectGetTimeSlotOfDoctor)
      .subscribe((res: any) => {
        if (res?.data) {
          this.timeSlots = res.data.map((slot: any) => ({
            time: slot.startTime,
            booked: slot.isBooked,
            slotId: slot.slotId,
            isAvailable: slot.isAvailable,
            disabled: false
          }));
          console.log("Selected Value:", new Date(event.target.value));
          const date: any = new Date(event.target.value);
          if (this.isToday(event.target.value)) {
            this.disablePastSlots();
          }

        }
      })
  }
  async confirmReschedule() {

    if (this.form.invalid) {
      alert("Please select reschedule reason")
      this.form.markAllAsTouched();
      return;
    }

    if (!this.selectedTime) {
      alert('Please select a new appointment time.');
      return;
    }

    this.appointment.currentDate = this.appointment.date ? this.appointment.date : this.appointment.appointmentDate;
    this.appointment.currentTime = this.appointment.time;

    this.appointment.date = this.formatDate(
      this.form.value.appointmentDate
    );

    this.appointment.time = this.selectedTime;

    this.appointment.newDate = this.appointment.date ? this.appointment.date : this.appointment.appointmentDate;;
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
    localStorage.removeItem('appointmentToReschedule')
    history.back();
  }
  disablePastSlots() {
    console.log("disablePastSlots called");
    const now = new Date();

    this.timeSlots.forEach((slot: any) => {

      const slotDate = this.convertToDate(slot.time);

      slot.disabled =
        slot.booked ||
        !slot.isAvailable ||
        slotDate <= now;

    });

  }
  private isToday(date: string): boolean {

    const today = new Date();


    const todayString =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return todayString === date;
  }
  private convertToDate(time: string): Date {

    const now = new Date();

    const [timePart, meridian] = time.trim().split(' ');

    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridian === 'PM' && hours !== 12) {
      hours += 12;
    }

    if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );
  }

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const d = new Date(date);

    if (isNaN(d.getTime())) {
      return '';
    }
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

  }

}
