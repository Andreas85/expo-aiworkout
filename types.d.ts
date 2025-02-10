declare module '*png';
declare module '*jpg';
declare module '*jpeg';
declare module 'pauseable';
declare module '*webp';
declare module '*.mp3' {
  const src: string;
  export default src;
}

export type QuestionType = 'single-select' | 'multi-select' | 'yes-no' | 'text';

export interface Question {
  question: string;
  type: QuestionType;
  options?: string[];
}

export interface UserResponse {
  questionIndex: number;
  answer: string | string[];
}

export interface WorkoutPlan {
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
  }[];
  frequency: string;
  duration: string;
  notes: string;
}
