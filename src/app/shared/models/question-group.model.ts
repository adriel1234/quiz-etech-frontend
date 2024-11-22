import { ModelBase } from './model-base';
import { Question } from './question.model';

export interface QuestionGroup extends ModelBase {
  description: string;
  questionsGroupQuestion: Question[];
}
