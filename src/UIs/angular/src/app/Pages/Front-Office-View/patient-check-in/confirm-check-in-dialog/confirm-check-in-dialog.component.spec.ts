import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmCheckInDialogComponent } from "./confirm-check-in-dialog.component";

describe("ConfirmCheckInDialogComponent", () => {
  let component: ConfirmCheckInDialogComponent;
  let fixture: ComponentFixture<ConfirmCheckInDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCheckInDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmCheckInDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
