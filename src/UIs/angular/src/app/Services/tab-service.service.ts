import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TabServiceService {
  private activeTabSubject = new BehaviorSubject<string>('appointments');
  activeTab$ = this.activeTabSubject.asObservable();

  private selectedDoctorSubject = new BehaviorSubject<any>(null);
  private selectedTimeSlote = new BehaviorSubject<any>(null);
  selectedDoctor$ = this.selectedDoctorSubject.asObservable();
  selectedTimeSlot$ = this.selectedTimeSlote.asObservable();

  private reschedulePatientSubject = new BehaviorSubject<any>(null);
  reschedulePatient$ = this.reschedulePatientSubject.asObservable();



  changeTab(tab: string) {
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'appointments') {
      this.selectedDoctorSubject.next(null);
      this.reschedulePatientSubject.next(null);
    }
    if (tab === 'specialities') {

    }
    this.activeTabSubject.next(tab);
  }
  setSelectedDoctor(doctor: any) {
    this.selectedDoctorSubject.next(doctor);
  }

  setReschedulePatient(patient: any) {
    this.reschedulePatientSubject.next(patient);
  }

  getCurrentTab() {
    return this.activeTabSubject.value;
  }

}