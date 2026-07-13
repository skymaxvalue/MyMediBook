import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {  ModalSeviceService } from "src/app/Services/modal-sevice.service";
import { ConfirmationModalConfig } from "src/app/Utility/EndPointsOfAPI";

@Component({
  selector: "app-confirmation-modal",
  imports: [CommonModule],
  templateUrl: "./confirmation-modal.component.html",
  styleUrl: "./confirmation-modal.component.css",
})
export class ConfirmationModalComponent {
  isVisible = false;
  config!: ConfirmationModalConfig;

  constructor(private confirmationService: ModalSeviceService) { }

  ngOnInit() {
    console.log('Modal Init');

    this.confirmationService.confirmation$.subscribe(config => {
      console.log('Received Config', config);
      this.config = config;
      this.isVisible = true;
    });
  }

  confirm() {
    this.isVisible = false;
    this.confirmationService.confirm(true);
  }

  cancel() {
    this.isVisible = false;
    this.confirmationService.confirm(false);
  }
  closeCancelModal() {
    this.isVisible = false
  }
}