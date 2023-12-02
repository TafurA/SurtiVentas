import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FrequentQuestionPage } from './frequent-question.page';

describe('FrequentQuestionPage', () => {
  let component: FrequentQuestionPage;
  let fixture: ComponentFixture<FrequentQuestionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FrequentQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
