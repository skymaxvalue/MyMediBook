import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookingSuccessfullComponent } from "./booking-successfull.component";

describe("BookingSuccessfullComponent", () => {
  let component: BookingSuccessfullComponent;
  let fixture: ComponentFixture<BookingSuccessfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSuccessfullComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSuccessfullComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
