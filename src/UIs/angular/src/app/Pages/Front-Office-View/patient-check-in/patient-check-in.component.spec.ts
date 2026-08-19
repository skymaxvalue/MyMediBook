import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientCheckInComponent } from "./patient-check-in.component";

describe("PatientCheckInComponent", () => {
  let component: PatientCheckInComponent;
  let fixture: ComponentFixture<PatientCheckInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCheckInComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientCheckInComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
