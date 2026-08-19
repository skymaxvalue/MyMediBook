import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-booking-successfull",
  imports: [],
  templateUrl: "./booking-successfull.component.html",
  styleUrl: "./booking-successfull.component.css",
})
export class BookingSuccessfullComponent implements OnInit {

  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  @Input() bookingPatient: any;
  patientName: any = '';
  constructor(private router: Router) {
    console.log(this.doctor, this.selectedDate, this.selectedSlot, this.bookingPatient)
  }
  ngOnInit() {
    console.log(this.doctor, this.selectedDate, this.selectedSlot, this.bookingPatient)
    if (this.bookingPatient?.firstName && this.bookingPatient?.lastName) {
      this.patientName = this.bookingPatient.firstName + " " + this.bookingPatient.lastName
    } else {
      this.patientName = this.bookingPatient.patientName

    }
  }
  goBack() {
    this.router.navigate(['/patient/dashboard/appointments'])
  }

}
