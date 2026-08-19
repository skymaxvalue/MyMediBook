import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-reschedule-success",
  imports: [CommonModule],
  templateUrl: "./reschedule-success.component.html",
  styleUrl: "./reschedule-success.component.css",
})
export class RescheduleSuccessComponent implements OnInit {
  constructor(private router: Router) {

  }
  appointment: any;

  ngOnInit(): void {
    const data = localStorage.getItem('appointmentToReschedule');

    if (data) {
      this.appointment = JSON.parse(data);
    }
  }

  backToDashboard(): void {
    localStorage.removeItem('appointmentToReschedule')
    this.router.navigate(['/patient/dashboard/appointments']);
  }

  downloadConfirmation(): void {
    window.print();
  }
}
