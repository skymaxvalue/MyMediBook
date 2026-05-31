import { Component, Input } from "@angular/core";

@Component({
  selector: "app-booking-successfull",
  imports: [],
  templateUrl: "./booking-successfull.component.html",
  styleUrl: "./booking-successfull.component.css",
})
export class BookingSuccessfullComponent {

  @Input() doctor: any;
  @Input() selectedDate: any;
  @Input() selectedSlot: any;
  @Input() bookingPatient: any;
  goBack() {
    window.location.reload();
  }

}
