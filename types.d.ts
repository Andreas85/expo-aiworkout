export type QuestionType = 'single-select' | 'multi-select' | 'yes-no' | 'text';

export interface QuestionOption {
  label: string;
  next: string;
}

export interface Question {
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  next?: string;
  message?: string;
}

export interface Questions {
  [key: string]: Question;
}

export interface UserResponse {
  questionId: string;
  answer: string | string[];
  question: string;
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

export interface WorkoutFeedback {
  rating: 'good' | 'needs_changes';
  feedback?: string;
}
