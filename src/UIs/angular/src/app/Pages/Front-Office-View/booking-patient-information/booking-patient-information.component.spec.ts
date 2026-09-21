import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideMockStore } from "@ngrx/store/testing";
import { BookingPatientInformationComponent } from "./booking-patient-information.component";

describe("BookingPatientInformationComponent", () => {
  let component: BookingPatientInformationComponent;
  let fixture: ComponentFixture<BookingPatientInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingPatientInformationComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingPatientInformationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
