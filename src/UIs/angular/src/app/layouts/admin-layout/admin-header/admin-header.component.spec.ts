import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminHeaderComponent } from "./admin-header.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AdminHeaderComponent", () => {
  let component: AdminHeaderComponent;
  let fixture: ComponentFixture<AdminHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHeaderComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
