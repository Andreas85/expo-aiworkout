import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import ImageGenerationModal from './ImageGenerationModal';
import { Feather } from '@expo/vector-icons';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

interface AIImageButtonProps {
  exerciseName: string;
}

export default function AIImageButton({ exerciseName }: AIImageButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          Platform.select({
            web: { cursor: 'pointer' },
          }),
        ]}
        onPress={() => setModalVisible(true)}>
        <Feather name="image" size={18} color="#FFFFFF" />
        <Text
          style={{
            ...styles.buttonText,
            fontSize: isLargeScreen ? 12 : 14, // Replace with appropriate numeric values
          }}>
          Add Image
        </Text>
      </TouchableOpacity>

      {modalVisible && (
        <ImageGenerationModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          exerciseName={exerciseName}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
