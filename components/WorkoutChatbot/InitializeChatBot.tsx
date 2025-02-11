import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
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

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };
  const {
    currentQuestionIndex,
    responses,
    workoutPlan,
    showSummary,
    isPendingGenerateWorkout,
    responseError,
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
        <ScrollView
          ref={scrollViewRef}
          style={{ height: 400 }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
          <ChatMessage isBot={true}>{STRING_DATA.BOT_DEFAULT_MESSAGE}</ChatMessage>
          {responses.map((item, index) => (
            <React.Fragment key={index}>
              <ChatMessage isBot={true}>{questions[item.questionIndex].question}</ChatMessage>
              <ChatMessage isBot={false}>
                {Array.isArray(item.answer) ? item.answer.join(', ') : item.answer}
              </ChatMessage>
            </React.Fragment>
          ))}

          {!workoutPlan && !showSummary && currentQuestionIndex < questions.length && (
            <>
              <ChatMessage isBot={true}>
                <TouchableOpacity style={{ paddingRight: 8 }} onPress={goBack}>
                  <AntDesign name="arrowleft" size={10} color={'#fff'} />
                </TouchableOpacity>
                <Text style={styles.senderText}>{questions[currentQuestionIndex].question}</Text>
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
                    {Array.isArray(response.answer) ? response.answer.join(', ') : response.answer}
                  </Text>
                </View>
              ))}
              <Text style={styles.reviewText}>{STRING_DATA.BOT_REVIEW_MESSAGE}</Text>
            </ChatMessage>
          )}

          {workoutPlan && <WorkoutPlanView plan={workoutPlan} onSave={saveWorkout} />}
        </ScrollView>

        {!workoutPlan && showSummary && (
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
              disabled={isPendingGenerateWorkout}
              isLoading={isPendingGenerateWorkout}
            />
          </>
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
