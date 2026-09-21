import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { AdminLoginComponent } from "./admin-login.component";

import { provideRouter } from "@angular/router";
describe("AdminLoginComponent", () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent],
      providers: [
        provideMockStore(),

        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
