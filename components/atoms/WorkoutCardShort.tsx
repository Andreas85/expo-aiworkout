import { Platform } from 'react-native';
import React, { memo } from 'react';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import { ExerciseElement } from '@/services/interfaces';
import { pluralise } from '@/utils/helper';
import { Text } from '../Themed';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import TextContainer from './TextContainer';
import useBreakPoints from '@/hooks/useBreakPoints';

const WorkoutCardShort = (props: { item: ExerciseElement; isEnabled?: boolean }) => {
  const { item } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const { isExtraSmallDevice } = useBreakPoints();
  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(`flex-1 ${isLargeScreen ? 'py-[0.25rem]' : 'py-3'}  `),
          native: tailwind(' py-[0.25rem]'),
        }),
      ]}
      key={item._id}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`${isLargeScreen ? 'py-1' : 'py-2 pb-3'} flex-1 flex-row items-start`),
            native: tailwind('flex-row items-start justify-between gap-3 py-1  '),
          }),
          // tailwind('flex-1 flex-row items-start '),
        ]}>
        <Text
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'w-[47%] text-[0.875rem]' : 'w-[56%] text-[1.375rem]'} ps-[2px]`,
              ),
              native: tailwind(
                `w-[47%] ${isExtraSmallDevice ? 'text-[0.675rem]' : 'text-[0.875rem]'} `,
              ),
            }),
          ]}
          numberOfLines={1}>
          {item?.exercise?.name ?? item?.name}
          {item?.weight ? ` (${item?.weight} kg)` : ''}
        </Text>
        <TextContainer
          data={`${item?.reps ? item?.reps : '-'}`}
          style={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'w-[32%] px-4 text-[0.875rem] ' : 'w-[24%] text-[1.375rem]'}`,
              ),
              native: tailwind(
                `w-[27%] ${isExtraSmallDevice ? 'text-[0.675rem]' : 'text-[0.875rem]'} `,
              ),
            }),
          ]}
        />
        <TextContainer
          data={`${item?.rest ? pluralise(item?.rest, `${item?.rest} second`) : '-'}`}
          style={[
            Platform.select({
              web: tailwind(`${isLargeScreen ? 'w-[30%] text-[0.875rem]' : 'text-[1.375rem]'}`),
              native: tailwind(
                `w-[30%] ${isExtraSmallDevice ? 'text-[0.675rem]' : 'text-[0.875rem]'} `,
              ),
            }),
          ]}
        />
      </Container>
      <Container
        style={[
          Platform.select({
            web: tailwind('border-b-[0.1px] opacity-10'),
            native: tailwind('border-[0.25px] opacity-25'),
          }),
          tailwind('border-none border-white '),
        ]}
      />
    </Container>
  );
};

export default memo(WorkoutCardShort);
