import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RescheduleComponent } from "./reschedule.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("RescheduleComponent", () => {
  let component: RescheduleComponent;
  let fixture: ComponentFixture<RescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RescheduleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
