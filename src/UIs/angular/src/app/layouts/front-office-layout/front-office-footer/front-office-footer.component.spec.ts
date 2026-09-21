import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontOfficeFooterComponent } from "./front-office-footer.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("FrontOfficeFooterComponent", () => {
  let component: FrontOfficeFooterComponent;
  let fixture: ComponentFixture<FrontOfficeFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOfficeFooterComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontOfficeFooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
