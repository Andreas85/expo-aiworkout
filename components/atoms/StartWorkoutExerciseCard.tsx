import { Platform } from 'react-native';
import React, { memo } from 'react';
import Container from './Container';
import ImageContainer from './ImageContainer';
import { tailwind } from '@/utils/tailwind';
import ShowLabelValue from './ShowLabelValue';
import { ExerciseElement } from '@/services/interfaces';
import { IMAGES } from '@/utils/images';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

interface StartWorkoutExerciseCardProps {
  item: ExerciseElement;
  isEnabled?: boolean;
  isRestCard?: boolean;
  onDecrementHandler: () => void;
  onIncrementHandler: () => void;
}

const StartWorkoutExerciseCard = (props: StartWorkoutExerciseCardProps) => {
  const { item, isEnabled, isRestCard } = props;
  const { isLargeScreen } = useWebBreakPoints();

  const renderExerciseImage = () => {
    if (!isRestCard) {
      return (
        <ImageContainer
          source={IMAGES.dummyWorkout}
          styleNative={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? ' w-[6.625rem]' : 'h-[9.9375rem] w-[21.1875rem] shrink-0'} aspect-video flex-1 rounded-lg`,
              ),
              native: tailwind('aspect-video w-[6.625rem] flex-1 self-center rounded-lg'),
            }),
          ]}
          contentFit="cover"
          contentPosition={'right top'}
        />
      );
    }
  };

  const renderExerciseCardItemLabels = () => {
    if (isRestCard) {
      return (
        <ShowLabelValue
          container={{ web: 'gap-[0.75rem] w-auto self-center ' }}
          label="Duration "
          labelContainer={{ web: `${isRestCard ? 'flex-0' : ''}` }}
          // valueContainer={`${isRestCard ? 'flex-0' : ''}`}
          value={`${item?.duration ? pluralise(item?.duration, `${item?.duration} second`) : '-'}`}
        />
      );
    }
    return (
      <>
        <ShowLabelValue
          container={{
            web: `${isLargeScreen ? 'gap-[0.75rem] justify-center' : ''}`,
          }}
          label="No. of Reps "
          value={`${item?.reps ? pluralise(item?.reps, `${item?.reps} second`) : '-'}`}
        />
      </>
    );
  };

  return (
    <Container
      style={[
        Platform.select({
          // web: tailwind(`flex-1 flex-row gap-4  rounded-lg bg-NAVBAR_BACKGROUND px-4 py-2`),
          web: [
            { height: isLargeScreen ? '5.4375rem' : '183px' },
            tailwind(
              `flex-row  rounded-lg bg-NAVBAR_BACKGROUND ${isLargeScreen ? 'justify-center gap-8 px-4' : 'gap-12 px-12 '} py-2 opacity-75`,
            ),
          ] as any,
          native: tailwind(
            `h-5.4375rem flex-row justify-center gap-6 rounded-lg  bg-NAVBAR_BACKGROUND px-2 py-1 opacity-55`,
          ),
        }),
      ]}
      key={item._id}>
      {!isEnabled && renderExerciseImage()}
      <Container
        style={[
          Platform.select({
            web: isLargeScreen
              ? tailwind(
                  `flex-1 flex-col  ${isRestCard ? 'flex-2 items-center' : ' items-start'} justify-center gap-[0.75rem]`,
                )
              : tailwind(
                  ` flex-1 flex-col ${isRestCard ? 'items-center' : 'items-start'}  mx-auto w-[537px] justify-center gap-[1.25rem]`,
                ),
            native: tailwind(
              `flex-col justify-center ${isRestCard ? ' w-3/5 items-center ' : 'flex-1 items-start '}  mx-auto `,
            ),
          }),
        ]}>
        <Container
          style={[
            Platform.select({
              web: tailwind(`flex-row items-center ${isLargeScreen ? '' : ''}`),
              native: tailwind('flex-1 flex-row items-center'),
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
            {`${item?.exercise?.name || item?.name}${item?.weight ? ` (${item?.weight} kg)` : ''}`}
          </Text>
        </Container>
        <Container
          style={[
            Platform.select({
              web: [
                isLargeScreen ? styles.MOBILE.labelValue : styles.DESKTOP.labelValue,
                tailwind(`self-center`),
              ] as any,
              native: tailwind(` flex-1 flex-col `),
            }),
          ]}>
          {renderExerciseCardItemLabels()}
        </Container>
      </Container>
    </Container>
  );
};

export default memo(StartWorkoutExerciseCard);

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
