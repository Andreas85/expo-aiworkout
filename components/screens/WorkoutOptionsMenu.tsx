import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';
import AIImageButton from '../atoms/AIImageButton';
import Modal from 'react-native-modal';
import { ActionButton } from '../atoms/ActionButton';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { tailwind } from '@/utils/tailwind';
import Colors from '@/constants/Colors';
import StarsIcon from '../atoms/AiStarsIcon';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

interface ExerciseOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  handleEditGeneratedWorkoutClick: () => void;
  showEditWorkout: () => void;
  showModalUpdateImage: () => void;
}

const WorkoutOptionsMenu = ({
  visible,
  onClose,
  handleEditGeneratedWorkoutClick,
  showEditWorkout,
  showModalUpdateImage,
}: ExerciseOptionsMenuProps) => {
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);

  const handleEditWorkoutClick = () => {
    onClose();
    showEditWorkout();
  };

  const handleRegenerateWorkoutClick = () => {
    onClose();
    handleEditGeneratedWorkoutClick();
  };

  const handleUpdateImageClick = () => {
    onClose();
    showModalUpdateImage();
  };

  return (
    <Modal
      isVisible={visible}
      backdropColor="white"
      onBackdropPress={onClose}
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.menuContainer}>
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.menuTitle}>More Options</Text>
            <TouchableOpacity style={[styles.menuItem]}>
              <ActionButton
                label={'Regenerate Workout'}
                onPress={handleRegenerateWorkoutClick}
                style={[
                  Platform.select({
                    web: tailwind('w-full rounded-xl px-3'),
                    native: tailwind('rounded-xl px-3'),
                  }),
                ]}
                left={<StarsIcon brandColor={Colors.white} />}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem]}>
              <ActionButton
                onPress={handleUpdateImageClick}
                left={<Feather name="image" size={18} color="#FFFFFF" />}
                label={workoutDetail?.image ? 'Update Image ' : 'Add Image'}
                style={[
                  Platform.select({
                    web: tailwind('rounded-xl px-3'),
                    native: tailwind('rounded-xl px-3'),
                  }),
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem]}
              onPress={() => {
                onClose();
                // onDelete();
              }}>
              <ActionButton
                label={'Edit Workout'}
                onPress={handleEditWorkoutClick}
                style={[
                  Platform.select({
                    web: tailwind('w-full flex-1 rounded-xl px-3'),
                    native: tailwind('rounded-xl px-3'),
                  }),
                ]}
                left={<AntDesign name="pluscircleo" size={20} color="white" />}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    width: '80%',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 16,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  menuItem: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 14,
    // borderRadius: 8,
    // marginBottom: 8,
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
    // gap: 12,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteItem: {
    backgroundColor: 'rgba(255, 85, 85, 0.15)',
  },
  deleteText: {
    color: '#FF5555',
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 16,
    right: 10,
  },
});

export default WorkoutOptionsMenu;
