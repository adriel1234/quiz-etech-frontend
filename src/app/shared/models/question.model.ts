export interface Option {
  description: string;
  correct: boolean;
}

export interface Question {
  description: string;
  options: Option[];
}
