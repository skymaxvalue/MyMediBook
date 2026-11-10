import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PrescriptionRefillComponent } from "./prescription-refill.component";

describe("PrescriptionRefillComponent", () => {
  let component: PrescriptionRefillComponent;
  let fixture: ComponentFixture<PrescriptionRefillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionRefillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriptionRefillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
