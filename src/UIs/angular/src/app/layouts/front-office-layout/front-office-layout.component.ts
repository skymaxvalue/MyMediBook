import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { filter } from "rxjs";
import { FrontOfficeFooterComponent } from "./front-office-footer/front-office-footer.component";
import { FrontOfficeHeaderComponent } from "./front-office-header/front-office-header.component";
import { BREADCRUMB_MAP, Breadcrumb, DASHBOARD_CRUMB } from "./front-office-config/front-office-breadcrumb.config";

@Component({
  selector: "app-front-office-layout",
  imports: [RouterOutlet, RouterLink, FrontOfficeHeaderComponent, FrontOfficeFooterComponent],
  templateUrl: "./front-office-layout.component.html",
  styleUrl: "./front-office-layout.component.css",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FrontOfficeLayoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  breadcrumbs: Breadcrumb[] = [DASHBOARD_CRUMB];

  ngOnInit(): void {
    this.breadcrumbs = this.buildBreadcrumbs();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => (this.breadcrumbs = this.buildBreadcrumbs()));
  }





  private buildBreadcrumbs(): Breadcrumb[] {
    const currentUrl = this.router.url;
    const path = currentUrl.split(/[?#]/)[0];
    const segments = path.split('/').filter(Boolean);

    const feature = segments[1];
    const childRoute = segments[2];

    // Claims module breadcrumbs
    if (feature === 'claims-dashboard') {
      const breadcrumbs: Breadcrumb[] = [
        DASHBOARD_CRUMB,
        ...(BREADCRUMB_MAP['claims-dashboard'] ?? [])
      ];

      switch (childRoute) {
        case 'all':
          breadcrumbs.push({
            label: 'All Claims',
            url: path
          });
          break;

        case 'new-claim':
          breadcrumbs.push({
            label: 'New Claim',
            url: path
          });
          break;

        case 'claim-details': {
          const queryString = currentUrl.split('?')[1]?.split('#')[0] ?? '';
          const claimId = new URLSearchParams(queryString).get('id');

          breadcrumbs.push({
            label: claimId || 'Claim Details'
          });
          break;
        }
      }

      return breadcrumbs;
    }

    // Other Front Office pages
    const trail = BREADCRUMB_MAP[feature] ?? [];

    return [
      DASHBOARD_CRUMB,
      ...trail.map((crumb, i) =>
        i === trail.length - 1
          ? { ...crumb, url: path }
          : crumb
      )
    ];
  }



}
