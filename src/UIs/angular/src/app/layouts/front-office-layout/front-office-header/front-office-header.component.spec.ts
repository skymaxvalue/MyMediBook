import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontOfficeHeaderComponent } from "./front-office-header.component";

describe("FrontOfficeHeaderComponent", () => {
  let component: FrontOfficeHeaderComponent;
  let fixture: ComponentFixture<FrontOfficeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOfficeHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontOfficeHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
