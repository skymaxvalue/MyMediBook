import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckDocAvailableComponent } from "./check-doc-available.component";

describe("CheckDocAvailableComponent", () => {
  let component: CheckDocAvailableComponent;
  let fixture: ComponentFixture<CheckDocAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckDocAvailableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckDocAvailableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
