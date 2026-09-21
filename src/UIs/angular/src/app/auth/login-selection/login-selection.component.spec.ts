import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LoginSelectionComponent } from "./login-selection.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("LoginSelectionComponent", () => {
  let component: LoginSelectionComponent;
  let fixture: ComponentFixture<LoginSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginSelectionComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSelectionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
