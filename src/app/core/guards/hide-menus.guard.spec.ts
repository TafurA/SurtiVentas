import { TestBed } from '@angular/core/testing';

import { HideMenusGuard } from './hide-menus.guard';

describe('HideMenusGuard', () => {
  let guard: HideMenusGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HideMenusGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
