import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LabServiceComponent } from "./lab-services.component";

describe("LabServiceComponent", () => {
  let component: LabServiceComponent;
  let fixture: ComponentFixture<LabServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabServiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
