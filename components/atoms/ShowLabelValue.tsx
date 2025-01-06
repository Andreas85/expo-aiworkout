import React from 'react';
import Container from './Container';
import TextContainer from './TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const ShowLabelValue = (props: {
  label: string;
  value?: string;
  container?: { web?: string; native?: string };
  labelContainer?: { web?: string; native?: string };
  valueContainer?: { web?: string; native?: string };
}) => {
  const { label, value, container, labelContainer, valueContainer } = props;
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} w-full  flex-1 flex-row items-start ${container?.web ? container.web : ''}`,
          ),
          native: tailwind(
            `w-full flex-1 flex-row items-start ${container?.native ? container.native : ''}`,
          ),
        }),
      ]}>
      <TextContainer
        data={label}
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-[0.8175rem]' : ' text-[1.25rem] not-italic'} flex-1  ${labelContainer?.web ? labelContainer.web : ''}`,
            ),
            native: tailwind(`flex-1  ${labelContainer?.native ? labelContainer.native : ''}`),
          }),
        ]}
      />
      <TextContainer
        data={value}
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} flex-1  ${valueContainer?.web ? valueContainer.web : ''}`,
            ),
            native: tailwind(`flex-1   ${valueContainer?.native ? valueContainer.native : ''}`),
          }),
        ]}
      />
    </Container>
  );
};

export default ShowLabelValue;
