import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { FrontofficeLoginComponent } from "./frontoffice-login.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("FrontofficeLoginComponent", () => {
  let component: FrontofficeLoginComponent;
  let fixture: ComponentFixture<FrontofficeLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontofficeLoginComponent, RouterTestingModule
      ],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontofficeLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
