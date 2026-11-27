
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-claim-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './claim-layout.component.html',
  styleUrl: './claim-layout.component.css'
})
export class ClaimLayoutComponent implements OnInit, OnDestroy {

  showDashboardBackButton = false;

  pageTitle = 'Claims';

  showHeader = true;

  pageDescription =
    'Manage and monitor patient insurance claims.';

  private routerSubscription!: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.updatePageHeading();

    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.updatePageHeading();
      });

  }

  updatePageHeading(): void {

    const url = this.router.url;

    // Default values
    this.showHeader = true;
    this.showDashboardBackButton = false;

    if (url.includes('/claims-dashboard/new-claim')) {

      // New Claim Page
      this.showHeader = false;

    }
    else if (url.includes('/claims-dashboard/all')) {

      // All Claims Page
      this.pageTitle = 'All Claims';

      this.pageDescription =
        'Search, filter, and review all recorded claims.';

      this.showDashboardBackButton = true;

    }
    else if (url.includes('/claims-dashboard/claim-details')) {
      this.showHeader = false
    }
    else if (url.includes('/claims-dashboard')) {

      // Claims Dashboard
      this.pageTitle = 'Claims';

      this.pageDescription =
        'Manage and monitor patient insurance claims.';

    }

  }

  ngOnDestroy(): void {

    this.routerSubscription?.unsubscribe();

  }

}
