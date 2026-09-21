import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfRegistrationComponent } from './self-registration.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('SelfRegistrationComponent', () => {
  let component: SelfRegistrationComponent;
  let fixture: ComponentFixture<SelfRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelfRegistrationComponent],
      providers: [
        provideMockStore()
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelfRegistrationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
