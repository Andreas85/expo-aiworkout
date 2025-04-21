import { Platform } from 'react-native';
import React from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import TextContainer from './TextContainer';
import AppTextSingleInput from './AppTextSingleInput';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

interface IWorkoutInput {
  workoutInputLabel: string;
  workoutInputInitialValue: any;
  disableAppTextInput?: boolean;
  onChangeText?: (text: string) => void;
}

const WorkoutInput = (props: IWorkoutInput) => {
  const { workoutInputInitialValue, disableAppTextInput, workoutInputLabel, onChangeText } = props;
  const { isMobileDeviceOnly } = useWebBreakPoints();
  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(`flex-col gap-3 ${isMobileDeviceOnly && 'flex-1'}`),
          native: tailwind(`flex-1 flex-col gap-3`),
        }),
      ]}>
      <TextContainer
        data={workoutInputLabel}
        style={[
          Platform.select({
            web: tailwind(' text-center text-xs'),
            native: tailwind('text-2.5 text-center'),
          }),
        ]}
        numberOfLines={1}
      />
      <AppTextSingleInput
        initialValues={workoutInputInitialValue}
        placeholder=""
        fieldName={'weight'}
        disableAppTextInput={disableAppTextInput}
        onChangeText={onChangeText}
        containerStyle={[
          Platform.select({
            web: tailwind('w-full self-center border-none'),
            native: tailwind(' self-center border-none '),
          }),
        ]}
        containerStyleAppTextInput={Platform.select({
          web: tailwind(`${isMobileDeviceOnly && 'w-auto'} `),
          native: tailwind(`w-auto  `),
        })}
        keyboardType="number-pad"
        autoCapitalize="none"
        placeholderTextColor="#999"
        testInputStyle={[
          Platform.select({
            web: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
            native: tailwind('h-[1.875rem]  px-0 py-[0.3125rem]'),
          }),
        ]}
      />
    </Container>
  );
};

export default WorkoutInput;
