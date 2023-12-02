import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreDetailPage } from './store-detail.page';

describe('StoreDetailPage', () => {
  let component: StoreDetailPage;
  let fixture: ComponentFixture<StoreDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StoreDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
