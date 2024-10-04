import { Platform } from 'react-native';
import React from 'react';
import Container from './Container';
import ImageContainer from './ImageContainer';
import { tailwind } from '@/utils/tailwind';
import ShowLabelValue from './ShowLabelValue';
import { ExerciseElement } from '@/services/interfaces';
import { IMAGES } from '@/utils/images';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const WorkoutCard = (props: { item: ExerciseElement; isEnabled?: boolean }) => {
  const { item, isEnabled } = props;
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(`${isLargeScreen ? 'gap-4' : ' gap-[4.5rem]'}`),
          native: tailwind(' flex-1  gap-4'),
        }),
        tailwind('flex-row rounded-lg bg-NAVBAR_BACKGROUND p-2 px-4'),
      ]}
      key={item._id}>
      {!isEnabled && (
        <ImageContainer
          source={IMAGES.dummyWorkout}
          styleNative={[
            Platform.select({
              web: tailwind(`${isLargeScreen ? 'h-28' : 'shrink-0; h-[9.9375rem] w-[21.1875rem]'}`),
              native: tailwind(''),
            }),
            tailwind(`flex-1.5 aspect-video self-center rounded-lg`),
          ]}
          contentFit="cover"
          contentPosition={'right top'}
        />
      )}
      <Container
        style={[
          Platform.select({
            web: tailwind(),
            native: tailwind(''),
          }),
          tailwind('flex-2 '),
        ]}>
        <Container style={tailwind('h-full flex-1 flex-col justify-between')}>
          <Container style={tailwind('flex-1 flex-row items-start')}>
            <Text
              style={[
                Platform.select({
                  web: tailwind(
                    `${isLargeScreen ? 'text-[1rem]' : 'text-[1.625rem] font-bold not-italic'}`,
                  ),
                  native: tailwind('text-[1rem] font-extrabold'),
                }),
                tailwind('flex-1 items-center font-bold'),
              ]}
              numberOfLines={1}>
              {item?.exercise?.name ?? item?.name}
              {item?.weight ? `(${item?.weight} kg)` : ''}
            </Text>
          </Container>
          <ShowLabelValue label="No. of Reps" value={`${item?.reps ? item?.reps : '-'}`} />
          <ShowLabelValue
            label="Rest"
            value={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
          />
        </Container>
      </Container>
    </Container>
  );
};

export default WorkoutCard;
