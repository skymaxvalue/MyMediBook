import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ConfirmationConfig, ModalSeviceService } from "src/app/Services/modal-sevice.service";

@Component({
  selector: "app-confirmation-modal",
  imports: [CommonModule],
  templateUrl: "./confirmation-modal.component.html",
  styleUrl: "./confirmation-modal.component.css",
})
export class ConfirmationModalComponent {
  isVisible = false;
  config!: ConfirmationConfig;

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
}