import React, { useState } from 'react';
import { Platform } from 'react-native';
import ImageGenerationModal from './ImageGenerationModal';
import { Feather } from '@expo/vector-icons';
import { ActionButton } from './ActionButton';
import { tailwind } from '@/utils/tailwind';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

export default function AIImageButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);

  return (
    <>
      <ActionButton
        onPress={() => setModalVisible(true)}
        left={<Feather name="image" size={18} color="#FFFFFF" />}
        label={workoutDetail?.image ? 'Update Image ' : 'Add Image'}
        style={[
          Platform.select({
            web: tailwind('rounded-xl px-3'),
            native: tailwind('rounded-xl px-3'),
          }),
        ]}
      />

      {modalVisible && (
        <ImageGenerationModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          workoutName={workoutDetail?.name || ''}
        />
      )}
    </>
  );
}
