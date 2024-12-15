import { ModelBase } from './model-base';
import { Match } from './match.model';

export interface MatchUser extends ModelBase {
  user: number;
  match: Match;
  points: number;
  rightQuestions: number;
  wrongQuestions: number;
}

export interface MatchUserName {
  userName: string;
  userId?: number;
  match: Match;
  points: number;
  rightQuestions: number;
  wrongQuestions: number;
  id?: number; // Tornar opcional
  createdAt?: string; // Tornar opcional
  modifiedAt?: string; // Tornar opcional
}

export interface MatchUserTest {
  userName: string;
  userId?: number;
  match: Match;
  points: number;
  rightQuestions: number;
  wrongQuestions: number;
  id?: number; // Tornar opcional
  createdAt?: string; // Tornar opcional
  modifiedAt?: string; // Tornar opcional
}
