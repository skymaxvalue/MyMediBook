import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PatientSelectionDialogComponent } from "./patient-selection-dialog.component";

describe("PatientSelectionDialogComponent", () => {
  let component: PatientSelectionDialogComponent;
  let fixture: ComponentFixture<PatientSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSelectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientSelectionDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
