export interface Breadcrumb {
  label: string;
  url?: string;
}

const BASE = "/front-office";

export const DASHBOARD_CRUMB: Breadcrumb = {
  label: "Dashboard",
  url: `${BASE}/dashboard`,
};

const BOOK_APPOINTMENT: Breadcrumb = { label: "Book Appointment", url: `${BASE}/book-appointment` };
const PATIENT_CHECK_IN: Breadcrumb = { label: "Patient Check-In", url: `${BASE}/patient-check-in` };

/** Key = first path segment after /front-office. Last item is the current page. */
export const BREADCRUMB_MAP: Record<string, Breadcrumb[]> = {
  "patient-registration": [{ label: "Patient Registration" }],
  "book-appointment": [{ label: "Book Appointment" }],
  "patient-check-in": [{ label: "Patient Check-In" }],
  "lab-service": [{ label: "Lab Service" }],
  "doctor-queue": [PATIENT_CHECK_IN, { label: "Appointment Check-Ins" }],
  "doctor-availability": [BOOK_APPOINTMENT, { label: "Doctor Availability" }],
  "room-service": [{ label: "Room Service Request" }],
};
