import { Platform, Pressable, Text } from 'react-native';
import React, { memo } from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import TextContainer from './TextContainer';
import { router } from 'expo-router';
import WorkoutStatus from './WorkoutStatus';
import { WorkoutSessionResponseData } from '@/services/interfaces';
import { formatDateTime } from '@/utils/helper';

const WorkoutSessionShortVersionCard = (props: {
  item: WorkoutSessionResponseData;
  isEnabled?: boolean;
}) => {
  const { item } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const handleCardClick = (item: any) => {
    router.push(`/workout-session/${item?._id}/info` as any);
  };
  return (
    <Pressable
      style={[
        Platform.select({
          web: tailwind('flex-1 flex-col'),
          native: tailwind('mb-2 min-h-20 flex-col'),
        }),
      ]}
      onPress={() => handleCardClick(item)}
      key={item._id}>
      <Container
        style={Platform.select({
          web: tailwind('w-full flex-col gap-2 rounded-lg bg-NAVBAR_BACKGROUND p-2'),
          native: tailwind('flex-1 flex-col gap-2 rounded-lg bg-NAVBAR_BACKGROUND p-2'),
        })}>
        <Container
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'flex-row items-center justify-between' : 'flex-col items-start gap-2 '}  rounded-lg `,
              ),
              native: tailwind(
                ` flex-row items-center justify-between rounded-lg bg-NAVBAR_BACKGROUND  `,
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
        <TextContainer
          data={formatDateTime(item?.createdAt ?? '')}
          numberOfLines={2}
          style={Platform.select({
            web: tailwind('text-sm'),
            native: tailwind('flex-1 text-sm'),
          })}
        />
      </Container>
    </Pressable>
  );
};

export default memo(WorkoutSessionShortVersionCard);
