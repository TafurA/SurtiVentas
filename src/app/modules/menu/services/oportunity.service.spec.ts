import { TestBed } from '@angular/core/testing';

import { OportunityService } from './oportunity.service';

describe('OportunityService', () => {
  let service: OportunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OportunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
