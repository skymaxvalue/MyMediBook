import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-navbar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  formattedDate: string = "";
  showLogout: boolean = false;

  todayDate = new Date();
  username: any;
  user: any
  constructor(private router: Router) { }
  ngOnInit(): void {
    const today = new Date();

    const day = today.getDate();
    const year = today.getFullYear();

    const month = today.toLocaleString("default", {
      month: "long",
    });

    this.formattedDate = `${month} ${day}${this.getOrdinal(day)} ${year}`;
    this.user = JSON.parse(localStorage.getItem('token') || 'null');
    console.log(this.user)
    this.username = this.user.firstName + " " + this.user.lastName
    // this.username = this.user.data.firstName + " " + this.user.data.lastName

  }
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
  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);

  }
}
