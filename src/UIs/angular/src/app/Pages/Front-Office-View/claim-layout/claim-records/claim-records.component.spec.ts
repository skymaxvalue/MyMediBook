import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ClaimRecordsComponent } from "./claim-records.component";

describe("ClaimRecordsComponent", () => {
  let component: ClaimRecordsComponent;
  let fixture: ComponentFixture<ClaimRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimRecordsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimRecordsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
