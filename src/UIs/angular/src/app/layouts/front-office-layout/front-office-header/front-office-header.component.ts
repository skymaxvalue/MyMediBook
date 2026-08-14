import {
  Component,
  HostListener,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: "app-front-office-header",
  imports: [],
  templateUrl: "./front-office-header.component.html",
  styleUrl: "./front-office-header.component.css",
})
export class FrontOfficeHeaderComponent implements OnInit, OnDestroy {

  currentDate = '';

  currentTime = '';

  private timer: any;


  username = 'Front Office';


  isProfileOpen = false;


  activePage = 'dashboard';


  constructor(
    private router: Router
  ) { }



  ngOnInit(): void {

    this.updateDate();

    this.updateTime();

    this.loadUser();

    this.startClock();

  }


  updateDate(): void {

    const options: Intl.DateTimeFormatOptions = {

      weekday: 'long',

      day: 'numeric',

      month: 'long',

      year: 'numeric'

    };


    this.currentDate =
      new Date().toLocaleDateString(
        'en-IN',
        options
      );

  }


  updateTime(): void {

    const options: Intl.DateTimeFormatOptions = {

      hour: '2-digit',

      minute: '2-digit',

      hour12: true

    };


    this.currentTime =
      new Date().toLocaleTimeString(
        'en-IN',
        options
      );

  }

  startClock(): void {

    this.timer = setInterval(() => {

      this.updateTime();

    }, 1000);

  }



  loadUser(): void {

    const userData =
      localStorage.getItem('loggedInUser');


    if (!userData) {

      this.username = 'Front Office';

      return;

    }


    try {

      const user = JSON.parse(userData);


      if (user?.name) {

        this.username = user.name;

      } else {

        this.username = 'Front Office';

      }

    }

    catch {

      this.username = 'Front Office';

    }

  }

  toggleProfile(event: Event): void {

    event.stopPropagation();

    this.isProfileOpen =
      !this.isProfileOpen;

  }


  @HostListener('document:click')

  closeProfile(): void {

    this.isProfileOpen = false;

  }


  openProfile(): void {

    this.isProfileOpen = false;

    this.router.navigate([
      '/front-office/profile'
    ]);

  }



  navigate(page: string): void {

    this.activePage = page;


    switch (page) {

      case 'dashboard':

        this.router.navigate([
          '/front-office/dashboard'
        ]);

        break;


      case 'patient-registration':

        this.router.navigate([
          '/front-office/patient-registration'
        ]);

        break;


      case 'book-appointment':

        this.router.navigate([
          '/front-office/book-appointment'
        ]);

        break;


      case 'patient-checkin':

        this.router.navigate([
          '/front-office/patient-checkin'
        ]);

        break;


      case 'lab-service':

        this.router.navigate([
          '/front-office/lab-service'
        ]);

        break;


      case 'insurance':

        this.router.navigate([
          '/front-office/insurance'
        ]);

        break;


      case 'queue':

        this.router.navigate([
          '/front-office/queue'
        ]);

        break;


      case 'doctor-schedule':

        this.router.navigate([
          '/front-office/doctor-schedule'
        ]);

        break;


      case 'reports':

        this.router.navigate([
          '/front-office/reports'
        ]);

        break;


      case 'settings':

        this.router.navigate([
          '/front-office/settings'
        ]);

        break;

    }

  }

  logout(): void {

    const confirmed =
      confirm(
        'Are you sure you want to logout?'
      );


    if (!confirmed) {

      return;

    }


    localStorage.removeItem(
      'loggedInUser'
    );

    localStorage.removeItem(
      'isLoggedIn'
    );

    localStorage.removeItem(
      'pendingUser'
    );


    this.isProfileOpen = false;


    this.router.navigate([
      '/patient/login'
    ]);

  }


  // ==============================
  // DESTROY
  // ==============================

  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);

    }

  }

}
