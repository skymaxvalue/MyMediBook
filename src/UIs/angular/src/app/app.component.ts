import { Component, ChangeDetectorRef } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Observable, map } from 'rxjs';

import { AsyncPipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { AppState } from "./Store/app.state";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
})
export class AppComponent {
  isLoading$ = this.store.select(state => state.auth).pipe(
    map(auth => {
      console.log('TEMPLATE AUTH =>', auth);
      return auth.isLoading;
    })
  );
  constructor(private store: Store<AppState>) {

  }



}
