import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FrontOfficeSidebarComponent } from "./front-office-sidebar.component";

describe("FrontOfficeSidebarComponent", () => {
  let component: FrontOfficeSidebarComponent;
  let fixture: ComponentFixture<FrontOfficeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontOfficeSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrontOfficeSidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
