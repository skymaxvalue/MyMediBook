import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssignScheduleAsspciationComponent } from "./assign-schedule-asspciation.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AssignScheduleAsspciationComponent", () => {
  let component: AssignScheduleAsspciationComponent;
  let fixture: ComponentFixture<AssignScheduleAsspciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignScheduleAsspciationComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignScheduleAsspciationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
