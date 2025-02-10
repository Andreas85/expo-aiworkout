import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';
import { ChatMessage } from './ChatMessage';
import { QuestionInput } from './QuestionInput';
import { questions } from './questions';
import { WorkoutPlanView } from './WorkoutPlan';
import { STRING_DATA } from '@/utils/appConstants';
import { UserResponse, WorkoutPlan } from '@/types';
import { AntDesign } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import { useMutation } from '@tanstack/react-query';
import { generateWorkoutService } from '@/services/workouts';

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  const [showSummary, setShowSummary] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [responseError, setResponseError] = useState<string>();

  const { mutate: mutateGenerateWorkout, isPending: isPendingGenerateWorkout } = useMutation({
    mutationFn: generateWorkoutService,
    onSuccess: (data, variables) => {
      // const { input } = variables.formData;
      console.log('datas-uccess', data);
      const workoutPlan = data?.data;

      setWorkoutPlan(workoutPlan);
      setResponseError('');
    },
    onError: (error: string) => {
      console.log('error', error);
      setResponseError(error);
    },
  });

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        // flatListRef.current?.scrollToEnd({ animated: true });
        const offset = Math.max(0, responses.length - 1) * 100;
        console.log('scrollToBottom', offset);
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      });
    });
  }, []);

  useEffect(() => {
    Keyboard.dismiss(); // Ensure keyboard is dismissed before scrolling
    setTimeout(scrollToBottom, 200); // Small delay for rendering
  }, [currentQuestionIndex, workoutPlan, showSummary, responses]);

  const handleAnswer = (answer: string | string[]) => {
    console.log('handleAnswer', answer);
    const newResponses = [
      ...responses.filter(r => r.questionIndex !== currentQuestionIndex),
      { questionIndex: currentQuestionIndex, answer },
    ].sort((a, b) => a.questionIndex - b.questionIndex);

    setResponses(newResponses);

    if (questions[currentQuestionIndex].type !== 'multi-select') {
      handleContinue();
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
      prompt: 'Make me most fit person on earth in 5 days',
    });
  };

  const saveWorkout = async () => {
    alert('Workout plan will be saved very soon!');
    toggleModal();
  };

  const renderChatMessage = ({ item }: { item: UserResponse }) => (
    <>
      <ChatMessage isBot={true}>{questions[item.questionIndex].question}</ChatMessage>
      <ChatMessage isBot={false}>
        {Array.isArray(item.answer) ? item.answer.join(', ') : item.answer}
      </ChatMessage>
    </>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <FlatList
          nestedScrollEnabled
          ref={flatListRef}
          data={responses}
          renderItem={renderChatMessage}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          onContentSizeChange={scrollToBottom}
          ListHeaderComponent={
            <ChatMessage isBot={true}>{STRING_DATA.BOT_DEFAULT_MESSAGE}</ChatMessage>
          }
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
            index,
          })}
          ListFooterComponent={
            <>
              {!workoutPlan && !showSummary && currentQuestionIndex < questions.length && (
                <>
                  <ChatMessage isBot={true}>
                    <TouchableOpacity style={{ paddingRight: 8 }} onPress={goBack}>
                      <AntDesign name="arrowleft" size={10} color={'#fff'} />
                    </TouchableOpacity>
                    <Text style={styles.senderText}>
                      {questions[currentQuestionIndex].question}
                    </Text>
                  </ChatMessage>
                  <QuestionInput
                    question={questions[currentQuestionIndex]}
                    value={getCurrentResponse()}
                    onChange={handleAnswer}
                    onSubmit={handleContinue}
                  />
                </>
              )}

              {showSummary && !workoutPlan && (
                <ChatMessage isBot={true} wrapChildren={true}>
                  <Text style={styles.summaryTitle}>✅ Summary of Your Responses</Text>
                  {responses.map((response, index) => (
                    <View style={styles.responseContainer} key={index}>
                      <Text style={styles.responseQuestion} numberOfLines={2} ellipsizeMode="tail">
                        {questions[response.questionIndex].question}
                      </Text>
                      <Text style={styles.responseAnswer} numberOfLines={3} ellipsizeMode="tail">
                        {Array.isArray(response.answer)
                          ? response.answer.join(', ')
                          : response.answer}
                      </Text>
                    </View>
                  ))}
                  <Text style={styles.reviewText}>{STRING_DATA.BOT_REVIEW_MESSAGE}</Text>
                </ChatMessage>
              )}

              {workoutPlan && <WorkoutPlanView plan={workoutPlan} onSave={saveWorkout} />}
            </>
          }
        />

        {!workoutPlan && showSummary && (
          <ActionButton
            label={
              isPendingGenerateWorkout ? 'Generating your workout plan...' : 'Generate Workout Plan'
            }
            onPress={generateWorkout}
            disabled={isPendingGenerateWorkout}
            isLoading={isPendingGenerateWorkout}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

export default InitializeChatBot;

const styles = StyleSheet.create({
  senderText: {
    color: '#bbb',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  responseContainer: {
    flexDirection: 'column',
    marginBottom: 10,
    alignSelf: 'stretch',
  },
  responseQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
  },
  responseAnswer: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
  },
});
