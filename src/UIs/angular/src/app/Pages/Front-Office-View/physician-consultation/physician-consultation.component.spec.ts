import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PhysicianConsultationComponent } from "./physician-consultation.component";

describe("PhysicianConsultationComponent", () => {
  let component: PhysicianConsultationComponent;
  let fixture: ComponentFixture<PhysicianConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicianConsultationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicianConsultationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
