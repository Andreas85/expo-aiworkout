import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useSyncDataStore } from '@/store/useSyncDataStore';

interface IDisplaySyncModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete: () => void; // Callback when timer finishes
}

const DisplaySyncModal = (props: IDisplaySyncModalProps) => {
  const { isVisible } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const progressMessage = useSyncDataStore(state => state.progressMessage);

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View
        style={Platform.select({
          web: tailwind(
            `items-center rounded-lg bg-NAVBAR_BACKGROUND p-4 ${isLargeScreen ? '' : 'mx-auto w-[55rem]'}`,
          ),
          native: tailwind(`items-center rounded-lg bg-NAVBAR_BACKGROUND p-4`),
        })}>
        {/* Circular Progress Indicator */}

        <Text style={styles.nextText}>{progressMessage}</Text>
      </View>
    </Modal>
  );
};

export default DisplaySyncModal;

const styles = StyleSheet.create({
  muteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  muteIconText: {
    fontSize: 24,
    color: '#fff',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
