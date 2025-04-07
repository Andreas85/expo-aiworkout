import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

interface ModalFooterProps {
  onCancel: () => void;
  onFinish: () => void;
  finishDisabled?: boolean;
}

export default function ModalFooter({ onCancel, onFinish, finishDisabled }: ModalFooterProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={onCancel}
        style={[
          styles.button,
          styles.cancelButton,
          Platform.select({
            web: { cursor: 'pointer' },
          }),
        ]}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onFinish}
        disabled={finishDisabled}
        style={[
          styles.button,
          styles.finishButton,
          finishDisabled && styles.finishButtonDisabled,
          Platform.select({
            web: { cursor: 'pointer' },
          }),
        ]}>
        <Text style={[styles.finishButtonText, finishDisabled && styles.finishButtonTextDisabled]}>
          Finish
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#404040',
    backgroundColor: '#252425',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#404040',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButton: {
    backgroundColor: '#8B5CF6',
  },
  finishButtonDisabled: {
    opacity: 0.5,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finishButtonTextDisabled: {
    opacity: 0.7,
  },
});
