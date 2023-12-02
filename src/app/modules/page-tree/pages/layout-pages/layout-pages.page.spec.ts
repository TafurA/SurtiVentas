import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutPagesPage } from './layout-pages.page';

describe('LayoutPagesPage', () => {
  let component: LayoutPagesPage;
  let fixture: ComponentFixture<LayoutPagesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LayoutPagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
