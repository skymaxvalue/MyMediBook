import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { NavComponent } from "../nav.component";
import { NotificationComponent } from "../notification.component";
import { NavbarComponent } from "src/app/shared/Components/navbar/navbar.component";
import { FooterComponent } from "src/app/shared/Components/footer/footer.component";
import { ConfirmationModalComponent } from "src/app/shared/Components/confirmation-modal/confirmation-modal.component";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, NavbarComponent, NotificationComponent, FooterComponent, ConfirmationModalComponent],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent {
  CurrentUrl: string;

  constructor(private router: Router) {

    this.CurrentUrl = this.router.url
    this.router.events.subscribe(() => {
      window.scrollTo(0, 0);
    });

  }

}
