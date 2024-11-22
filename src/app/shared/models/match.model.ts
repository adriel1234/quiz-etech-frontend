import { ModelBase } from './model-base';
import { QuestionGroup } from './question-group.model';

export interface Match extends ModelBase {
  timePerQuestion: number;
  description: string;
  questionGroup: QuestionGroup;
}
