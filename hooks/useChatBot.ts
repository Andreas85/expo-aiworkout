import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UserResponse, WorkoutFeedback, WorkoutPlan } from '@/types';
import { generateWorkoutService } from '@/services/workouts';
import { questions } from '@/components/WorkoutChatbot/questions';
import { FlatList } from 'react-native-gesture-handler';
import usePlatform from './usePlatform';

export const useChatBot = (toggleModal: () => void, scrollToBottom?: () => void) => {
  const { isWeb } = usePlatform();
  const [currentQuestionId, setCurrentQuestionId] = useState('entry');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const flatListRef = useRef<FlatList>(null);
  const [responseError, setResponseError] = useState<string>();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isWorkoutApproved, setIsWorkoutApproved] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<WorkoutFeedback | null>(null);

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
    if (currentQuestionId !== 'entry' && isWeb) {
      messageEndScrollToBottomInWeb();
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

    setCurrentQuestionId(nextQuestionId);
  };

  const handleContinue = () => {
    const currentQuestion = questions[currentQuestionId];
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

  const generateWorkout = async () => {
    mutateGenerateWorkout({
      prompt: 'Make me the most fit person on earth in 5 days',
    });

    setShowFeedback(true);
  };

  const saveWorkout = async () => {
    console.log('saveWorkout', responses);
    alert('Workout plan will be saved soon!');
    toggleModal();
  };

  const handleFeedback = async (feedback: WorkoutFeedback) => {
    if (feedback.rating === 'good') {
      setIsWorkoutApproved(true);
    } else {
      setCurrentFeedback(feedback);
      // Reset workout and regenerate with feedback
      setWorkoutPlan(null);
      setShowFeedback(false);

      mutateGenerateWorkout({ prompt: 'Make me the most fit person on earth in 5 days' });

      setShowFeedback(true);
    }
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
    currentQuestionId,
    isWorkoutApproved,
    showFeedback,
    handleFeedback,
    scrollToBottom,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    saveWorkout,
  };
};
