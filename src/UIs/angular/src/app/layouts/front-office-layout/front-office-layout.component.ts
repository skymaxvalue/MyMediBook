import { Component } from "@angular/core";
import { FrontOfficeFooterComponent } from "./front-office-footer/front-office-footer.component";
import { FrontOfficeSidebarComponent } from "./front-office-sidebar/front-office-sidebar.component";
import { RouterOutlet } from "@angular/router";
import { FrontOfficeHeaderComponent } from "./front-office-header/front-office-header.component";


@Component({
  selector: "app-front-office-layout",
  imports: [RouterOutlet, FrontOfficeSidebarComponent, FrontOfficeFooterComponent, FrontOfficeHeaderComponent],
  templateUrl: "./front-office-layout.component.html",
  styleUrl: "./front-office-layout.component.css",
})
export class FrontOfficeLayoutComponent {
  constructor() {

  }
}
