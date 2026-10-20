export interface NavItem {
  key: string;          // value of activePage, so your template keeps working
  path: string;         // first segment after /front-office
  alsoActiveFor?: string[]; // child pages that should highlight this item
  state?: Record<string, unknown>;
}

const BASE = "/front-office";

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", path: "dashboard" },
  { key: "patient-registration", path: "patient-registration" },
  { key: "book-appointment", path: "book-appointment", state: { isFrontOfficePage: true } },
  { key: "patient-check-in", path: "patient-check-in", alsoActiveFor: ["doctor-queue"] },
  { key: "lab-service", path: "lab-service" },
  { key: "insurance", path: "insurance" },
  { key: "queue", path: "queue" },
  { key: "doctor-schedule", path: "doctor-schedule" },
  { key: "reports", path: "reports" },
  { key: "settings", path: "settings" },
];

export const navUrl = (item: NavItem): string => `${BASE}/${item.path}`;
export const PROFILE_URL = `${BASE}/profile`;
export const LOGIN_URL = "/patient/login";
