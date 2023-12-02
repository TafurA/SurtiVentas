import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevolutionsPage } from './devolutions.page';

describe('DevolutionsPage', () => {
  let component: DevolutionsPage;
  let fixture: ComponentFixture<DevolutionsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DevolutionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
