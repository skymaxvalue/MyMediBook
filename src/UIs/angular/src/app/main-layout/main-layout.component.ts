import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavComponent } from "../core/nav.component";
import { NotificationComponent } from "../core/notification.component";

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, NavComponent, NotificationComponent],
  templateUrl: "./main-layout.component.html",
  styleUrl: "./main-layout.component.css",
})
export class MainLayoutComponent {}
