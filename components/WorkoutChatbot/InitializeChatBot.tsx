import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatMessage } from './ChatMessage';
import { QuestionInput } from './QuestionInput';
import { questions } from './questions';
import { WorkoutPlanView } from './WorkoutPlan';
import { STRING_DATA } from '@/utils/appConstants';
import { AntDesign } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import { useChatBot } from '@/hooks/useChatBot';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';

import { WorkoutFeedbackView } from './WorkoutFeedback';
import useBreakPoints from '@/hooks/useBreakPoints';

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;

  const scrollViewRef = useRef<ScrollView>(null);
  const { isExtraSmallDevice } = useBreakPoints();

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleAnswerClick = (answer: string | string[]) => {
    handleAnswer(answer);
  };

  const {
    currentQuestionId,
    responses,
    workoutPlan,
    showSummary,
    isPendingGenerateWorkout,
    responseError,

    isWorkoutApproved,
    showFeedback,
    handleFeedback,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    saveWorkout,
  } = useChatBot(toggleModal, scrollToBottom);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={{
              height: isExtraSmallDevice ? 350 : 400,
            }}
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}>
            <>
              <ChatMessage isBot={true}>{STRING_DATA.BOT_DEFAULT_MESSAGE}</ChatMessage>
              {responses.map((item, index) => {
                return (
                  <TouchableOpacity key={index} activeOpacity={1}>
                    <ChatMessage isBot={true}>{questions[item.questionId].question}</ChatMessage>

                    <ChatMessage isBot={false}>
                      {Array.isArray(item.answer) ? item.answer.join(', ') : item.answer}
                    </ChatMessage>
                  </TouchableOpacity>
                );
              })}

              {!workoutPlan && currentQuestionId !== 'end' && (
                <TouchableOpacity activeOpacity={1}>
                  <ChatMessage isBot={true}>
                    {responses.length > 0 && (
                      <TouchableOpacity style={{ paddingRight: 8 }} onPress={goBack}>
                        <AntDesign name="arrowleft" size={10} color={'#fff'} />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.senderText}>{questions[currentQuestionId].question}</Text>
                  </ChatMessage>
                  <QuestionInput
                    question={questions[currentQuestionId]}
                    value={getCurrentResponse()}
                    onChange={handleAnswerClick}
                    onSubmit={handleContinue}
                  />
                </TouchableOpacity>
              )}

              {workoutPlan && (
                <TouchableOpacity activeOpacity={1}>
                  <ChatMessage isBot={true} wrapChildren={true}>
                    <WorkoutPlanView
                      plan={workoutPlan}
                      onSave={saveWorkout}
                      showSaveButton={isWorkoutApproved}
                    />
                  </ChatMessage>

                  {showFeedback && !isWorkoutApproved && (
                    <ChatMessage isBot={true} wrapChildren={true}>
                      <WorkoutFeedbackView onSubmit={handleFeedback} />
                    </ChatMessage>
                  )}
                </TouchableOpacity>
              )}
            </>
          </ScrollView>

          {!workoutPlan && currentQuestionId === 'end' && (
            <>
              {responseError && (
                <TextContainer
                  style={tailwind('text-3 text-center text-red-400')}
                  className="text-center text-sm !text-red-400"
                  data={responseError}
                />
              )}
              <ActionButton
                label={
                  isPendingGenerateWorkout
                    ? 'Generating your workout plan...'
                    : 'Generate Workout Plan'
                }
                onPress={generateWorkout}
                style={tailwind('rounded-lg')}
                disabled={isPendingGenerateWorkout}
                isLoading={isPendingGenerateWorkout}
              />
            </>
          )}
        </KeyboardAvoidingView>
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
