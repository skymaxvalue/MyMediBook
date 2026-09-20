import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RoomServiceComponent } from "./room-service.component";

describe("RoomServiceComponent", () => {
  let component: RoomServiceComponent;
  let fixture: ComponentFixture<RoomServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomServiceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoomServiceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
