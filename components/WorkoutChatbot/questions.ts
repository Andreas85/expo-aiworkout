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
      { label: 'Beginner', next: 'workout_days' },
      { label: 'Intermediate', next: 'workout_days' },
      { label: 'Advanced', next: 'workout_days' },
    ],
  },
  workout_days: {
    question: 'How many days per week can you work out?',
    type: 'single-select',
    options: [
      { label: '1-2 days', next: 'workout_duration' },
      { label: '3-4 days', next: 'workout_duration' },
      { label: '5+ days', next: 'workout_duration' },
    ],
  },
  workout_duration: {
    question: 'How many minutes can you dedicate to each workout?',
    type: 'single-select',
    options: [
      { label: '15-30 minutes', next: 'equipment' },
      { label: '30-45 minutes', next: 'equipment' },
      { label: '45-60 minutes', next: 'equipment' },
      { label: 'More than 60 minutes', next: 'equipment' },
    ],
  },
  equipment: {
    question: 'Do you have access to workout equipment?',
    type: 'single-select',
    options: [
      { label: 'Yes', next: 'equipment_type' },
      { label: 'No', next: 'injuries' },
    ],
  },
  equipment_type: {
    question: 'What type of equipment do you have access to?',
    type: 'multi-select',
    options: [
      { label: 'Bodyweight only', next: 'injuries' },
      { label: 'Dumbbells', next: 'injuries' },
      { label: 'Resistance bands', next: 'injuries' },
      { label: 'Barbell and weights', next: 'injuries' },
      { label: 'Full gym access', next: 'injuries' },
    ],
  },
  injuries: {
    question: 'Do you have any injuries or physical limitations?',
    type: 'single-select',
    options: [
      { label: 'No', next: 'workout_preference' },
      { label: 'Yes, minor limitations', next: 'workout_preference' },
      { label: 'Yes, significant limitations', next: 'workout_preference' },
    ],
  },
  workout_preference: {
    question: 'What type of workout do you prefer?',
    type: 'single-select',
    options: [
      { label: 'Cardio-focused', next: 'body_focus' },
      { label: 'Strength-focused', next: 'body_focus' },
      { label: 'Mixed (Cardio + Strength)', next: 'body_focus' },
      { label: 'Mobility and flexibility', next: 'body_focus' },
    ],
  },
  body_focus: {
    question: 'Do you want to focus on a specific body part?',
    type: 'multi-select',
    options: [
      { label: 'Full body', next: 'progress_tracking' },
      { label: 'Upper body', next: 'progress_tracking' },
      { label: 'Lower body', next: 'progress_tracking' },
      { label: 'Core and abs', next: 'progress_tracking' },
    ],
  },
  progress_tracking: {
    question: 'Do you want to track your progress through regular assessments?',
    type: 'yes-no',
    options: [
      { label: 'Yes', next: 'additional_info' },
      { label: 'No', next: 'additional_info' },
    ],
  },
  additional_info: {
    question: 'Do you want to provide any additional information?',
    type: 'text',
    next: 'end',
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
