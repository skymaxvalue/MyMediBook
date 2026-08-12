import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookAppoimentFormComponent } from "./book-appoiment-form.component";

describe("BookAppoimentFormComponent", () => {
  let component: BookAppoimentFormComponent;
  let fixture: ComponentFixture<BookAppoimentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAppoimentFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookAppoimentFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
