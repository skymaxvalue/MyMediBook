import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SuccsesComponent } from "./succses.component";

describe("SuccsesComponent", () => {
  let component: SuccsesComponent;
  let fixture: ComponentFixture<SuccsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccsesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccsesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
