import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontOfficeHeaderComponent } from "./front-office-header.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("FrontOfficeHeaderComponent", () => {
  let component: FrontOfficeHeaderComponent;
  let fixture: ComponentFixture<FrontOfficeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOfficeHeaderComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontOfficeHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
