import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TabServiceService } from "src/app/Services/tab-service.service";

@Component({
  selector: "app-navbar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit {

  showProfile = false;
  mobileMenuOpen = false;

  username = '';

  formattedDate = '';

  activeTab = 'appointments';

  navItems = [
    { key: 'appointments', label: 'My Appointments' },
    { key: 'specialities', label: 'Specialities' },
    { key: 'medicine', label: 'Medicine Orders' },
    { key: 'labresult', label: 'Lab Results' },
    { key: 'billing', label: 'Billing' },
    { key: 'messages', label: 'Messages' },
    { key: 'setting', label: 'Settings' }
  ];

  constructor(private tabService: TabServiceService) { }

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

    this.tabService.activeTab$.subscribe((tab: any) => {
      this.activeTab = tab;
    });

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

    this.tabService.changeTab(tab);

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

    localStorage.clear();

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