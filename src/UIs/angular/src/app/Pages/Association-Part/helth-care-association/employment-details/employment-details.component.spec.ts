import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmploymentDetailsComponent } from "./employment-details.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("EmploymentDetailsComponent", () => {
  let component: EmploymentDetailsComponent;
  let fixture: ComponentFixture<EmploymentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentDetailsComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
