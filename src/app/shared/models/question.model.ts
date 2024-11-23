// export interface Option {
//   description: string;
//   correct: boolean;
// }
//
// export interface Question {
//   description: string;
//   options: Option[];
// }

//
// import { ModelBase } from './model-base';
//
// export interface Question extends ModelBase {
//   description: string;
// }


export interface Question {
  id: number;
  description: string;
}
