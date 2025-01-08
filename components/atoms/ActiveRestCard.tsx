import React from 'react';
import { Platform } from 'react-native';
import Container from './Container';
import ShowLabelValue from './ShowLabelValue';
import { Text } from '../Themed';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { pluralise } from '@/utils/helper';
import MinusActionButton from './MinusActionButton';
import PlusActionButton from './PlusActionButton';
import ActiveWorkoutIcon from './ActiveWorkoutIcon';

interface ActiveRestCardProps {
  item: ExerciseElement;
}

const ActiveRestCard = ({ item }: ActiveRestCardProps) => {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={Platform.select({
        web: [
          {
            height: isLargeScreen ? '133px' : '15.0625rem',
          },
          tailwind(
            ` relative flex-col  justify-center gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-12 py-2 shadow-lg`,
          ),
          webStyles.container,
        ] as any,
        native: [
          tailwind('relative flex-1 flex-col gap-4 rounded-lg bg-NAVBAR_BACKGROUND px-2 py-1'),
          webStyles.container,
        ],
      })}>
      <ActiveWorkoutIcon />
      <Container
        style={[
          Platform.select({
            web: [
              { width: isLargeScreen ? '' : '537px' },
              tailwind(
                `mx-auto  flex-col items-center  justify-center ${isLargeScreen ? 'gap-4' : 'gap-12'}`,
              ),
            ] as any,
            native: tailwind('flex-1 flex-col items-center justify-center gap-4'),
          }),
        ]}>
        <Text
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'line-clamp-1 text-[1rem]' : 'text-[1.625rem] font-bold not-italic'} font-inter`,
              ),
              native: tailwind('flex-1 text-[1rem] font-extrabold'),
            }),
          ]}>
          Rest
        </Text>

        <Container
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'flex-col gap-4' : 'flex-row gap-12'} items-center justify-center  `,
            ),
            native: tailwind('w-3/5 flex-col items-center justify-center gap-4'),
          })}>
          <Container
            style={Platform.select({
              web: tailwind(`${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[4.5rem]'} `),
              native: tailwind('flex-1 gap-[0.75rem]'),
            })}>
            <ShowLabelValue
              label="Duration"
              container={{
                web: `${isLargeScreen ? 'gap-[0.75rem]' : 'gap-[6rem]'} self-center w-auto`,
                native: 'gap-[0.75rem]  ',
              }}
              labelContainer={{
                web: `flex-0`,
                native: 'text-center',
              }}
              valueContainer={{
                web: ``,
                native: 'text-center',
              }}
              value={`${item?.duration ? pluralise(item?.duration, `${item?.duration} second`) : '-'}`}
            />
          </Container>
          <Container
            style={Platform.select({
              web: tailwind(`flex-1 flex-row gap-4`),
              native: tailwind('mb-4 flex-1 flex-row gap-4'),
            })}>
            <MinusActionButton />
            <PlusActionButton />
          </Container>
        </Container>
      </Container>
    </Container>
  );
};

export default ActiveRestCard;

const webStyles = {
  container: {
    backgroundColor: '#252425',
    // height: '100%',
    boxShadow: '0 0 64px 2px rgba(162, 125, 225, 0.6)',
    shadowColor: '#A27DE1', // Shadow color for iOS
    shadowOffset: { width: 0, height: 10 }, // Offset for iOS
    shadowOpacity: 0.6, // Opacity for iOS
    shadowRadius: 16, // Blur radius for iOS
    elevation: 8, // Shadow for Android
  },
};
