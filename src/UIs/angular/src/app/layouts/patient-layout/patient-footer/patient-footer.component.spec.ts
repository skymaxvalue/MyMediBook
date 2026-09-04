import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientFooterComponent } from "./patient-footer.component";

describe("PatientFooterComponent", () => {
  let component: PatientFooterComponent;
  let fixture: ComponentFixture<PatientFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientFooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
