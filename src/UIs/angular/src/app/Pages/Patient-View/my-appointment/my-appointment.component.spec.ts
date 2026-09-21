import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MyAppointmentComponent } from "./my-appointment.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("MyAppointmentComponent", () => {
  let component: MyAppointmentComponent;
  let fixture: ComponentFixture<MyAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppointmentComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAppointmentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
