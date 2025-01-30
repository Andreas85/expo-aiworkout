import React from 'react';
import Container from './Container';
import TextContainer from './TextContainer';
import { tailwind } from '@/utils/tailwind';
import { Platform } from 'react-native';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { AppTextInput } from './AppTextInput';

const ShowLabelValue = (props: {
  label: string;
  value?: string;
  container?: { web?: string; native?: string };
  labelContainer?: { web?: string; native?: string };
  valueContainer?: { web?: string; native?: string };
  noOfLinesLabel?: number;
  noOfLinesValue?: number;
  isEditable?: boolean;
  onChangeText?: (text: string) => void;
  errorMessage?: string;
}) => {
  const {
    label,
    value,
    container,
    labelContainer,
    valueContainer,
    noOfLinesLabel,
    noOfLinesValue,
    isEditable,
    onChangeText,
    errorMessage,
  } = props;

  const { isLargeScreen } = useWebBreakPoints();

  const renderValueContainer = () => {
    if (isEditable) {
      return (
        <Container
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-[0.8175rem]' : 'text-[1.25rem] not-italic'} flex-1 p-0  ${valueContainer?.web || ''}  `,
            ),
            native: tailwind(`flex-1 ${valueContainer?.native || ''}`),
          })}>
          <AppTextInput
            value={value}
            placeholder="Enter your value"
            onChangeText={onChangeText}
            errorMessage={errorMessage}
            keyboardType="default"
            placeholderTextColor="#fff"
            testInputStyle={tailwind('text-white')}
            style={{
              color: '#fff',
              fontSize: isLargeScreen ? 14 : 20,
              width: '100%',
              borderBottomColor: '#fff',
              borderBottomWidth: 1,
            }}
            containerStyle={{
              // flex: 1,
              padding: 0,
            }}
            autoCapitalize="none"
          />
        </Container>
      );
    }
    return (
      <TextContainer
        data={value}
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem] not-italic'} flex-1 ${valueContainer?.web || ''}`,
            ),
            native: tailwind(`flex-1 ${valueContainer?.native || ''}`),
          }),
        ]}
        numberOfLines={noOfLinesValue}
      />
    );
  };

  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem] not-italic'} w-full flex-1 flex-row items-start ${container?.web || ''}`,
          ),
          native: tailwind(`w-full flex-1 flex-row items-start ${container?.native || ''}`),
        }),
      ]}>
      <TextContainer
        data={label}
        style={[
          Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-[0.8175rem]' : 'text-[1.25rem] not-italic'} flex-1 ${labelContainer?.web || ''}`,
            ),
            native: tailwind(`flex-1 ${labelContainer?.native || ''}`),
          }),
        ]}
        numberOfLines={noOfLinesLabel}
      />
      {renderValueContainer()}
    </Container>
  );
};

export default ShowLabelValue;
