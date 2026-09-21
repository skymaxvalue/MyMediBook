import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PatientLoginComponent } from "./patient-login.component";
import { provideMockStore } from "@ngrx/store/testing";
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
describe("PatientLoginComponent", () => {
  let component: PatientLoginComponent;
  let fixture: ComponentFixture<PatientLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientLoginComponent],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            params: of({}),
            snapshot: {
              paramMap: {
                get: jest.fn()
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientLoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
