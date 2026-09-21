import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookingSuccessfullComponent } from "./booking-successfull.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("BookingSuccessfullComponent", () => {
  let component: BookingSuccessfullComponent;
  let fixture: ComponentFixture<BookingSuccessfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSuccessfullComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSuccessfullComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
