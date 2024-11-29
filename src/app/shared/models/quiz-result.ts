import {ModelBase} from './model-base';

export interface QuizResult {
  id?:number,
  quizId:string,
  name:string,
  score?:number,
  percentage?:number,
  correct?:number,
  inCorrect?:number,
  unAttempt?:number
  response?:{questionId:string, answerOptionId:string}[]
}
