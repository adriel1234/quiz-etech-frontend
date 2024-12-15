import { ModelBase } from './model-base';
import { Question } from './question.model';

export interface Option {
  id: number;
  createdAt: Date;
  modifiedAt: Date;
  correct: boolean;
  description: string;
  question: Question;
}
