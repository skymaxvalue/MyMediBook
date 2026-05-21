import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  imports: [CommonModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {
  formattedDate: string = "";
  showLogout: boolean = false;

  todayDate = new Date();
  constructor(private router: Router) {}
  ngOnInit(): void {
    const today = new Date();

    const day = today.getDate();
    const year = today.getFullYear();

    const month = today.toLocaleString("default", {
      month: "long",
    });

    this.formattedDate = `${month} ${day}${this.getOrdinal(day)} ${year}`;
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
    // Implement logout logic here, such as clearing user session and redirecting to login page
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
    console.log("Logout clicked");
  }
}
