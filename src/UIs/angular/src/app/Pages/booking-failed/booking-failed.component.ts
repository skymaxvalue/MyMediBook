import { Component, Input } from "@angular/core";

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
  goBack() {
    window.location.reload();
  }

}
