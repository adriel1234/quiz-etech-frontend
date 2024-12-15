import { ModelBase } from './model-base';
import { QuestionGroup } from './question-group.model';

export interface Match extends ModelBase {
  time_per_question: number;
  description: string;
  question_group: number;
}
