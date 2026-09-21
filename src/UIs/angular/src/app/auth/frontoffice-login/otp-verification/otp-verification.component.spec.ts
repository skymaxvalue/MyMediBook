import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideMockStore } from "@ngrx/store/testing";
import { provideRouter } from "@angular/router";
import { OtpVerificationComponent } from "./otp-verification.component";

describe("OtpVerificationComponent", () => {
  let component: OtpVerificationComponent;
  let fixture: ComponentFixture<OtpVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpVerificationComponent],
      providers: [
        provideMockStore(),
        provideRouter([])
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpVerificationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
