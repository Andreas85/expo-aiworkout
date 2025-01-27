import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useSyncDataStore } from '@/store/useSyncDataStore';
import { clearStorageUnSyncData, syncWorkoutData } from '@/utils/SyncDataHelper';
import TextContainer from '../atoms/TextContainer';
import Container from '../atoms/Container';
import { ActionButton } from '../atoms/ActionButton';
import SyncDataPercentageCircle from '../atoms/SyncDataPercentageCircle';

interface IDisplaySyncModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete: () => void; // Callback when timer finishes
}

const DisplaySyncModal = (props: IDisplaySyncModalProps) => {
  const { isVisible, toggleModal } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const progressMessage = useSyncDataStore(state => state.progressMessage);
  const isSyncing = useSyncDataStore(state => state.isSyncing);
  const completed = useSyncDataStore(state => state.completed);
  const total = useSyncDataStore(state => state.total);
  const syncStatus = useSyncDataStore(state => state.syncStatus);
  const handleClickNo = () => {
    clearStorageUnSyncData();
    toggleModal();
  };

  const handleClickYes = () => {
    // setStartSyncingData(true);
    syncWorkoutData();
  };

  useEffect(() => {
    if (syncStatus === 'complete') {
      console.log('sync complete');
      toggleModal();
    }
  }, [syncStatus]);

  // check if user allows confirmation yes or no then call this method  syncWorkoutData(); also add a meaning full message
  const renderContainer = () => {
    if (isSyncing) {
      return (
        <>
          {/* Circular Progress Indicator */}
          <SyncDataPercentageCircle total={total} completed={completed} />

          <Text style={styles.nextText}>
            {progressMessage || 'Syncing your data... Please wait.'}
          </Text>
        </>
      );
    }
    return (
      <>
        <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
          <TextContainer
            style={tailwind('text-center text-sm')}
            data={
              'We found some saved workouts and exercises from when you weren’t logged in. Would you like to add them to your account or skip this step?'
            }
          />

          <Container style={tailwind('flex flex-row items-center justify-center gap-2')}>
            <ActionButton
              label={'No'}
              onPress={handleClickNo}
              isOutline={true}
              style={tailwind(' rounded-md')}
            />
            <ActionButton
              uppercase={true}
              label={'Yes'}
              onPress={handleClickYes}
              style={tailwind(' rounded-md')}
            />
          </Container>
        </Container>
      </>
    );
  };

  // const confirmSync = () => {
  //   Alert.alert(
  //     'Sync Data',
  //     'Are you sure you want to sync your workout data?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Yes', onPress: () => {} },
  //     ],
  //     { cancelable: true },
  //   );
  // };

  // useEffect(() => {
  //   if (isVisible) {
  //     confirmSync();
  //   }
  // }, [isVisible]);

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View
        style={Platform.select({
          web: tailwind(
            `items-center rounded-lg bg-NAVBAR_BACKGROUND p-4 ${isLargeScreen ? '' : 'mx-auto w-[35rem]'}`,
          ),
          native: tailwind(`items-center rounded-lg bg-NAVBAR_BACKGROUND p-4`),
        })}>
        {renderContainer()}
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
