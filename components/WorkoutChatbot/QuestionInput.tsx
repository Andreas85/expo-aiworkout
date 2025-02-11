import { Question } from '@/types';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface QuestionInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onSubmit: () => void;
}

export function QuestionInput({ question, value, onChange, onSubmit }: QuestionInputProps) {
  const [inputValue, setInputValue] = useState(typeof value === 'string' ? value : '');

  const handleSelectOption = (option: string) => {
    if (question.type === 'multi-select') {
      const newValue = Array.isArray(value) ? [...value] : [];
      if (newValue.includes(option)) {
        onChange(newValue.filter(v => v !== option));
      } else {
        onChange([...newValue, option]);
      }
    } else if (question.type === 'text') {
      console.log('type', option);
      // onChange(option);
    } else {
      onChange(option);
      onSubmit();
    }
  };

  const handleTextChange = (text: string) => {
    console.log('text', text);
    setInputValue(text);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.questionText}>{question.question}</Text> */}

      {/* Single & Multi-Select */}
      {(question.type === 'single-select' || question.type === 'multi-select') &&
        question.options?.map(option => {
          const isSelected = Array.isArray(value)
            ? value.includes(option.label)
            : value === option.label;

          return (
            <TouchableOpacity
              key={option.label}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleSelectOption(option.label)}>
              <Text style={styles.optionText}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}

      {/* Yes-No Selection */}
      {question.type === 'yes-no' &&
        ['Yes', 'No'].map(option => {
          const isSelected = value === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleSelectOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}

      {/* Text Input */}
      {question.type === 'text' && (
        <>
          <TextInput
            style={styles.input}
            value={typeof value === 'string' ? inputValue : ''}
            onChangeText={text => handleTextChange(text)}
            placeholder="Type your answer..."
            placeholderTextColor="#aaa"
            multiline
          />
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Submit Button for Multi-Select */}
      {question.type === 'multi-select' && (
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  optionButton: {
    backgroundColor: '#2c2c3e',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#d8b4fe',
  },
  optionText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6b46c1',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
