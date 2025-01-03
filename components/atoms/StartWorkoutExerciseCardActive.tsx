import { Platform } from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import Container from './Container';
import ImageContainer from './ImageContainer';
import { tailwind } from '@/utils/tailwind';
import ShowLabelValue from './ShowLabelValue';
import { ExerciseElement } from '@/services/interfaces';
import { IMAGES } from '@/utils/images';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import pauseable from 'pauseable';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

interface StartWorkoutExerciseCardActiveProps {
  item: ExerciseElement;
  isEnabled?: boolean;
  onDecrementHandler: () => void;
  onIncrementHandler: () => void;
  isExerciseTimeFinished: (
    exerciseDurationTaken: number,
    currentExerciseCompleted: boolean,
  ) => void;
  isRepsWorkoutFinished: (totalElapsedTime: number) => void;
}

const StartWorkoutExerciseCardActive = (props: StartWorkoutExerciseCardActiveProps) => {
  const { item, isEnabled, isExerciseTimeFinished, isRepsWorkoutFinished } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const timerRef = useRef<any>(null);
  const [totalElapsedTime, setTotalElapsedTime] = useState<number>(1);
  const elapsedTimeRef = useRef<number>(1); // Track the current value with a ref
  const isWorkoutTimerRunning =
    useWorkoutDetailStore(state => state.isWorkoutTimerRunning) ?? false;

  const exerciseDurationCompletedEvent = () => {
    isExerciseTimeFinished?.(elapsedTimeRef.current, true);
  };

  const repsWorkoutFinishedEvent = () => {
    isRepsWorkoutFinished?.(elapsedTimeRef.current);
  };
  const updateTimer = () => {
    const { duration, reps } = item ?? {};
    // console.log('Timer running:', {
    //   totalElapsedTime,
    //   duration,
    //   reps,
    //   refElapsed: elapsedTimeRef.current,
    // });

    if (elapsedTimeRef.current >= duration && !reps) {
      console.log('Duration reached without reps, triggering event');
      exerciseDurationCompletedEvent();
      return;
    }

    if (reps && elapsedTimeRef.current >= duration) {
      console.log('Reps workout completed, triggering event');
      exerciseDurationCompletedEvent();
      repsWorkoutFinishedEvent();
      return;
    }
    elapsedTimeRef.current += 1; // Update the ref value
    setTotalElapsedTime(elapsedTimeRef.current); // Trigger a re-render
  };

  useEffect(() => {
    if (!item) return;

    // console.log('Initializing timer for item:', item);

    timerRef.current = pauseable.setInterval(() => {
      if (isWorkoutTimerRunning) {
        updateTimer();
      }
    }, 1000);

    return () => {
      // console.log('Clearing timer');
      timerRef.current?.clear();
    };
  }, [item, isWorkoutTimerRunning]);

  return (
    <Container
      style={[
        Platform.select({
          web: [
            webStyles.container,
            tailwind('flex-1 flex-row gap-4 rounded-lg  bg-NAVBAR_BACKGROUND px-4 py-2'),
          ],
          // web: tailwind('flex-1 flex-row gap-4 rounded-lg  bg-NAVBAR_BACKGROUND px-4 py-2'),
          native: tailwind('flex-row gap-4 rounded-lg  bg-NAVBAR_BACKGROUND px-2  py-1'),
        }),
      ]}
      key={item._id}>
      {!isEnabled && (
        <ImageContainer
          source={IMAGES.dummyWorkout}
          styleNative={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'h-[4.875rem] w-[8.1875rem]' : 'h-[9.9375rem] w-[21.1875rem] shrink-0'} flex-1.5 aspect-video rounded-lg`,
              ),
              native: tailwind('aspect-video flex-1 self-center rounded-lg'),
            }),
          ]}
          contentFit="cover"
          contentPosition={'right top'}
        />
      )}
      <Container
        style={[
          Platform.select({
            web: isLargeScreen
              ? tailwind('flex-2 flex flex-col gap-[0.25rem]')
              : tailwind('flex-2 flex flex-col items-start gap-[1.25rem]'),
            native: tailwind('flex-2 '),
          }),
        ]}>
        <Container
          style={[
            Platform.select({
              web: tailwind(`flex-1 flex-row items-center ${isLargeScreen ? '' : ''}`),
              native: tailwind('flex-1 flex-row items-start'),
            }),
          ]}>
          <Text
            style={[
              Platform.select({
                web: tailwind(
                  styles.customLineClamp +
                    ' ' +
                    `${isLargeScreen ? 'line-clamp-1 text-[1rem]' : 'text-[1.625rem] font-bold not-italic'} font-inter`,
                ),
                native: tailwind('text-[1rem] font-extrabold'),
              }),
              {
                fontWeight: '700',
              },
            ]}
            numberOfLines={2}>
            {`${item?.exercise?.name || item?.name}${item?.weight ? ` (${item?.weight} kg)` : ''} ${totalElapsedTime}-active `}
          </Text>
        </Container>
        <Container
          style={[
            Platform.select({
              web: isLargeScreen ? styles.MOBILE.labelValue : styles.DESKTOP.labelValue,
              native: tailwind('flex-1 '),
            }),
          ]}>
          <ShowLabelValue label="No. of Reps" value={`${item?.reps ? item?.reps : '-'}`} />
          {/* {item?.reps ? <ShowLabelValue label="Duration" value={`${item?.duration}`} /> : null} */}
          <ShowLabelValue label="Duration" value={`${item?.duration}`} />
          <ShowLabelValue
            label="Rest"
            value={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
          />
        </Container>
      </Container>
    </Container>
  );
};

export default memo(StartWorkoutExerciseCardActive);

const styles = {
  MOBILE: {
    cardContainer: {
      display: 'flex',
      paddingVertical: '0.5rem',
      paddingHorizontal: '0.75rem',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'stretch',
      gap: '1rem',
    },
    cardDetails: {
      display: 'flex',
      flexDirection: 'column',
      // alignItems: 'flex-start',
      gap: '0.5rem',
    },
    labelValue: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.25rem',
      width: '100%',
    },
    image: {
      width: '339px',
      height: '159px',
      flexShrink: 0,
    },
  },
  DESKTOP: {
    cardContainer: {
      display: 'flex',
      width: '56rem',
      paddingLeft: '2rem',
      paddingVertical: '1.25rem',
      paddingRight: '6.5rem',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4.5rem',
    },
    cardDetails: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1.25rem',
    },
    labelValue: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '1rem',
      width: '100%',
    },
  },
  customLineClamp: {
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
  },
};

const webStyles = {
  container: {
    backgroundColor: '#252425',
    // height: '100%',
    boxShadow: '0px 12px 24px 4px rgba(95, 63, 102, 0.50)',
  },
};
