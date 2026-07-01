import { Component } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { NavComponent } from "../core/nav.component";
import { NotificationComponent } from "../core/notification.component";
import { NavbarComponent } from "../Components/navbar/navbar.component";
import { FooterComponent } from "../Components/footer/footer.component";
import { ConfirmationModalComponent } from "../Components/confirmation-modal/confirmation-modal.component";

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
