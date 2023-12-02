import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryOrdersPage } from './history-orders.page';

describe('HistoryOrdersPage', () => {
  let component: HistoryOrdersPage;
  let fixture: ComponentFixture<HistoryOrdersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistoryOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
