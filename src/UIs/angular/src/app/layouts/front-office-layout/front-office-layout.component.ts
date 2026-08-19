import { Component, OnInit } from "@angular/core";
import { FrontOfficeFooterComponent } from "./front-office-footer/front-office-footer.component";
import { FrontOfficeSidebarComponent } from "./front-office-sidebar/front-office-sidebar.component";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FrontOfficeHeaderComponent } from "./front-office-header/front-office-header.component";
import { filter } from "rxjs";


@Component({
  selector: "app-front-office-layout",
  imports: [RouterOutlet, RouterLink,
    //  FrontOfficeSidebarComponent
    // ,
    FrontOfficeFooterComponent, FrontOfficeHeaderComponent],
  templateUrl: "./front-office-layout.component.html",
  styleUrl: "./front-office-layout.component.css",
})
export class FrontOfficeLayoutComponent implements OnInit {
  breadcrumbs: {
    label: string;
    url: string;
  }[] = [];

  constructor(private router: Router) {

  }

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.generateBreadcrumb();
      });

    this.generateBreadcrumb();
  }

  generateBreadcrumb(): void {

    const url = this.router.url;

    this.breadcrumbs = [
      {
        label: 'Dashboard',
        url: '/front-office/dashboard'
      }
    ];

    if (url.includes('patient-registration')) {

      this.breadcrumbs.push({
        label: 'Patient Registration',
        url: '/front-office/patient-registration'
      });

    }

    else if (url.includes('book-appointment')) {

      this.breadcrumbs.push({
        label: 'Book Appointment',
        url: '/front-office/book-appointment'
      });

    }

    else if (url.includes('patient-check-in')) {

      this.breadcrumbs.push({
        label: 'Patient Check-In',
        url: '/front-office/patient-check-in'
      });

    }

    else if (url.includes('lab-service')) {

      this.breadcrumbs.push({
        label: 'Lab Service',
        url: '/front-office/lab-service'
      });

    }

  }
}
