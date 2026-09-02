import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Store/app.state';
import { getDashboardData } from 'src/app/Store/Appointments/appointment.actions';
import { selectDashboardDataSummery } from 'src/app/Store/Appointments/appointment.selcetors';


interface DashboardStat {
  title: string;
  value: string;
  icon: string;
  color: string;
}

interface DashboardAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

interface DashboardPatient {
  initials: string;
  name: string;
  uhid: string;
  status: string;
  statusClass: string;
  time: string;
  avatarClass: string;
}

interface QueuePatient {
  initials: string;
  patient: string;
  doctor: string;
  time: string;
  status: string;
  statusClass: string;
  avatarClass: string;
}

interface DashboardData {
  stats: DashboardStat[];
  quickActions: DashboardAction[];
  services: DashboardAction[];
  billingClaims: DashboardAction[];
  recentPatients: DashboardPatient[];
  todaysQueue: QueuePatient[];
}

@Component({
  selector: "app-dashboard",
  imports: [FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit, OnDestroy {


  searchValue = '';

  username = 'Front Office';

  currentDate = '';

  currentTime = '';

  isProfileOpen = false;

  activePage = 'dashboard';

  private timer: any;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');


  // ==============================
  // DASHBOARD DATA
  // ==============================

  dashboardData: DashboardData = {
    stats: [],
    quickActions: [],
    services: [],
    billingClaims: [],
    recentPatients: [],
    todaysQueue: []
  };


  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) { }


  ngOnInit(): void {

    this.loadDashboardData();

    this.updateDate();

    this.updateTime();

    this.loadUser();

    this.startClock();
    this.store.select(selectDashboardDataSummery).subscribe((res: any) => {
      if (res) {

        this.dashboardData = res
        console.log('Dashboard Data from Store:', this.dashboardData, res);
      }
    })

  }


  // ==============================
  // LOAD JSON
  // ==============================

  loadDashboardData(): void {
    const today = new Date();

    const fromDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);

    this.store.dispatch(getDashboardData({
      associateId: this.user?.refId, fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString()
    }));

    this.http
      .get<DashboardData>(
        '/assets/data-json/data.json'
      )
      .subscribe({

        next: (data) => {

          this.dashboardData = data;
          this.cdr.markForCheck();

        },

        error: (error) => {

          console.error(
            'Dashboard JSON loading failed:',
            error
          );

        }

      });

  }


  // ==============================
  // DATE
  // ==============================

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


  // ==============================
  // TIME
  // ==============================

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


  // ==============================
  // CLOCK
  // ==============================

  startClock(): void {

    this.timer = setInterval(() => {

      this.updateTime();

    }, 1000);

  }


  // ==============================
  // USER
  // ==============================

  loadUser(): void {

    const userData =
      localStorage.getItem('loggedInUser');

    if (!userData) {

      return;

    }

    try {

      const user = JSON.parse(userData);

      if (user?.name) {

        this.username = user.name;

      }

    } catch {

      this.username = 'Front Office';

    }

  }


  // ==============================
  // SEARCH
  // ==============================

  openSearchPage(): void {

    const value =
      this.searchValue.trim();

    this.router.navigate(
      ['/front-office/search-patient'],
      {
        queryParams: value
          ? { q: value }
          : {}
      }
    );

  }


  // ==============================
  // NAVIGATION
  // ==============================

  navigate(page: string): void {

    this.activePage = page;

    this.router.navigate([
      `/front-office/${page}`
    ]);

  }


  // ==============================
  // VIEW ALL
  // ==============================

  viewAllPatients(): void {

    this.router.navigate([
      '/front-office/patients'
    ]);

  }


  viewAllQueue(): void {

    this.router.navigate([
      '/front-office/queue'
    ]);

  }


  // ==============================
  // PROFILE
  // ==============================

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


  // ==============================
  // LOGOUT
  // ==============================

  logout(): void {

    if (
      !confirm(
        'Are you sure you want to logout?'
      )
    ) {

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
