import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserResponse, WorkoutPlan } from '@/types';
import { generateWorkoutService } from '@/services/workouts';
import { questions } from '@/components/WorkoutChatbot/questions';
import { FlatList } from 'react-native-gesture-handler';
import usePlatform from './usePlatform';

export const useChatBot = (toggleModal: () => void, scrollToBottom?: () => void) => {
  const { isWeb } = usePlatform();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const flatListRef = useRef<FlatList>(null);
  const [responseError, setResponseError] = useState<string>();

  const { mutate: mutateGenerateWorkout, isPending: isPendingGenerateWorkout } = useMutation({
    mutationFn: generateWorkoutService,
    onSuccess: data => {
      setWorkoutPlan(data?.data);
      setResponseError('');
    },
    onError: (error: string) => {
      console.warn('Workout generation error:', error);
      setResponseError(error);
    },
  });

  const messageEndScrollToBottomInWeb = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentQuestionIndex !== 0 && isWeb) {
      messageEndScrollToBottomInWeb();
    }
  }, [currentQuestionIndex, workoutPlan, showSummary]);

  const handleAnswer = (answer: string | string[]) => {
    const newResponses = [
      ...responses.filter(r => r.questionIndex !== currentQuestionIndex),
      { questionIndex: currentQuestionIndex, answer },
    ].sort((a, b) => a.questionIndex - b.questionIndex);

    setResponses(newResponses);

    if (questions[currentQuestionIndex].type !== 'multi-select') {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const getCurrentResponse = () => {
    const response = responses.find(r => r.questionIndex === currentQuestionIndex);
    return response
      ? response.answer
      : questions[currentQuestionIndex].type === 'multi-select'
        ? []
        : '';
  };

  const goBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowSummary(false);
    }
  };

  const generateWorkout = async () => {
    mutateGenerateWorkout({
      prompt: 'Make me the most fit person on earth in 5 days',
    });
  };

  const saveWorkout = async () => {
    console.log('saveWorkout', responses);
    alert('Workout plan will be saved soon!');
    toggleModal();
  };

  return {
    currentQuestionIndex,
    responses,
    workoutPlan,
    showSummary,
    responseError,
    isPendingGenerateWorkout,
    messagesEndRef,
    flatListRef,
    scrollToBottom,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    saveWorkout,
  };
};
