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
          web: [
            isLargeScreen ? styles.MOBILE.cardContainer : styles.DESKTOP.cardContainer,
            tailwind('flex-row rounded-lg bg-NAVBAR_BACKGROUND'),
          ],
          native: tailwind('flex-row gap-4 rounded-lg  bg-NAVBAR_BACKGROUND px-4 py-2'),
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
              native: tailwind('aspect-video h-20 self-center rounded-lg'),
            }),
          ]}
          contentFit="cover"
          contentPosition={'right top'}
        />
      )}
      <Container
        style={[
          Platform.select({
            web: isLargeScreen ? styles.MOBILE.cardDetails : styles.DESKTOP.cardDetails,
            native: tailwind(''),
          }),
          tailwind('flex-2'),
        ]}>
        {/* <Container
          style={[
            Platform.select({
              web: tailwind(
                `${!isLargeScreen ? styles.MOBILE.cardDetails : 'h-[8.3475rem] flex-col justify-between gap-[1.25rem]'}`,
              ),
              native: tailwind(`h-full flex-1 flex-col justify-between`),
            }),
          ]}> */}
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
            {`${item?.exercise?.name || item?.name}${item?.weight ? ` (${item?.weight} kg)` : ''}`}
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
          {item?.reps ? <ShowLabelValue label="Duration" value={`${item?.duration}`} /> : null}
          <ShowLabelValue
            label="Rest"
            value={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
          />
        </Container>
        {/* </Container> */}
      </Container>
    </Container>
  );
};

export default WorkoutCard;

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
