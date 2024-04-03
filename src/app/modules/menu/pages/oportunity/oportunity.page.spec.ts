import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OportunityPage } from './oportunity.page';

describe('OportunityPage', () => {
  let component: OportunityPage;
  let fixture: ComponentFixture<OportunityPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OportunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
