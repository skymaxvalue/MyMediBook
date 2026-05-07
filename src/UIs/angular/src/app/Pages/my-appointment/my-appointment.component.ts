import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-my-appointment",
  imports: [CommonModule],
  templateUrl: "./my-appointment.component.html",
  styleUrl: "./my-appointment.component.css",
})
export class MyAppointmentComponent {
  @Input() tableData: any[] = [];
}
