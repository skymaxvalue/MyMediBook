import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SelectHospitalComponent } from "./select-hospital.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("SelectHospitalComponent", () => {
  let component: SelectHospitalComponent;
  let fixture: ComponentFixture<SelectHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHospitalComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectHospitalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
