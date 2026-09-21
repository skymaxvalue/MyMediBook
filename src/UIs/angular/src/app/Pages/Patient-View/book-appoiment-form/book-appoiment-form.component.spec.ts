import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BookAppoimentFormComponent } from "./book-appoiment-form.component";
import { provideMockStore } from "@ngrx/store/testing";

describe("BookAppoimentFormComponent", () => {
  let component: BookAppoimentFormComponent;
  let fixture: ComponentFixture<BookAppoimentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAppoimentFormComponent],
      providers: [
        provideMockStore()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookAppoimentFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
