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
  useWindowDimensions,
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
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { WorkoutHistoryView } from './WorkoutHistoryView';

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const { height } = useWindowDimensions();
  const isKeyboardVisible = useKeyboardVisibility();

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
    workoutPlanHistoryList,
    isWorkoutApproved,
    showFeedback,
    handleFeedback,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
  } = useChatBot(toggleModal, scrollToBottom);

  const isGenerateWorkoutbuttonPlanVisible = !workoutPlan && currentQuestionId === 'end';

  // const getDynamicHeight = () => {
  // return isExtraSmallDevice
  //   ? height * 0.9 - (isGenerateWorkoutbuttonPlanVisible ? 100 : 50)
  //   : height * 0.9 - 50;
  // };

  const getDynamicHeight = () => {
    if (isKeyboardVisible) {
      return isExtraSmallDevice
        ? height * 0.5 // Reduce height further for extra small devices
        : height * 0.75; // Adjust for other devices
    }
    return isExtraSmallDevice
      ? height * 0.9 - (isGenerateWorkoutbuttonPlanVisible ? 100 : 50)
      : height * 0.9 - 50;
  };
  const scrollHeightStyle = useCallback(() => {
    return {
      height: getDynamicHeight(),
    };
  }, [isKeyboardVisible, isGenerateWorkoutbuttonPlanVisible, isExtraSmallDevice, height]);

  useEffect(() => {
    if (isKeyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200); // Slight delay ensures proper scrolling
    }
  }, [isKeyboardVisible]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // keyboardVerticalOffset={0}
          style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={[
              isKeyboardVisible && isExtraSmallDevice ? { height: 200 } : scrollHeightStyle(),
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}>
            <>
              <ChatMessage isBot={true}>{STRING_DATA.BOT_DEFAULT_MESSAGE} </ChatMessage>
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
                <TouchableOpacity activeOpacity={1} style={tailwind('flex-1')}>
                  <ChatMessage isBot={true}>
                    {responses.length > 0 && (
                      <TouchableOpacity style={{ paddingRight: 8 }} onPress={goBack}>
                        <AntDesign name="arrowleft" size={10} color={'#fff'} />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.senderText}>{questions[currentQuestionId].question} </Text>
                  </ChatMessage>

                  <QuestionInput
                    question={questions[currentQuestionId]}
                    value={getCurrentResponse()}
                    onChange={handleAnswerClick}
                    onSubmit={handleContinue}
                  />
                </TouchableOpacity>
              )}

              {workoutPlanHistoryList?.length > 0 && (
                <TouchableOpacity activeOpacity={1}>
                  <WorkoutHistoryView
                    workoutHistory={workoutPlanHistoryList}
                    toggleModal={toggleModal}
                    showSaveButton={isWorkoutApproved}
                    handleFeedback={handleFeedback}
                    isPendingGenerateWorkout={isPendingGenerateWorkout}
                  />
                </TouchableOpacity>
              )}
            </>
          </ScrollView>
          {!workoutPlan && currentQuestionId === 'end' && workoutPlanHistoryList?.length === 0 && (
            <TouchableOpacity activeOpacity={1}>
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
            </TouchableOpacity>
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
