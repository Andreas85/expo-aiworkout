import React, { memo, useCallback } from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import NoDataSvg from '../svgs/NoDataSvg';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { FlatList, Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import WorkoutSessionExerciseInfoCard from './WorkoutSessionExerciseInfoCard';

export default function RenderWorkoutSessionDetailExercises() {
  const { isLargeScreen } = useWebBreakPoints();
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const hasExerciseWorkoutSession = useWorkoutSessionStore(state => state.hasExercises);
  const MemoizedWorkoutSessionInfoExerciseCard = memo(WorkoutSessionExerciseInfoCard);
  const renderListItem = useCallback(({ item, index }: { item: any; index: number }) => {
    return <MemoizedWorkoutSessionInfoExerciseCard key={item?._id} item={item} />;
  }, []);

  const renderContainer = () => {
    if (!hasExerciseWorkoutSession) {
      return (
        <Container style={tailwind('flex-1')}>
          <NoDataSvg label="No exercises" message={'Start building your workout'} />
        </Container>
      );
    }
    return (
      <FlatList
        data={workoutSessionDetails?.exercises}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item?._id?.toString() + index.toString()}
        renderItem={renderListItem}
        contentContainerStyle={[
          Platform.select({
            web: tailwind(
              ` ${isLargeScreen ? 'gap-[0.5rem]' : 'gap-[0.25rem] '} overflow-y-scroll `,
            ),
            native: tailwind(` gap-y-4  pb-20 pt-0 `),
          }),
        ]}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
      />
    );
  };

  return <>{renderContainer()}</>;
}
