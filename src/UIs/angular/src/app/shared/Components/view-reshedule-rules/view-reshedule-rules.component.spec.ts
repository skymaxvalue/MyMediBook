import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewResheduleRulesComponent } from "./view-reshedule-rules.component";

describe("ViewResheduleRulesComponent", () => {
  let component: ViewResheduleRulesComponent;
  let fixture: ComponentFixture<ViewResheduleRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewResheduleRulesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewResheduleRulesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
