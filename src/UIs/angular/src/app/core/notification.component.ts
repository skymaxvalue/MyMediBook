import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { HubConnectionBuilder } from "@microsoft/signalr";

import { AuthService } from "../auth/auth.service";
import { environment } from "src/environments/environment";
import { ToastService } from "../shared/Components/Toaster/toast.service";

@Component({
  selector: "app-notification",
  template: "",
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class NotificationComponent implements OnInit {
  constructor(
    public auth: AuthService,
    private toastr: ToastService
  ) { }

  ngOnInit(): void {
    const connection = new HubConnectionBuilder()
      .withUrl(environment.ResourceServer.NotificationEndpoint, {
        accessTokenFactory: () => this.auth.getAccessToken(),
      })
      .withAutomaticReconnect()
      .build();

    let vm = this;

    connection.start().then(
      function () {
        console.log("Connected to NotificationHub");
        vm.toastr.success("Success", "Connected to NotificationHub");
      },
      function () {
        // console.log(
        //   "Cannot connect to NotificationHub: " + environment.ResourceServer.NotificationEndpoint
        // );
        // vm.toastr.error(
        //   "Cannot connect to NotificationHub: " + environment.ResourceServer.NotificationEndpoint,
        //   "",
        //   { progressBar: true }
        // );
      }
    );

    connection.on("ReceiveMessage", (message) => {
      console.log("Received Message from NotificationHub: " + message);
      vm.toastr.info("Received Message from NotificationHub:", message);
    });
  }
}
