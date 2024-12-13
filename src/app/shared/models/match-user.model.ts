import { ModelBase } from './model-base';
import { Match } from './match.model';

export interface MatchUser extends ModelBase {
  userId: number;
  match: Match;
  points: number;
  rightQuestions: number;
  wrongQuestions: number;
}
