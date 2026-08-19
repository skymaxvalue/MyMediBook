import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewCancelsheduleRulesComponent } from "./view-cancelshedule-rules.component";

describe("ViewCancelsheduleRulesComponent", () => {
  let component: ViewCancelsheduleRulesComponent;
  let fixture: ComponentFixture<ViewCancelsheduleRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCancelsheduleRulesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewCancelsheduleRulesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
