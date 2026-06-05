import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssociationListComponent } from "./association-list.component";

describe("AssociationListComponent", () => {
  let component: AssociationListComponent;
  let fixture: ComponentFixture<AssociationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
