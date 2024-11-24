import { ModelBase } from './model-base';
import { Question } from './question.model';

export interface Option extends ModelBase {
  correct: boolean;
  description: string;
  question: Question;
}
