import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";

import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import {
  getAppointmentListByRiceptionist,
  getDashboardData,
  getDashboardDataByDoctor,
  getDashboardDataByReceptionist,
} from "src/app/Store/Appointments/appointment.actions";
import { selectDashboardDataSummery } from "src/app/Store/Appointments/appointment.selcetors";
import { JsonPipe } from "@angular/common";

interface DashboardStat {
  title: string;
  value: number;
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
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchValue = "";

  username = "Front Office";

  currentDate = "";

  currentTime = "";

  isProfileOpen = false;

  activePage = "dashboard";

  private timer: any;
  user: any = {};

  // ==============================
  // DASHBOARD DATA
  // ==============================

  dashboardData: DashboardData = {
    stats: [],
    quickActions: [],
    services: [],
    billingClaims: [],
    recentPatients: [],
    todaysQueue: [],
  };
  dashboardDataCount = {
    totalAppointmentsCount: 0,
    totalWalkinsWaitingCount: 0,
    totalCheckInCount: 0,
    totalPendingPaymentsCount: 0,
    totalLabResultsCount: 0,
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.loadUser();

    this.updateDate();
    this.updateTime();
    this.startClock();

    this.store.select(selectDashboardDataSummery).subscribe((res: any) => {
      console.log("Dashboard API Response:", res);

      const data = res?.data;

      // Ignore empty / invalid response
      if (!data || Array.isArray(data) || typeof data !== "object") {
        console.warn("Dashboard response ignored:", data);
        return;
      }

      // Run update in next JavaScript task
      setTimeout(() => {
        this.dashboardDataCount = {
          totalAppointmentsCount: data.totalAppointmentsCount ?? 0,
          totalWalkinsWaitingCount: data.totalWalkinsWaitingCount ?? 0,
          totalCheckInCount: data.totalCheckInCount ?? 0,
          totalPendingPaymentsCount: data.totalPendingPaymentsCount ?? 0,
          totalLabResultsCount: data.totalLabResultsCount ?? 0,
        };

        console.log("Dashboard Counts Updated:", this.dashboardDataCount);

        this.updateStatValues();

        // Tell Angular to update the UI
        this.cdr.detectChanges();
      }, 0);
    });

    this.loadDashboardData();
  }

  updateStatValues(): void {
    this.dashboardData.stats = this.dashboardData.stats.map((stat) => {
      switch (stat.title) {
        case "Today's Appointments":
          return {
            ...stat,
            value: this.dashboardDataCount.totalAppointmentsCount,
          };

        case "Walk-ins Waiting":
          return {
            ...stat,
            value: this.dashboardDataCount.totalWalkinsWaitingCount,
          };

        case "Checked In":
          return {
            ...stat,
            value: this.dashboardDataCount.totalCheckInCount,
          };

        case "Pending Payments":
          return {
            ...stat,
            value: this.dashboardDataCount.totalPendingPaymentsCount,
          };

        case "Lab Results":
          return {
            ...stat,
            value: this.dashboardDataCount.totalLabResultsCount,
          };

        default:
          return {
            ...stat,
            value: 0,
          };
      }
    });
  }
  getStatCount(title: string): number {
    switch (title) {
      case "Today's Appointments":
        return this.dashboardDataCount.totalAppointmentsCount;

      case "Walk-ins Waiting":
        return this.dashboardDataCount.totalWalkinsWaitingCount;

      case "Checked In":
        return this.dashboardDataCount.totalCheckInCount;

      case "Pending Payments":
        return this.dashboardDataCount.totalPendingPaymentsCount;

      case "Lab Results":
        return this.dashboardDataCount.totalLabResultsCount;

      default:
        return 0;
    }
  }

  loadDashboardData(): void {
    // this.user = JSON.parse(localStorage.getItem('user') || 'null')

    const today = new Date();

    const fromDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);

    console.log("Dashboard Request:", {
      associateId: this.user?.refId,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    });

    this.store.dispatch(
      getDashboardData({
        associateId: this.user?.refId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    );

    this.store.dispatch(
      getAppointmentListByRiceptionist({
        associateId: this.user?.refId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    );
    this.store.dispatch(
      getDashboardDataByReceptionist({
        associateId: this.user?.refId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    );
    this.store.dispatch(
      getDashboardDataByDoctor({
        associateId: this.user?.refId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    );

    this.http.get<DashboardData>("/assets/data-json/data.json").subscribe({
      next: (data) => {
        console.log("Static Dashboard JSON:", data);

        this.dashboardData = data;

        this.updateStatValues();
      },

      error: (error) => {
        console.error("Dashboard JSON loading failed:", error);
      },
    });
  }

  // ==============================
  // DATE
  // ==============================

  updateDate(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",

      day: "numeric",

      month: "long",

      year: "numeric",
    };

    this.currentDate = new Date().toLocaleDateString("en-IN", options);
  }

  // ==============================
  // TIME
  // ==============================

  updateTime(): void {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",

      minute: "2-digit",

      hour12: true,
    };

    this.currentTime = new Date().toLocaleTimeString("en-IN", options);
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
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.warn("user not found in localStorage");
      this.user = {};
      return;
    }

    try {
      this.user = JSON.parse(userData);

      console.log("Logged In User:", this.user);
      console.log("Associate ID:", this.user?.refId);

      if (this.user?.username) {
        this.username = this.user.username;
      } else if (this.user?.name) {
        this.username = this.user.name;
      }
    } catch (error) {
      console.error("Invalid user data:", error);

      this.user = {};
      this.username = "Front Office";
    }
  }

  // ==============================
  // SEARCH
  // ==============================

  openSearchPage(): void {
    const value = this.searchValue.trim();

    this.router.navigate(["/front-office/search-patient"], {
      queryParams: value ? { q: value } : {},
    });
  }

  // ==============================
  // NAVIGATION
  // ==============================

  navigate(page: string): void {
    this.activePage = page;

    this.router.navigate([`/front-office/${page}`]);
  }

  // ==============================
  // VIEW ALL
  // ==============================

  viewAllPatients(): void {
    this.router.navigate(["/front-office/patients"]);
  }

  viewAllQueue(): void {
    this.router.navigate(["/front-office/queue"]);
  }

  // ==============================
  // PROFILE
  // ==============================

  toggleProfile(event: Event): void {
    event.stopPropagation();

    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener("document:click")
  closeProfile(): void {
    this.isProfileOpen = false;
  }

  openProfile(): void {
    this.isProfileOpen = false;

    this.router.navigate(["/front-office/profile"]);
  }

  // ==============================
  // LOGOUT
  // ==============================

  logout(): void {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    localStorage.removeItem("loggedInUser");

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("pendingUser");

    this.router.navigate(["/patient/login"]);
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
