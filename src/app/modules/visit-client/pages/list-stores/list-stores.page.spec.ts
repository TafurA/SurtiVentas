import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStoresPage } from './list-stores.page';

describe('ListStoresPage', () => {
  let component: ListStoresPage;
  let fixture: ComponentFixture<ListStoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
