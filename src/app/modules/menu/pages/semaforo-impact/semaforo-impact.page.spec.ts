import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemaforoImpactPage } from './semaforo-impact.page';

describe('SemaforoImpactPage', () => {
  let component: SemaforoImpactPage;
  let fixture: ComponentFixture<SemaforoImpactPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SemaforoImpactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
