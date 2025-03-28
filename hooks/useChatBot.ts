import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserResponse, WorkoutFeedback, WorkoutPlan } from '@/types';
import {
  generateWorkoutService,
  reGenerateWorkoutService,
  updateGenerateWorkoutService,
} from '@/services/workouts';
import { questions } from '@/components/WorkoutChatbot/questions';
import usePlatform from './usePlatform';
import { formatFitnessData } from '@/utils/AiWorkoutPlanHelper';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGenerateWorkoutPlanStore } from '@/store/generateWorkoutPlanStore';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

export const useChatBot = (toggleModal?: () => void, scrollToBottom?: () => void) => {
  const { isWeb } = usePlatform();
  const { slug } = useLocalSearchParams() as { slug: string };
  const [currentQuestionId, setCurrentQuestionId] = useState('entry');
  const { setGeneratedWorkoutPlan } = useGenerateWorkoutPlanStore();
  const { setWorkoutDetail } = useWorkoutDetailStore();

  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nativeListRef = useRef<ScrollView>(null);
  const [responseError, setResponseError] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWorkoutApproved, setIsWorkoutApproved] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<WorkoutFeedback>({
    rating: 'good',
    feedback: '',
  });

  const { mutate: mutateGenerateWorkout, isPending: isPendingGenerateWorkout } = useMutation({
    mutationFn: generateWorkoutService,
    onSuccess: data => {
      setWorkoutPlan(data?.data);
      setGeneratedWorkoutPlan(data?.data);
      setResponseError('');
    },
    onError: (error: string) => {
      console.warn('Workout generation error:', error);
      setResponseError(error);
    },
  });

  const { mutate: mutateRegenerateWorkout, isPending: isPendingRegenerateWorkout } = useMutation({
    mutationFn: reGenerateWorkoutService,
    onSuccess: data => {
      const payload = {
        id: slug,
        exercises: data?.data?.exercises,
      };
      mutateUpdateGenerateWorkout(payload);
      setResponseError('');
    },
    onError: (error: string) => {
      console.warn('Workout generation error:', error);
      setResponseError(error);
    },
  });

  const { mutate: mutateUpdateGenerateWorkout, isPending: isPendingUpdateGenerateWorkout } =
    useMutation({
      mutationFn: updateGenerateWorkoutService,
      onSuccess: data => {
        console.log('Workout saved', data);

        setWorkoutDetail(data?.data);
        toggleModal?.();
        // setGeneratedWorkoutPlan(data?.data);
        setResponseError('');
      },
      onError: (error: string) => {
        console.log('Workout mutateUpdateGenerateWorkout error:', error);
        setResponseError(error);
      },
    });

  const messageEndScrollToBottomInWeb = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentQuestionId !== 'entry' && isWeb) {
      messageEndScrollToBottomInWeb();
    } else if (currentQuestionId !== 'entry' && !isWeb) {
      nativeListRef.current?.scrollToEnd({ animated: true });
    }
  }, [currentQuestionId, workoutPlan, showSummary]);

  const handleAnswer = (answer: string | string[]) => {
    const currentQuestion = questions[currentQuestionId];

    const newResponses = [
      ...responses.filter(r => r.questionId !== currentQuestionId),
      { questionId: currentQuestionId, answer, question: currentQuestion.question },
    ];

    setResponses(newResponses);

    if (currentQuestion.type === 'multi-select' || currentQuestion.type === 'text') {
      console.log('(INFO)::handleAnswer with type multi-select or text ', {
        currentQuestion,
        answer,
      });

      return; // Don't advance automatically for multi-select and text
    }

    // Find the next question
    let nextQuestionId: string;
    if (currentQuestion.next) {
      nextQuestionId = currentQuestion.next;
    } else if (currentQuestion.options) {
      const selectedOption = currentQuestion.options.find(opt => opt.label === answer);
      nextQuestionId = selectedOption?.next || 'end';
    } else {
      nextQuestionId = 'end';
    }

    // console.log('handleAnswer', { nextQuestionId });

    setCurrentQuestionId(nextQuestionId);
  };

  const handleContinue = (answer: string | string[]) => {
    const currentQuestion = questions[currentQuestionId];
    console.log('(INFO):: handleContinue', {
      currentQuestionData: currentQuestion,

      currentQuestionNext: currentQuestion.next,
    });
    if (currentQuestion.next) {
      setCurrentQuestionId(currentQuestion.next);
    } else if (currentQuestion.options) {
      setCurrentQuestionId(currentQuestion.options[0].next);
    }
  };

  const getCurrentResponse = () => {
    const response = responses.find(r => r.questionId === currentQuestionId);
    // console.log('getCurrentResponse', { response, responses });
    if (!response) {
      return questions[currentQuestionId].type === 'multi-select' ? [] : '';
    }

    return response.answer;
  };

  const goBack = () => {
    if (responses.length > 0) {
      const previousResponse = responses[responses.length - 1]; // Get the last answered question
      // setResponses(responses.slice(0, -1)); // Remove the last response
      setCurrentQuestionId(previousResponse.questionId); // Go back to the last question
      setShowSummary(false);
    }
  };

  const handleGenerateWorkout = (hasFeedback?: boolean, feedback?: string) => {
    const payload = formatFitnessData(responses, workoutPlan ?? null, feedback);
    console.log(payload);
    mutateGenerateWorkout({ prompt: payload });
  };

  const generateWorkout = () => {
    handleGenerateWorkout();

    setShowFeedback(true);
  };

  const handleFeedback = async (feedback: WorkoutFeedback) => {
    if (feedback.rating === 'good') {
      setIsWorkoutApproved(true);
    } else {
      setCurrentFeedback(feedback);
      // Reset workout and regenerate with feedback
      setWorkoutPlan(null);
      setGeneratedWorkoutPlan(null);
      setShowFeedback(false);

      handleGenerateWorkout(true, feedback.feedback); // Regenerate workout with feedback

      setShowFeedback(true);
    }
  };

  const handleRegenerateWorkout = (feedback: string) => {
    mutateRegenerateWorkout({ prompt: feedback, id: slug });
  };

  return {
    responses,
    workoutPlan,
    showSummary,
    responseError,
    isPendingGenerateWorkout,
    messagesEndRef,
    nativeListRef,
    currentQuestionId,
    isWorkoutApproved,
    showFeedback,
    isPendingRegenerateWorkout,
    isPendingUpdateGenerateWorkout,
    handleFeedback,
    scrollToBottom,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    handleRegenerateWorkout,
  };
};
