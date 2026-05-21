import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MedicineOrdersComponent } from "./medicine-orders.component";

describe("MedicineOrdersComponent", () => {
  let component: MedicineOrdersComponent;
  let fixture: ComponentFixture<MedicineOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineOrdersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineOrdersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
