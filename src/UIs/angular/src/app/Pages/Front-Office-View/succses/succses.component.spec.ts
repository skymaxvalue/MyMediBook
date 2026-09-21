import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { SuccsesComponent } from "./succses.component";

describe("SuccsesComponent", () => {
  let component: SuccsesComponent;
  let fixture: ComponentFixture<SuccsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccsesComponent],
      providers: [
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccsesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
