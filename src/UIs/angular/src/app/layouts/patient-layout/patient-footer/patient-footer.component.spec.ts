import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientFooterComponent } from "./patient-footer.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("PatientFooterComponent", () => {
  let component: PatientFooterComponent;
  let fixture: ComponentFixture<PatientFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientFooterComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientFooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
