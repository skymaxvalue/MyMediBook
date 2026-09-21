import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AdminFooterComponent } from "./admin-footer.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("AdminFooterComponent", () => {
  let component: AdminFooterComponent;
  let fixture: ComponentFixture<AdminFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminFooterComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminFooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
