import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontOfficeLayoutComponent } from "./front-office-layout.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("FrontOfficeLayoutComponent", () => {
  let component: FrontOfficeLayoutComponent;
  let fixture: ComponentFixture<FrontOfficeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOfficeLayoutComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontOfficeLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
