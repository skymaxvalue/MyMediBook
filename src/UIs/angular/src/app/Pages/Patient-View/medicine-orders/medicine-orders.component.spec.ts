import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MedicineOrdersComponent } from "./medicine-orders.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("MedicineOrdersComponent", () => {
  let component: MedicineOrdersComponent;
  let fixture: ComponentFixture<MedicineOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineOrdersComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineOrdersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});