import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  NgZone,
  OnInit,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { filter, timer } from "rxjs";
import * as AuthActions from "../../../Store/Auth/auth.actions";
import {
  LOGIN_URL,
  NAV_ITEMS,
  NavItem,
  PROFILE_URL,
  navUrl,
} from "../fron-office-config/from-office-header.config";
import { AuthFacade } from "../../../Store/Auth/auth.facade";

const DEFAULT_USERNAME = "Front Office";

@Component({
  selector: "app-front-office-header",
  imports: [],
  templateUrl: "./front-office-header.component.html",
  styleUrl: "./front-office-header.component.css",
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class FrontOfficeHeaderComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store,
    private zone: NgZone,
    private destroyRef: DestroyRef,
    private authFacade: AuthFacade
  ) {}

  currentDate = "";
  currentTime = "";
  username = DEFAULT_USERNAME;
  isProfileOpen = false;
  activePage = "";

  ngOnInit(): void {
    this.username = this.readUsername();
    this.setActivePage(this.router.url);
    this.startClock();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((e) => this.setActivePage(e.urlAfterRedirects));
  }

  // ---------- navigation ----------
  navigate(key: string): void {
    const item = NAV_ITEMS.find((n) => n.key === key);
    if (!item) return;
    this.activePage = item.key;
    this.router.navigate([navUrl(item)], item.state ? { state: item.state } : undefined);
  }

  openProfile(): void {
    this.isProfileOpen = false;
    this.router.navigate([PROFILE_URL]);
  }

  private setActivePage(url: string): void {
    const [, segment] = url.split(/[?#]/)[0].split("/").filter(Boolean);
    const match = NAV_ITEMS.find(
      (n: NavItem) => n.path === segment || n.alsoActiveFor?.includes(segment)
    );
    this.activePage = match?.key ?? "";
  }

  // ---------- profile menu ----------
  toggleProfile(event: Event): void {
    event.stopPropagation();
    this.isProfileOpen = !this.isProfileOpen;
  }

  @HostListener("document:click")
  closeProfile(): void {
    this.isProfileOpen = false;
  }

  logout(): void {
    if (!confirm("Are you sure you want to logout?")) return;
    this.isProfileOpen = false;
    this.authFacade.logOut();
    ["loggedInUser", "isLoggedIn", "pendingUser"].forEach((k) => localStorage.removeItem(k));
    this.router.navigate([LOGIN_URL]);
  }

  // ---------- clock ----------
  private startClock(): void {
    this.tick();
    const msToNextMinute = 60_000 - (Date.now() % 60_000);
    this.zone.runOutsideAngular(() =>
      timer(msToNextMinute, 60_000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.zone.run(() => this.tick()))
    );
  }

  private tick(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    this.currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  private readUsername(): string {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") ?? "null")?.name || DEFAULT_USERNAME;
    } catch {
      return DEFAULT_USERNAME;
    }
  }
}
