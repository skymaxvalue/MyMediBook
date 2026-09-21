import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookingFailedComponent } from "./booking-failed.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("BookingFailedComponent", () => {
  let component: BookingFailedComponent;
  let fixture: ComponentFixture<BookingFailedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFailedComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFailedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
