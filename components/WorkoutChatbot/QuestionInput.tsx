import { Question } from '@/types';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

import { ActionButton } from '../atoms/ActionButton';
import { tailwind } from '@/utils/tailwind';

interface QuestionInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onSubmit: (value: string | string[]) => void;
}

export function QuestionInput({ question, value, onChange, onSubmit }: QuestionInputProps) {
  const [inputValue, setInputValue] = useState(typeof value === 'string' ? value : '');

  const [tempValue, setTempValue] = useState<string | string[]>(value);

  const handleSelectOption = (option: string) => {
    if (question.type === 'text') {
      console.log('type', option);
      // onChange(option);
    } else {
      onChange(option);
      // onSubmit(option);
    }
  };

  const handleMultiSelectOption = (optionLabel: string) => {
    const currentValue = Array.isArray(tempValue) ? tempValue : [];
    console.log('currentValue', { currentValue, optionLabel, inputValue });
    const newValue = currentValue.includes(optionLabel)
      ? currentValue.filter(v => v !== optionLabel)
      : [...currentValue, optionLabel];
    setTempValue(newValue);
  };

  const handleTextChange = (text: string) => {
    console.log('text', text);
    setInputValue(text);
  };

  const handleSubmit = () => {
    // onChange(inputValue);
    onSubmit(inputValue);
  };

  const onMultiSelectSubmit = () => {
    onChange(tempValue);
    onSubmit(tempValue);
  };

  useEffect(() => {
    setTempValue(value);
  }, [question]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.questionText}>{question.question}</Text> */}

      {/* Single & Multi-Select */}
      {question.type === 'single-select' &&
        question.options?.map(option => {
          const isSelected = Array.isArray(value)
            ? value.includes(option.label)
            : value === option.label;

          return (
            <Pressable
              key={option.label}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleSelectOption(option.label)}>
              <Text style={styles.optionText}>{option.label}</Text>
            </Pressable>
          );
        })}

      {/* Yes-No Selection */}
      {question.type === 'yes-no' &&
        ['Yes', 'No'].map(option => {
          const isSelected = value === option;
          return (
            <Pressable
              key={option}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleSelectOption(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}

      {/* Text Input */}
      {question.type === 'text' && (
        <>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={typeof value === 'string' ? inputValue : ''}
              onChangeText={text => handleTextChange(text)}
              placeholder="Type your answer..."
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4} // Ensure enough lines for visibility
              textAlignVertical="top"
            />
          </View>

          <ActionButton
            label={'Continue'}
            onPress={handleSubmit}
            disabled={!inputValue}
            type="submit"
            style={tailwind('rounded-lg')}
          />
        </>
      )}

      {/* Submit Button for Multi-Select */}
      {question.type === 'multi-select' && (
        <>
          {question.options?.map(option => {
            return (
              <Pressable
                key={option.label}
                style={[
                  styles.optionButton,
                  Array.isArray(tempValue) &&
                    tempValue.includes(option.label) &&
                    styles.selectedOption,
                ]}
                onPress={() => handleMultiSelectOption(option.label)}>
                <Text style={styles.optionText}>{option.label}</Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.submitButton} onPress={() => onMultiSelectSubmit()}>
            <Text style={styles.submitText}>Continue</Text>
          </Pressable>
        </>
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
