import { Platform, Pressable } from 'react-native';
import React, { memo } from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import TextContainer from './TextContainer';
import { router } from 'expo-router';
import WorkoutStatus from './WorkoutStatus';
import { WorkoutSessionResponseData } from '@/services/interfaces';

const WorkoutSessionShortVersionCard = (props: {
  item: WorkoutSessionResponseData;
  isEnabled?: boolean;
}) => {
  const { item } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const handleCardClick = (item: any) => {
    router.push(`/workout-session/${item?._id}/detail` as any);
  };
  return (
    <Pressable
      style={[
        Platform.select({
          web: tailwind('flex-1'),
          native: tailwind('mb-2'),
        }),
      ]}
      onPress={() => handleCardClick(item)}
      key={item._id}>
      <Container
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'flex-row items-center justify-between p-2' : 'flex-col items-start gap-2 p-4'}  rounded-lg bg-NAVBAR_BACKGROUND `,
            ),
            native: tailwind(
              ` flex-row items-center justify-between rounded-lg bg-NAVBAR_BACKGROUND  p-2`,
            ),
          }),
        ]}>
        <TextContainer
          data={item?.name || item?.workout?.name || 'Workout Name'}
          numberOfLines={2}
          style={Platform.select({
            web: tailwind('text-lg'),
            native: tailwind('flex-1 text-base'),
          })}
        />
        <WorkoutStatus itemStatus={item?.status?.toUpperCase() as 'FINISHED' | 'PENDING'} />
      </Container>
    </Pressable>
  );
};

export default memo(WorkoutSessionShortVersionCard);
