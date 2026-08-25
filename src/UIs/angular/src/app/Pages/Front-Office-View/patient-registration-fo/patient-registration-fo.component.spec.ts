import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientRegistrationFOComponent } from "./patient-registration-fo.component";

describe("PatientRegistrationFOComponent", () => {
  let component: PatientRegistrationFOComponent;
  let fixture: ComponentFixture<PatientRegistrationFOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRegistrationFOComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRegistrationFOComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
