import { Component } from "@angular/core";
import { AdminSidebarComponent } from "./admin-sidebar/admin-sidebar.component";
import { AdminFooterComponent } from "./admin-footer/admin-footer.component";
import { AdminHeaderComponent } from "./admin-header/admin-header.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-admin-layout",
  imports: [AdminSidebarComponent, AdminHeaderComponent, AdminFooterComponent, RouterOutlet],
  templateUrl: "./admin-layout.component.html",
  styleUrl: "./admin-layout.component.css",
})
export class AdminLayoutComponent { }
