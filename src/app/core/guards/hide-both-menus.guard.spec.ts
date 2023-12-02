import { TestBed } from '@angular/core/testing';

import { HideBothMenusGuard } from './hide-both-menus.guard';

describe('HideBothMenusGuard', () => {
  let guard: HideBothMenusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HideBothMenusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
