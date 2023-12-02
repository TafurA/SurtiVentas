import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutConfirmationPage } from './checkout-confirmation.page';

describe('CheckoutConfirmationPage', () => {
  let component: CheckoutConfirmationPage;
  let fixture: ComponentFixture<CheckoutConfirmationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CheckoutConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
