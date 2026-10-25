import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { filter } from "rxjs";
import { FrontOfficeFooterComponent } from "./front-office-footer/front-office-footer.component";
import { FrontOfficeHeaderComponent } from "./front-office-header/front-office-header.component";
import { BREADCRUMB_MAP, Breadcrumb, DASHBOARD_CRUMB } from "./fron-office-config/front-office-breadcrumb.config";

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
    const path = this.router.url.split(/[?#]/)[0];
    const [, feature] = path.split("/").filter(Boolean);
    const trail = BREADCRUMB_MAP[feature] ?? [];

    // The current page links to the live URL, so params like :doctorId are preserved.
    return [
      DASHBOARD_CRUMB,
      ...trail.map((crumb, i) => (i === trail.length - 1 ? { ...crumb, url: path } : crumb)),
    ];
  }
}
