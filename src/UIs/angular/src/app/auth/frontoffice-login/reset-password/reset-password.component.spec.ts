import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ResetPasswordComponent } from "./reset-password.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
