import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Observable, combineLatest, map } from 'rxjs';

import { AsyncPipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { AppState } from "./Store/app.state";
import { AuthService } from "./Services/auth.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>, private authService: AuthService) {

  }
  isLoading$ = combineLatest([
    this.store.select(state => state.auth.isLoading),
    this.store.select(state => state.doctor.isLoading),
    this.store.select(state => state.appointment.isLoading),
    this.store.select(state => state.patient.isLoading)
  ]).pipe(
    map(([auth, doctor, appointment, patient]) =>
      auth || doctor || appointment || patient
    )
  );

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.authService.startRefreshTimer();
    }
  }





}
