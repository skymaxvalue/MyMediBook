import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontofficeLoginComponent } from "./frontoffice-login.component";

describe("FrontofficeLoginComponent", () => {
  let component: FrontofficeLoginComponent;
  let fixture: ComponentFixture<FrontofficeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontofficeLoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontofficeLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
