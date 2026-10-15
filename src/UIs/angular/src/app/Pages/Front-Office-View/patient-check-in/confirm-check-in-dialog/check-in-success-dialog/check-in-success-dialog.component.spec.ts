import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckInSuccessDialogComponent } from "./check-in-success-dialog.component";

describe("CheckInSuccessDialogComponent", () => {
  let component: CheckInSuccessDialogComponent;
  let fixture: ComponentFixture<CheckInSuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckInSuccessDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckInSuccessDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
