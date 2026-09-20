import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/Store/app.state";
import { getOrganizationList } from "src/app/Store/Organization/organization.actions";
import {
  selectOrganizationList,
  selectOrganizationState,
} from "src/app/Store/Organization/organization.selectors";

interface Hospital {
  hospitalId: number;
  tenantId: string;
  hospitalName: string;
  registrationNumber: string;
  licenseNumber: string;
  hospitalType: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  cityName: string;
  stateName: string;
  countryName: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  logoPath: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  responseMessage?: string;
  isSuccess?: number;
  distance?: number;
}

@Component({
  selector: "app-select-hospital",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./select-hospital.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: "./select-hospital.component.css",
})
export class SelectHospitalComponent implements OnInit {
  searchTerm = "";
  isGettingLocation = false;
  locationPermissionDenied = false;
  locationError = "";
  hospitals: Hospital[] = [];
  userLatitude: number | null = null;
  userLongitude: number | null = null;
  selectedHospital: Hospital | null = null;
  filteredHospitals: Hospital[] = [];

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.InitialAPICall();

    this.store.select(selectOrganizationList).subscribe((res: Hospital[]) => {
      console.log("Hospital API Response:", res);

      if (!Array.isArray(res) || res.length === 0) {
        return;
      }

      setTimeout(() => {
        this.hospitals = res;
        this.filteredHospitals = [...res];

        this.calculateHospitalDistances();
        this.sortHospitalsByDistance();

        this.cdr.detectChanges();
      });
    });
  }

  InitialAPICall() {
    this.store.dispatch(getOrganizationList());
  }

  /* =========================================================
     SEARCH HOSPITAL
  ========================================================= */

  searchHospitals(): void {
    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      this.filteredHospitals = [...this.hospitals];

      this.sortHospitalsByDistance();

      return;
    }

    this.filteredHospitals = this.hospitals.filter(
      (hospital) =>
        hospital.hospitalName.toLowerCase().includes(search) ||
        hospital.cityName.toLowerCase().includes(search) ||
        hospital.addressLine1.toLowerCase().includes(search) ||
        hospital.addressLine2.toLowerCase().includes(search) ||
        hospital.stateName.toLowerCase().includes(search) ||
        hospital.hospitalType?.toLowerCase().includes(search)
    );

    this.sortHospitalsByDistance();
  }

  /* =========================================================
     GET CURRENT LOCATION
  ========================================================= */

  getCurrentLocation(): void {
    this.locationError = "";
    this.locationPermissionDenied = false;

    if (!navigator.geolocation) {
      this.locationError = "Geolocation is not supported by your browser.";

      return;
    }

    this.isGettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLatitude = position.coords.latitude;

        this.userLongitude = position.coords.longitude;

        console.log("User Latitude:", this.userLatitude);

        console.log("User Longitude:", this.userLongitude);

        this.calculateHospitalDistances();

        this.searchHospitals();

        this.isGettingLocation = false;
      },

      (error) => {
        this.isGettingLocation = false;

        console.error("Location Error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.locationPermissionDenied = true;

            this.locationError =
              "Location permission was denied. Please allow location access from your browser.";

            break;

          case error.POSITION_UNAVAILABLE:
            this.locationError = "Unable to determine your current location.";

            break;

          case error.TIMEOUT:
            this.locationError = "Location request timed out. Please try again.";

            break;

          default:
            this.locationError = "Unable to get your current location.";
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  calculateHospitalDistances(): void {
    console.log("Hospitals before distance calculation:", this.hospitals);

    if (this.userLatitude === null || this.userLongitude === null) {
      return;
    }

    this.hospitals.forEach((hospital) => {
      hospital.distance = this.calculateDistance(
        this.userLatitude!,
        this.userLongitude!,
        hospital.latitude,
        hospital.longitude
      );
    });

    console.log("Hospitals after distance calculation:", this.hospitals);
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadius = 6371;

    const dLat = this.toRadians(lat2 - lat1);

    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  sortHospitalsByDistance(): void {
    if (this.userLatitude === null || this.userLongitude === null) {
      return;
    }

    this.filteredHospitals.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
  }

  selectHospital(hospital: Hospital): void {
    this.selectedHospital = hospital;
  }

  continueToDashboard(): void {
    if (!this.selectedHospital) {
      return;
    }

    localStorage.setItem("selectedHospital", JSON.stringify(this.selectedHospital));

    localStorage.setItem("selectedHospitalId", this.selectedHospital.hospitalId.toString());

    this.router.navigate(["/patient/dashboard"]);
  }

  clearSearch(): void {
    this.searchTerm = "";

    this.filteredHospitals = [...this.hospitals];

    this.sortHospitalsByDistance();
  }

  getDistanceText(hospital: Hospital): string {
    if (hospital.distance === undefined) {
      return "Distance unavailable";
    }

    if (hospital.distance < 1) {
      return `${Math.round(hospital.distance * 1000)} m away`;
    }

    return `${hospital.distance.toFixed(1)} km away`;
  }
}
