import { TestBed } from "@angular/core/testing";

import { AppoinmentService } from "./appointment.service";

describe("AppoinmentService", () => {
  let service: AppoinmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppoinmentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
