import { Platform } from 'react-native';
import React from 'react';
import Container from './Container';
import BackActionButton from './BackActionButton';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import LabelContainer from './LabelContainer';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { tailwind } from '@/utils/tailwind';
import CustomSwitch from './CustomSwitch';
import { ICON_SIZE } from '@/utils/appConstants';
import { useAuthStore } from '@/store/authStore';

export default function RenderWorkoutDetailController(props: {
  showModalDeleteModal: () => void;
  showModal: () => void;
  showModalCreateWorkoutCopy: () => void;
  isCurrentWorkoutPublic: boolean;
  toggleIsCurrentWorkoutPublic: () => void;
}) {
  const {
    showModal,
    showModalCreateWorkoutCopy,
    showModalDeleteModal,
    isCurrentWorkoutPublic,
    toggleIsCurrentWorkoutPublic,
  } = props;
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { isLargeScreen } = useWebBreakPoints();

  return (
    <Container
      style={[
        Platform.select({
          web: tailwind('w-full flex-row flex-wrap items-center justify-between gap-4 '),
          native: tailwind('w-full flex-row flex-wrap  items-center justify-between gap-1 '),
        }),
      ]}>
      <Container
        style={[
          Platform.select({
            web: tailwind(` gap-4 ${isLargeScreen ? 'hidden ' : 'flex-row'} flex-1.5`),
            native: tailwind('hidden'),
          }),
        ]}>
        <BackActionButton />
        <LabelContainer
          label={workoutDetail?.name ?? ''}
          labelStyle={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'}   font-bold not-italic leading-[150%] text-white `,
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(`
                ${isLargeScreen ? 'hidden' : 'flex-1 justify-start text-xl font-bold'}  
              `),
              native: tailwind('hidden'),
            }),
          ]}
          onPress={showModal}
          left={<FontAwesome5 name="edit" color="#A27DE1" size={ICON_SIZE} />}
        />
      </Container>
      {/* {isAuthenticated && ( */}
      <CustomSwitch
        isEnabled={isCurrentWorkoutPublic}
        toggleSwitch={toggleIsCurrentWorkoutPublic}
        labelStyle={[
          Platform.select({
            web: tailwind(' text-center text-xl font-normal not-italic leading-[150%] text-white'),
            native: tailwind('text-sm font-bold'),
          }),
        ]}
        label={'Public'}
      />
      {/* )} */}
      <LabelContainer
        label={'Duplicate'}
        labelStyle={[
          Platform.select({
            web: tailwind(
              ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center  font-normal not-italic leading-[150%] text-white`,
            ),
            native: tailwind('text-sm font-bold'),
          }),
        ]}
        onPress={showModalCreateWorkoutCopy}
        containerStyle={[
          Platform.select({
            web: tailwind('flex-1 justify-end'),
            // native: tailwind('flex-1'),
          }),
        ]}
        left={
          <Ionicons
            name="duplicate-sharp"
            color="#A27DE1"
            size={Platform.OS === 'web' ? ICON_SIZE : 16}
          />
        }
      />
      <LabelContainer
        label={'Delete'}
        labelStyle={[
          Platform.select({
            web: tailwind(
              ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'}  text-center font-normal  not-italic leading-[150%] text-white`,
            ),
            native: tailwind('text-sm font-bold'),
          }),
        ]}
        containerStyle={[
          Platform.select({
            web: tailwind('flex-1 justify-end'),
            // native: tailwind('flex-1'),
          }),
        ]}
        onPress={showModalDeleteModal}
        left={
          <FontAwesome6
            name="trash-can"
            color="#A27DE1"
            size={Platform.OS === 'web' ? ICON_SIZE : 16}
          />
        }
      />
    </Container>
  );
}
