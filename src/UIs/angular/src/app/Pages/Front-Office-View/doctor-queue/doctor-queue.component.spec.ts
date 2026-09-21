import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DoctorQueueComponent } from "./doctor-queue.component";
import { provideMockStore } from "@ngrx/store/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

describe("DoctorQueueComponent", () => {
  let component: DoctorQueueComponent;
  let fixture: ComponentFixture<DoctorQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorQueueComponent],
      providers: [
        provideMockStore(),

        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        },

        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorQueueComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});