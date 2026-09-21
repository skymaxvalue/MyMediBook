import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssociationListComponent } from "./association-list.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AssociationListComponent", () => {
  let component: AssociationListComponent;
  let fixture: ComponentFixture<AssociationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationListComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
