import {ModelBase} from './model-base';

export interface QuizResult {
  id?:string,
  quizId:string
  name:string,
  score?:string,
  percentage?:string,
  correct?:string,
  inCorrect?:string,
  unAttempt?:string
  response?:{questionId:string, answerOptionId:string}[]
}
