import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NotificationComponent } from "src/app/core/notification.component";
import { PatientFooterComponent } from "./patient-footer/patient-footer.component";
import { PatientHeaderComponent } from "./patient-header/patient-header.component";
import { ConfirmationModalComponent } from "src/app/shared/Components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-patient-layout",
  imports: [NotificationComponent, RouterOutlet, PatientHeaderComponent, PatientFooterComponent, ConfirmationModalComponent],
  templateUrl: "./patient-layout.component.html",
  styleUrl: "./patient-layout.component.css",
})
export class PatientLayoutComponent { }
