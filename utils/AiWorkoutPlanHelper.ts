type QuestionResponse = {
  questionId: string;
  answer: string | string[];
  question: string;
};

type FormattedResponse = {
  responses: Record<string, string | string[]>;
  previousWorkout: Record<string, any> | null;
  feedback: string | null;
};

export const formatFitnessData = (
  data: QuestionResponse[],
  previousWorkoutPlan: Record<string, any> | null = null,
  feedback: string | null = null,
): FormattedResponse => {
  return {
    responses: data.reduce(
      (acc, item) => {
        acc[item.questionId] = item.answer;
        return acc;
      },
      {} as Record<string, string | string[]>,
    ),
    previousWorkout: previousWorkoutPlan,
    feedback: feedback,
  };
};
