import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminSidebarComponent } from "./admin-sidebar.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AdminSidebarComponent", () => {
  let component: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSidebarComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
