import { Questions } from '@/types';

export const questions: Questions = {
  entry: {
    question:
      'Do you want to go through a detailed questionnaire or provide your preferences directly?',
    type: 'single-select',
    options: [
      { label: 'Go through detailed questionnaire', next: 'fitness_goal' },
      { label: 'Provide preferences directly', next: 'preferences_form' },
    ],
  },
  fitness_goal: {
    question: 'What is your primary fitness goal?',
    type: 'single-select',
    options: [
      { label: 'Lose weight', next: 'fitness_level' },
      { label: 'Build muscle', next: 'fitness_level' },
      { label: 'Improve flexibility', next: 'fitness_level' },
      { label: 'General fitness', next: 'fitness_level' },
    ],
  },
  fitness_level: {
    question: 'What is your current fitness level?',
    type: 'single-select',
    options: [
      { label: 'Beginner', next: 'workout_duration' },
      { label: 'Intermediate', next: 'workout_duration' },
      { label: 'Advanced', next: 'workout_duration' },
    ],
  },
  workout_duration: {
    question: 'How many exercises do you want in your workout?',
    type: 'single-select',
    options: [
      { label: '3 exercises', next: 'equipment_type' },
      { label: '5 exercises', next: 'equipment_type' },
      { label: '7 exercises', next: 'equipment_type' },
      { label: '10 exercises', next: 'equipment_type' },
      { label: '15 exercises', next: 'equipment_type' },
      { label: '20 exercises', next: 'equipment_type' },
    ],
  },
  equipment_type: {
    question: 'What type of equipment do you have access to?',
    type: 'multi-select',
    options: [
      { label: 'Bodyweight', next: 'body_focus' },
      { label: 'Dumbbells', next: 'body_focus' },
      { label: 'Barbells', next: 'body_focus' },
      { label: 'Kettlebells', next: 'body_focus' },
      { label: 'Resistance bands', next: 'body_focus' },
      { label: 'Full gym access', next: 'body_focus' },
    ],
  },
  body_focus: {
    question: 'Do you want to focus on a specific body part?',
    type: 'single-select',
    options: [
      { label: 'Full body', next: 'additional_info' },
      { label: 'Chest', next: 'additional_info' },
      { label: 'Back', next: 'additional_info' },
      { label: 'Legs', next: 'additional_info' },
      { label: 'Core', next: 'additional_info' },
      { label: 'Push', next: 'additional_info' },
      { label: 'Pull', next: 'additional_info' },
    ],
  },
  additional_info: {
    question: 'Do you want to provide any additional information?',
    type: 'single-select',
    options: [
      { label: 'No', next: 'end' },
      { label: 'Yes', next: 'preferences_form' },
    ],
  },
  preferences_form: {
    question: 'Please provide your preferences directly (free-text).',
    type: 'text',
    next: 'end',
  },
  end: {
    message: 'Thank you for your responses! We will now generate a personalized workout plan.',
  },
};
