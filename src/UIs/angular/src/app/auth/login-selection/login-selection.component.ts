import { Component } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-login-selection",
  imports: [],
  templateUrl: "./login-selection.component.html",
  styleUrl: "./login-selection.component.css",
})
export class LoginSelectionComponent {
  constructor(private router: Router) { }

  onLoginTypeChange(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;

    const loginType = selectElement.value;

    if (!loginType) {
      return;
    }

    switch (loginType) {

      case 'front-office':
        this.router.navigate(['/front-office/login']);
        break;

      case 'patient':
        this.router.navigate(['/patient/login']);
        break;

      case 'admin':
        this.router.navigate(['/admin/login']);
        break;

    }
  }

}