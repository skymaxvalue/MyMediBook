import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { TabServiceService } from "src/app/core/Services/tab-service.service";
import { ToastService } from "src/app/shared/Components/Toaster/toast.service";
import { AppState } from "src/app/Store/app.state";
import { loadDoctorSpecialities } from "src/app/Store/Doctor/doctor.action";
import { selectDoctorSpecialities } from "src/app/Store/Doctor/doctor.selectors";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-specialities",
  imports: [CommonModule, FormsModule],
  templateUrl: "./specialities.component.html",
  styleUrl: "./specialities.component.css",
})
export class SpecialitiesComponent implements OnInit {
  apiUrl = environment.OpenIdConnect.apiUrl
  specialities: any[] = [];
  filteredSpecialities: any[] = [];
  @Output() onDoctorSelected = new EventEmitter<any>();
  searchText: any = '';
  searchedText: string = '';
  constructor(private router: Router, private toast: ToastService, private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.store.dispatch(
      loadDoctorSpecialities());
  }
  ngOnInit(): void {

    // throw new Error("Method not implemented.");
    this.store.select(selectDoctorSpecialities)
      .subscribe((res: any) => {

        console.log("Store Data:", res);
        this.specialities = res;
        this.filteredSpecialities = [...this.specialities];
        this.cdr.detectChanges();
        console.log("Length:", this.specialities.length);

      });
  }

  goToAvailability(doctor: any, ocId: any) {
    if (doctor.fromDate && doctor.fromTime || doctor.toDate && doctor.toTime) {

      this.router.navigate(
        ['/patient/dashboard/doctor-availability'],
        {
          state: {
            doctor
          }
        }
      );
    } else {
      this.toast.info('Info', "Doctor is not available")
    }
  }

  // Currently not in used due to change backend data
  getAmPmTime(time: string): string {

    const [hours, minutes] = time.split(':');

    let h = parseInt(hours, 10);

    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12; // 0 → 12

    return `${h}:${minutes} ${ampm}`;
  }
  onSearch() {
    if (!this.searchText?.trim()) {
      this.filteredSpecialities = [...this.specialities];
      return;
    }

    const search = this.searchText.toLowerCase();

    this.filteredSpecialities = this.specialities
      .map(speciality => ({
        ...speciality,
        doctors: speciality.doctors.filter((doctor: any) =>
          doctor.name.toLowerCase().includes(search) ||
          doctor.department.toLowerCase().includes(search) ||
          speciality.category.toLowerCase().includes(search)
        )
      }))
      .filter(speciality => speciality.doctors.length > 0);
  }

  // get filteredSpecialities() {

  //   if (!this.searchedText.trim()) {
  //     return this.specialities;
  //   }


  //   return this.specialities
  //     .map(speciality => ({
  //       ...speciality,
  //       doctors: speciality.doctors.filter((doctor: any) =>

  //         doctor.name.toLowerCase().includes(this.searchedText.toLowerCase()) ||

  //         doctor.department.toLowerCase().includes(this.searchedText.toLowerCase()) ||

  //         speciality.category.toLowerCase().includes(this.searchedText.toLowerCase())

  //       )
  //     }))
  //     .filter(speciality => speciality.doctors.length > 0);

  // }

  clearSearch() {
    this.searchText = null;
    this.searchedText = '';
  }
}
