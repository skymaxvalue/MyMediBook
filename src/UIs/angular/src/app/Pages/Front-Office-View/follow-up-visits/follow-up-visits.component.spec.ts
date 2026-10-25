import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FollowUpVisitsComponent } from "./follow-up-visits.component";

describe("FollowUpVisitsComponent", () => {
  let component: FollowUpVisitsComponent;
  let fixture: ComponentFixture<FollowUpVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpVisitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpVisitsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
