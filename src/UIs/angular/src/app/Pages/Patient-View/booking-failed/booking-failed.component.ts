import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-booking-failed",
  imports: [],
  templateUrl: "./booking-failed.component.html",
  styleUrl: "./booking-failed.component.css",
})
export class BookingFailedComponent {
  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  @Input() bookingPatient: any;
  constructor(private router: Router) {

  }
  goBack() {
    this.router.navigate(['/patient/dashboard/appointments'])
  }

}
