import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
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

function InitializeChatBot() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockWorkout: WorkoutPlan = {
      exercises: [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Squats', sets: 4, reps: '10-12', rest: '90 sec' },
        { name: 'Plank', sets: 3, reps: '45 sec', rest: '45 sec' },
      ],
      frequency: '3-4 times per week',
      duration: '45 minutes',
      notes:
        'Start with a 5-minute warm-up. Focus on form over speed. Cool down with light stretching.',
    };

    setWorkoutPlan(mockWorkout);
    setIsGenerating(false);
  };

  const saveWorkout = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Workout plan saved successfully!');
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
            label={isGenerating ? 'Generating your workout plan...' : 'Generate Workout Plan'}
            onPress={generateWorkout}
            disabled={isGenerating}
            isLoading={isGenerating}
          />
        )}

        {isGenerating && <ActivityIndicator size="large" color="#6b46c1" />}
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
