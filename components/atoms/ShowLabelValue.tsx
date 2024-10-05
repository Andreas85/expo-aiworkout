import React from 'react';
import Container from './Container';
import TextContainer from './TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const ShowLabelValue = (props: { label: string; value?: string }) => {
  const { label, value } = props;
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={[
        tailwind('w-full flex-1 flex-row items-start'),
        Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} w-full `,
          ),
        }),
      ]}>
      <TextContainer
        data={label}
        style={[
          Platform.select({
            web: tailwind(`${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '}`),
          }),
          tailwind('flex-1'),
        ]}
      />
      <TextContainer
        data={value}
        style={[
          Platform.select({
            web: tailwind(`${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '}`),
          }),
          tailwind('flex-1'),
        ]}
      />
    </Container>
  );
};

export default ShowLabelValue;
