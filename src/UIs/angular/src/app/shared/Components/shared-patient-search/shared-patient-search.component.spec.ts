import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedPatientSearchComponent } from "./shared-patient-search.component";

describe("SharedPatientSearchComponent", () => {
  let component: SharedPatientSearchComponent;
  let fixture: ComponentFixture<SharedPatientSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedPatientSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedPatientSearchComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
