import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerFormComponent } from './question-answer-form.component';

describe('QuestionAnswerFormComponent', () => {
  let component: QuestionAnswerFormComponent;
  let fixture: ComponentFixture<QuestionAnswerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionAnswerFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionAnswerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
