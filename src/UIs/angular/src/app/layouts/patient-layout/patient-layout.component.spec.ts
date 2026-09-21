import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientLayoutComponent } from "./patient-layout.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("PatientLayoutComponent", () => {
  let component: PatientLayoutComponent;
  let fixture: ComponentFixture<PatientLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLayoutComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
