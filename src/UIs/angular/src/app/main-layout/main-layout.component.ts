import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavComponent } from "../core/nav.component";
import { NotificationComponent } from "../core/notification.component";
import { NavbarComponent } from "../Components/navbar/navbar.component";
import { FooterComponent } from "../Components/footer/footer.component";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, NavbarComponent, NotificationComponent, FooterComponent],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent { }
