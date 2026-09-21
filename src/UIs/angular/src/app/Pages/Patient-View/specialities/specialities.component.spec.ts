import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SpecialitiesComponent } from "./specialities.component";
import { provideMockStore } from "@ngrx/store/testing";
import { Router } from "@angular/router";

describe("SpecialitiesComponent", () => {
  let component: SpecialitiesComponent;
  let fixture: ComponentFixture<SpecialitiesComponent>;

  beforeEach(async () => {
    // Mock browser history state used by the component constructor
    window.history.replaceState(
      { isFrontOfficePage: false },
      ""
    );

    await TestBed.configureTestingModule({
      imports: [SpecialitiesComponent],
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialitiesComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});