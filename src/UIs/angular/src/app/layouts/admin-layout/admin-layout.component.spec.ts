import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminLayoutComponent } from "./admin-layout.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AdminLayoutComponent", () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
