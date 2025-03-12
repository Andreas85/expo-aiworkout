import { WorkoutFeedback } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

interface WorkoutFeedbackProps {
  onSubmit: (feedback: WorkoutFeedback) => void;
}

export function WorkoutFeedbackView({ onSubmit }: WorkoutFeedbackProps) {
  const [feedback, setFeedback] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);

  const handleSubmit = () => {
    onSubmit({ rating: 'needs_changes', feedback });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How's this workout plan?</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => onSubmit({ rating: 'good' })}
          style={[styles.button, styles.goodButton]}>
          <FontAwesome name="thumbs-o-up" size={20} color="#166534" />
          <Text style={styles.goodText}>Looks Good!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowTextArea(true)}
          style={[styles.button, styles.neutralButton]}>
          <FontAwesome name="thumbs-o-down" size={20} color="#374151" />
          <Text style={styles.neutralText}>Needs Changes</Text>
        </TouchableOpacity>
      </View>

      {showTextArea && (
        <View style={styles.feedbackContainer}>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Please tell us what you'd like to change..."
            style={styles.textArea}
            multiline
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  goodButton: {
    backgroundColor: '#d1fae5',
  },
  goodText: {
    color: '#166534',
    fontWeight: '500',
  },
  neutralButton: {
    backgroundColor: '#e5e7eb',
  },
  neutralText: {
    color: '#374151',
    fontWeight: '500',
  },
  feedbackContainer: {
    marginTop: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '500',
  },
});
