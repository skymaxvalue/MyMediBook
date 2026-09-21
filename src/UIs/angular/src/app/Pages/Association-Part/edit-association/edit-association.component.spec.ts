import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from '@angular/router';
import { EditAssociationComponent } from "./edit-association.component";
import { provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";

describe("EditAssociationComponent", () => {
  let component: EditAssociationComponent;
  let fixture: ComponentFixture<EditAssociationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssociationComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            },
            params: of({}),
            queryParams: of({})
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAssociationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
