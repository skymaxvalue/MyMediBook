import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabServicesComponent } from "./lab-services.component";

describe("LabServicesComponent", () => {
  let component: LabServicesComponent;
  let fixture: ComponentFixture<LabServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabServicesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
