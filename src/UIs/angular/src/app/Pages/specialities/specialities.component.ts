import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: "app-specialities",
  imports: [CommonModule, FormsModule],
  templateUrl: "./specialities.component.html",
  styleUrl: "./specialities.component.css",
})
export class SpecialitiesComponent {
  @Input() specialities: any[] = [];
  @Output() onDoctorSelected = new EventEmitter<any>();
  searchText: string = '';
  searchedText: string = '';
  constructor(private router: Router) { }

  goToAvailability(doctor: any, ocId: any) {
    console.log('Selected Doctor:', doctor);
    // debugger
    this.onDoctorSelected.emit(doctor);
  }

  onSearch() {
    this.searchedText = this.searchText;
  }

  get filteredSpecialities() {

    if (!this.searchedText.trim()) {
      return this.specialities;
    }


    return this.specialities
      .map(speciality => ({
        ...speciality,
        doctors: speciality.doctors.filter((doctor: any) =>

          doctor.name.toLowerCase().includes(this.searchedText.toLowerCase()) ||

          doctor.department.toLowerCase().includes(this.searchedText.toLowerCase()) ||

          speciality.category.toLowerCase().includes(this.searchedText.toLowerCase())

        )
      }))
      .filter(speciality => speciality.doctors.length > 0);

  }

  clearSearch() {
    this.searchText = '';
    this.searchedText = '';
  }
}
