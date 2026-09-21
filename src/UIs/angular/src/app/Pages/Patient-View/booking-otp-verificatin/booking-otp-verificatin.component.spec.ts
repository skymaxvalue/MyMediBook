import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookingOTPVerificatinComponent } from "./booking-otp-verificatin.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("BookingOTPVerificatinComponent", () => {
  let component: BookingOTPVerificatinComponent;
  let fixture: ComponentFixture<BookingOTPVerificatinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingOTPVerificatinComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingOTPVerificatinComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
