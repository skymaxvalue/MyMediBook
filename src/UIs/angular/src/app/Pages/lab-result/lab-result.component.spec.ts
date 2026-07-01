import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabResultComponent } from "./lab-result.component";

describe("LabResultComponent", () => {
  let component: LabResultComponent;
  let fixture: ComponentFixture<LabResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResultComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
