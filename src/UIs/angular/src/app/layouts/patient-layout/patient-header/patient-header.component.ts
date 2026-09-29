import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectionStrategy,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";

import { AuthService } from "src/app/core/Services/auth.service";
import { TabServiceService } from "src/app/core/Services/tab-service.service";
import { AppState } from "src/app/Store/app.state";
import { getOrganizationList } from "src/app/Store/Organization/organization.actions";
import { selectOrganizationList } from "src/app/Store/Organization/organization.selectors";
import { getSwitchSelectedHospital } from "src/app/Store/Patient/patient.action";

interface Hospital {
  hospitalName: string;
  location: string;
  image: string;
  hospitalId?: number;
}

@Component({
  selector: "app-patient-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: "./patient-header.component.html",
  styleUrl: "./patient-header.component.css",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class PatientHeaderComponent implements OnInit {

  // =====================================================
  // USER
  // =====================================================

  username = "";

  formattedDate = "";

  showProfile = false;

  mobileMenuOpen = false;


  // =====================================================
  // HOSPITAL
  // =====================================================

  selectedHospitalName = "";

  selectedHospitalLocation = "";

  hospitalModalOpen = false;

  hospitalSearch = "";

  pendingHospital: Hospital | null = null;


  // =====================================================
  // TABS
  // =====================================================

  activeTab = "appointments";


  navItems = [
    {
      key: "appointments",
      label: "My Appointments",
      icon: "/assets/images/tab-appointments-icon.png",
      route: "/patient/dashboard/appointments",
    },
    {
      key: "specialities",
      label: "Specialities",
      icon: "/assets/images/tab-specialities-icon.png",
      route: "/patient/dashboard/specialities",
    },
    {
      key: "medicine",
      label: "Medicine Orders",
      icon: "/assets/images/tab-medicine-icon.png",
      route: "/patient/dashboard/medicine",
    },
    {
      key: "labresult",
      label: "Lab Results",
      icon: "/assets/images/tab-lab-icon.png",
      route: "/patient/dashboard/labresult",
    },
    {
      key: "billing",
      label: "Billing",
      icon: "/assets/images/tab-billing-icon.png",
      route: "/patient/dashboard/billing",
    },
    {
      key: "messages",
      label: "Messages",
      icon: "/assets/images/tab-messages-icon.png",
      route: "/patient/dashboard/messages",
    },
    {
      key: "setting",
      label: "Settings",
      icon: "/assets/images/tab-settings-icon.png",
      route: "/patient/dashboard/settings",
    },
  ];


  // =====================================================
  // HOSPITAL LIST
  // =====================================================

  hospitals: Hospital[] = [

  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private tabService: TabServiceService,
    private authService: AuthService,
    private store: Store<AppState>,
  ) { }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.setDate();

    this.loadUsername();



    this.restoreSelectedHospital();

    this.InitialAPICall();

    this.store.select(selectOrganizationList).subscribe((res: Hospital[]) => {
      console.log("Hospital API Response:", res);

      if (!Array.isArray(res) || res.length === 0) {
        return;
      }

      setTimeout(() => {
        this.hospitals = res;
        this.hospitals = [...res];


      });
    });

    this.tabService.activeTab$.subscribe((tab: string) => {

      if (tab) {
        this.activeTab = tab;
      }

    });

  }

  InitialAPICall() {
    this.store.dispatch(getOrganizationList());
  }


  // =====================================================
  // USERNAME
  // =====================================================

  loadUsername(): void {

    try {

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      this.username =
        user?.data?.firstName ??
        user?.firstName ??
        localStorage.getItem("username") ??
        "User";

    } catch (error) {

      console.error(
        "Unable to read user information",
        error
      );

      this.username =
        localStorage.getItem("username") ??
        "User";

    }

  }


  // =====================================================
  // DATE
  // Format:
  // Sep 28th 2026 | Monday
  // =====================================================

  setDate(): void {

    const today = new Date();

    const day = today.getDate();

    const suffix = this.getOrdinal(day);

    const month = today.toLocaleString(
      "en-US",
      {
        month: "short"
      }
    );

    const year = today.getFullYear();

    const weekday = today.toLocaleString(
      "en-US",
      {
        weekday: "long"
      }
    );

    this.formattedDate =
      `${month} ${day}${suffix} ${year} | ${weekday} `;

  }


  // =====================================================
  // ORDINAL
  // =====================================================

  getOrdinal(day: number): string {

    if (day > 3 && day < 21) {
      return "th";
    }

    switch (day % 10) {

      case 1:
        return "st";

      case 2:
        return "nd";

      case 3:
        return "rd";

      default:
        return "th";

    }

  }


  // =====================================================
  // MOBILE MENU
  // =====================================================

  toggleMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

    // Close profile dropdown
    this.showProfile = false;

  }


  closeMobileMenu(): void {

    this.mobileMenuOpen = false;

  }


  // =====================================================
  // NAVIGATION
  // =====================================================

  changeTab(tab: string): void {

    this.mobileMenuOpen = false;

    this.tabService.changeTab(tab);

  }


  // =====================================================
  // PROFILE DROPDOWN
  // =====================================================

  toggleProfile(event: Event): void {

    event.stopPropagation();

    this.showProfile =
      !this.showProfile;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.authService.logout();

  }


  // =====================================================
  // STOP EVENT
  // =====================================================

  stop(event: Event): void {

    event.stopPropagation();

  }


  // =====================================================
  // DOCUMENT CLICK
  // =====================================================

  @HostListener("document:click")
  closeMenus(): void {

    this.showProfile = false;

  }


  // =====================================================
  // HOSPITAL MODAL
  // =====================================================

  openHospitalModal(): void {

    this.hospitalSearch = "";

    this.pendingHospital =
      this.getCurrentHospital();

    this.hospitalModalOpen = true;

    this.showProfile = false;

  }


  closeHospitalModal(): void {

    this.hospitalModalOpen = false;

    this.hospitalSearch = "";

    this.pendingHospital = null;

  }


  // =====================================================
  // CURRENT HOSPITAL
  // =====================================================

  getCurrentHospital(): Hospital | null {

    const savedHospital =
      localStorage.getItem("selectedHospital");

    if (!savedHospital) {

      return this.hospitals[0] ?? null;

    }

    try {

      return JSON.parse(savedHospital);

    } catch (error) {

      console.error(
        "Unable to read selected hospital",
        error
      );

      return this.hospitals[0] ?? null;

    }

  }


  // =====================================================
  // RESTORE SELECTED HOSPITAL
  // =====================================================

  restoreSelectedHospital(): void {

    const defaultHospital: Hospital = {
      hospitalName: "Health Haven Medical Center",
      location: "Main Campus, Kolkata",
      image: "assets/images/hospital-photo-1.png",
    };

    const savedHospital =
      localStorage.getItem("selectedHospital");

    if (!savedHospital) {

      this.selectedHospitalName =
        defaultHospital.hospitalName;

      this.selectedHospitalLocation =
        defaultHospital.location;

      return;
    }

    try {

      const hospital: Hospital =
        JSON.parse(savedHospital);

      this.selectedHospitalName =
        hospital?.hospitalName ||
        defaultHospital.hospitalName;

      this.selectedHospitalLocation =
        hospital?.location ||
        defaultHospital.location;

    } catch (error) {

      console.error(
        "Failed to restore selected hospital",
        error
      );

      this.selectedHospitalName =
        defaultHospital.hospitalName;

      this.selectedHospitalLocation =
        defaultHospital.location;
    }
  }

  // =====================================================
  // FILTERED HOSPITALS
  // =====================================================

  get filteredHospitals(): Hospital[] {

    const search =
      this.hospitalSearch
        .trim()
        .toLowerCase();

    if (!search) {

      return this.hospitals;

    }

    return this.hospitals.filter(
      hospital =>

        hospital.hospitalName
          .toLowerCase()
          .includes(search)

        ||

        hospital.location
          .toLowerCase()
          .includes(search)

    );

  }


  // =====================================================
  // SELECT HOSPITAL
  // =====================================================

  selectHospital(hospital: Hospital): void {

    this.pendingHospital =
      hospital;

  }


  // =====================================================
  // CONFIRM SWITCH HOSPITAL
  // =====================================================

  confirmSwitchHospital(): void {

    if (!this.pendingHospital) {

      return;

    }

    const hospital =
      this.pendingHospital;


    // Update UI

    this.store.dispatch(getSwitchSelectedHospital({ hospitalId: hospital.hospitalId }))
    this.selectedHospitalName =
      hospital.hospitalName;

    this.selectedHospitalLocation =
      hospital.location;


    // Save selected hospital

    localStorage.setItem(
      "selectedHospital",
      JSON.stringify(hospital)
    );


    // Close modal


    this.closeHospitalModal();

  }


  // =====================================================
  // CHECK CURRENT HOSPITAL
  // =====================================================

  isCurrentHospital(
    hospital: Hospital
  ): boolean {

    return (
      hospital.hospitalName ===
      this.selectedHospitalName
    );

  }

}
