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


import {Option} from './option.model';

export interface Question {
  id: number;
  description: string;
  options: Option[];
}
