import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillingTimePage } from './billing-time.page';

describe('BillingTimePage', () => {
  let component: BillingTimePage;
  let fixture: ComponentFixture<BillingTimePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BillingTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
