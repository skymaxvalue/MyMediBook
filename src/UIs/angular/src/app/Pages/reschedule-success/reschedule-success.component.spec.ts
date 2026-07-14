import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RescheduleSuccessComponent } from "./reschedule-success.component";

describe("RescheduleSuccessComponent", () => {
  let component: RescheduleSuccessComponent;
  let fixture: ComponentFixture<RescheduleSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RescheduleSuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
