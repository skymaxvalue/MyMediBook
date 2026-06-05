import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HelthCareAssociationComponent } from "./helth-care-association.component";

describe("HelthCareAssociationComponent", () => {
  let component: HelthCareAssociationComponent;
  let fixture: ComponentFixture<HelthCareAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelthCareAssociationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelthCareAssociationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
