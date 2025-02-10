export const questions = [
  {
    question: 'What is your fitness goal?',
    type: 'single-select',
    options: ['Lose weight', 'Build muscle', 'Improve flexibility', 'General fitness'],
  },
  {
    question: "What's your current fitness level?",
    type: 'single-select',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    question: 'How many days per week can you work out?',
    type: 'single-select',
    options: ['1-2 days', '3-4 days', '5-6 days', 'Every day'],
  },
  {
    question: 'How many minutes per workout can you commit?',
    type: 'single-select',
    options: ['15-30 minutes', '30-45 minutes', '45-60 minutes', 'More than 60 minutes'],
  },
  {
    question: 'What type of equipment do you have access to?',
    type: 'multi-select',
    options: [
      'Bodyweight only',
      'Dumbbells',
      'Resistance bands',
      'Barbell and weights',
      'Full gym access',
    ],
  },
  {
    question: 'Do you have any injuries or physical limitations?',
    type: 'single-select',
    options: ['No', 'Yes, minor limitations', 'Yes, significant limitations'],
  },
  {
    question: 'What type of workout do you prefer?',
    type: 'single-select',
    options: [
      'Cardio-focused',
      'Strength-focused',
      'Mixed (Cardio + Strength)',
      'Mobility and flexibility',
    ],
  },
  {
    question: 'Would you prefer high-intensity or moderate-intensity workouts?',
    type: 'single-select',
    options: ['High-intensity', 'Moderate-intensity', 'A mix of both'],
  },
  {
    question: 'Do you want to focus on a specific body part?',
    type: 'single-select',
    options: ['Full body', 'Upper body', 'Lower body', 'Core and abs'],
  },
  {
    question: 'Do you want to track your progress through regular assessments?',
    type: 'yes-no',
  },
  {
    question: 'Do you want to provide any additional information?',
    type: 'text',
  },
] as const;
