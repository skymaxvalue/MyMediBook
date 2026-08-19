import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "src/app/core/Services/auth.service";
import { TabServiceService } from "src/app/core/Services/tab-service.service";

@Component({
  selector: "app-admin-header",
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-header.component.html",
  styleUrl: "./admin-header.component.css",
})
export class AdminHeaderComponent implements OnInit {

  showProfile = false;
  mobileMenuOpen = false;

  username = '';

  formattedDate = '';



  constructor(private authService: AuthService) { }

  ngOnInit() {
    const today = new Date();

    const day = today.getDate();
    const year = today.getFullYear();

    const month = today.toLocaleString("default", {
      month: "long",
    });


    this.formattedDate = `${month} ${day}${this.getOrdinal(day)} ${year}`;
    this.username =
      JSON.parse(localStorage.getItem('user') || '{}')?.data?.firstName ?? 'User';

    this.setDate();



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
  setDate() {

    const today = new Date();

    this.formattedDate =
      today.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

  }

  changeTab(tab: string) {

    this.mobileMenuOpen = false;


  }

  toggleMenu() {
    // alert(`Toggle Menu ${this.mobileMenuOpen}`)
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
    } else {
      this.mobileMenuOpen = true;
    }
  }

  toggleProfile(event: Event) {

    event.stopPropagation();

    this.showProfile = !this.showProfile;

  }

  logout() {

    this.authService.logout()

    // router navigate

  }

  @HostListener('document:click')
  closeMenus() {
    this.showProfile = false;
    // this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  stop(event: Event) {
    event.stopPropagation();
  }

}

