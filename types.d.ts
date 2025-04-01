import { ExerciseElement } from './services/interfaces';

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
    sets?: number;
    reps: string;
    rest: string;
    duration?: string;
    exercise?: ExerciseElement;
    weight?: string;
  }[];
  name?: string;
  notes?: string;
}

export interface WorkoutFeedback {
  rating: 'good' | 'needs_changes';
  feedback?: string;
}

export interface WorkoutHistory {
  feedback: string;
  workoutPlan: WorkoutPlan[];
  historyId: string;
}
