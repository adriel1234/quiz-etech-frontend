import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionGroupCreateComponent } from './question-group-create.component';

describe('QuestionGroupCreateComponent', () => {
  let component: QuestionGroupCreateComponent;
  let fixture: ComponentFixture<QuestionGroupCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionGroupCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionGroupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
