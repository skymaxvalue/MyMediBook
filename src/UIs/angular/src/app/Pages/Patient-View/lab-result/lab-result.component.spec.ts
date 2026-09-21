import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LabResultComponent } from "./lab-result.component";
import { provideMockStore } from "@ngrx/store/testing";
import { PdfService } from "src/app/core/Services/pdf.service";

describe("LabResultComponent", () => {
  let component: LabResultComponent;
  let fixture: ComponentFixture<LabResultComponent>;

  beforeEach(async () => {
    // Mock logged-in user for the component constructor
    localStorage.setItem(
      "user",
      JSON.stringify({
        refId: "test-patient-id"
      })
    );

    await TestBed.configureTestingModule({
      imports: [LabResultComponent],
      providers: [
        provideMockStore(),
        {
          provide: PdfService,
          useValue: {
            downloadPdf: jest.fn()
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LabResultComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem("user");
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});