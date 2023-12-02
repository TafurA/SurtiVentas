import { TestBed } from '@angular/core/testing';

import { RankingSellerService } from './ranking-seller.service';

describe('RankingSellerService', () => {
  let service: RankingSellerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RankingSellerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
