import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { ActionButton } from '../atoms/ActionButton';
import Container from '../atoms/Container';

interface IWorkoutComplete {
  isVisible: boolean;
  toggleModal: () => void;

  handleClick: () => void; // Callback when timer finishes
}

const WorkoutComplete = (props: IWorkoutComplete) => {
  const { isVisible, handleClick } = props;
  const { isLargeScreen } = useWebBreakPoints();

  const renderLabel = () => {
    if (isLargeScreen) {
      return (
        <Container style={tailwind('flex-col items-center justify-center gap-2')}>
          <Text
            style={[
              Platform.select({
                web: tailwind(`flex-1 text-[0.875rem]  font-bold text-white `),
                native: tailwind(`text-[0.875rem]  font-bold text-white  `),
              }),
            ]}>
            Workout Complete!
          </Text>
          <Text
            style={[
              Platform.select({
                web: tailwind(`flex-1 text-[0.875rem] font-bold  text-white `),
                native: tailwind(`text-[0.875rem]  font-bold text-white  `),
              }),
            ]}>
            Great Job, Keep it up
          </Text>
        </Container>
      );
    }
    return (
      <Text
        style={[
          Platform.select({
            web: tailwind(`flex-1 text-[1.25rem] not-italic text-white `),
          }),
        ]}>
        Workout Complete ! Great Job, Keep it up
      </Text>
    );
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View
        style={Platform.select({
          web: tailwind(
            `items-center rounded-lg bg-NAVBAR_BACKGROUND p-4 ${isLargeScreen ? 'gap-4' : 'px-10;  mx-auto inline-flex w-[551px] flex-col items-center gap-9 pb-10 pt-8'}`,
          ),
          native: tailwind(`flex-col gap-4  rounded-lg bg-NAVBAR_BACKGROUND p-4`),
        })}>
        {renderLabel()}

        <ActionButton
          label="OK"
          uppercase
          onPress={handleClick}
          style={[
            Platform.select({
              web: tailwind(
                `mx-auto ${isLargeScreen ? 'w-[8.75rem]' : 'w-[14.75rem]'} cursor-pointer rounded-lg`,
              ),
              native: tailwind(`w-[14.75rem] cursor-pointer self-center rounded-lg`),
            }),
          ]}
        />
      </View>
    </Modal>
  );
};

export default WorkoutComplete;

const styles = StyleSheet.create({
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
