import { Platform, Pressable, View } from 'react-native';
import React from 'react';
import Container from './Container';
import ImageContainer from './ImageContainer';
import { tailwind } from '@/utils/tailwind';
import { IMAGES } from '@/utils/images';
import { router } from 'expo-router';
import WorkoutStatus from './WorkoutStatus';
import TextContainer from './TextContainer';
import { WorkoutSessionResponseData } from '@/services/interfaces';

const WorkoutSessionCard = (props: { item: WorkoutSessionResponseData; isEnabled?: boolean }) => {
  const { item, isEnabled } = props;
  const handleCardClick = (item: WorkoutSessionResponseData) => {
    router.push(`/workout-session/${item?._id}/info` as any);
  };
  return (
    <Pressable
      style={[
        Platform.select({
          web: tailwind('flex-1'),
          native: tailwind('mb-2 flex-1'),
        }),
      ]}
      onPress={() => handleCardClick(item)}
      key={item._id}>
      <Container
        style={[
          Platform.select({
            web: tailwind(
              `relative h-full w-full flex-1 grow cursor-pointer self-center ${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''}`,
            ),
            native: tailwind(
              `${isEnabled ? 'rounded-lg bg-NAVBAR_BACKGROUND' : ''} h-full flex-1 grow`,
            ),
          }),
        ]}>
        {/* Image Container with Status Overlay */}
        <View style={tailwind('relative aspect-square')}>
          <ImageContainer
            source={IMAGES.fitness}
            styleNative={tailwind('h-full w-full self-center rounded-2xl')}
            contentFit="fill"
          />
          <View style={tailwind('absolute bottom-2 left-2 z-40')}>
            <WorkoutStatus itemStatus={item?.status?.toUpperCase() as 'FINISHED' | 'PENDING'} />
          </View>
        </View>

        {/* Workout Details */}
        <Container style={tailwind('mt-2')}>
          <TextContainer
            data={item?.name || item?.workout?.name || 'Workout Name'}
            style={[
              tailwind('text-center text-base font-semibold'),
              Platform.select({
                web: tailwind('text-lg'),
                native: tailwind('text-base'),
              }),
            ]}
          />
        </Container>
      </Container>
    </Pressable>
  );
};

export default WorkoutSessionCard;
