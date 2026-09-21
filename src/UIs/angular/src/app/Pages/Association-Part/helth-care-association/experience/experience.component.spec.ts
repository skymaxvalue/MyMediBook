import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { ExperienceComponent } from "./experience.component";

describe("ExperienceComponent", () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
