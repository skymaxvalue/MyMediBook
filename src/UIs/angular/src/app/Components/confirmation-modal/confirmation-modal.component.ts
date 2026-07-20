import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalSeviceService } from "src/app/Services/modal-sevice.service";
import { ConfirmationModalConfig } from "src/app/Utility/EndPointsOfAPI";

@Component({
  selector: "app-confirmation-modal",
  imports: [CommonModule,
    FormsModule],
  templateUrl: "./confirmation-modal.component.html",
  styleUrl: "./confirmation-modal.component.css",
})
export class ConfirmationModalComponent {
  isVisible = false;
  cancelReason = '';
  config!: ConfirmationModalConfig;

  constructor(private confirmationService: ModalSeviceService, private router: Router) { }

  ngOnInit() {
    console.log('Modal Init');

    this.confirmationService.confirmation$.subscribe(config => {
      console.log('Received Config', config);
      this.config = config;
      this.isVisible = true;
    });
  }

  confirm() {
    // Validate first
    if (this.config.type === 'cancel' && !this.cancelReason.trim()) {
      alert('Please enter the cancellation reason.');
      return;
    }

    // Close modal only after validation succeeds
    this.isVisible = false;

    if (this.config.type === 'cancel') {
      this.confirmationService.confirm(true, this.cancelReason.trim());
    }

    // Clear reason for next time
    this.cancelReason = '';
  }
  reschedulConfirm() {
    this.isVisible = false;
    this.confirmationService.confirm(true);
  }

  cancel() {
    this.isVisible = false;
    this.confirmationService.confirm(false);
  }
  closeCancelModal() {
    this.isVisible = false;
    this.cancelReason = '';
    this.confirmationService.confirm(false);
  }
  openPolicy(): void {

    if (this.config.type == "cancel") {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/cancellation-policy'])

      );
      window.open(url, '_blank');
    } else {

      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/reschedullation-policy'])
      );
      window.open(url, '_blank');
    }


  }
}