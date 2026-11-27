import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimLayoutComponent } from "./claim-layout.component";

describe("ClaimLayoutComponent", () => {
  let component: ClaimLayoutComponent;
  let fixture: ComponentFixture<ClaimLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
