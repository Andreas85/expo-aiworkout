import { tailwind } from '@/utils/tailwind';
import type { ReactNode } from 'react';
import { TextInput, type TextInputProps, View, StyleProp, ViewStyle, Platform } from 'react-native';
import { Text } from '../Themed';
import Container from './Container';

export type AppTextInputProps = {
  label?: string;
  left?: ReactNode;
  right?: ReactNode;
  isPhoneNumberField?: boolean;
  testInputStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
} & TextInputProps;
export function AppTextInput({
  label,
  left,
  right,
  isPhoneNumberField,
  containerStyle,
  testInputStyle,
  errorMessage,
  ...rest
}: AppTextInputProps) {
  return (
    <Container className="w-full">
      {!!label && <Text style={tailwind('mb-2 capitalize')}>{label}</Text>}
      <Container
        style={[
          tailwind('rounded-3 flex-row items-center justify-between self-stretch '),
          containerStyle,
        ]}>
        {left}
        {isPhoneNumberField && (
          <View
            style={Platform.select({
              ios: tailwind('absolute left-3 top-2 self-center'),
              web: tailwind('absolute left-3 top-3 self-center'),
              android: tailwind('absolute left-3 top-4 self-center'),
            })}>
            <Text
              style={tailwind(
                Platform.select({
                  ios: tailwind('text-4.2 flex-1 font-medium'),
                  web: tailwind('text-4 flex-1 font-medium'),
                  android: tailwind('text-4 flex-1 font-medium'),
                }),
              )}>
              +1
            </Text>
          </View>
        )}
        <TextInput
          style={[
            tailwind(
              'text-4 w-full flex-1 border border-b-stone-50 border-l-transparent border-r-transparent border-t-transparent p-3 font-medium text-white',
            ),
            { outlineStyle: 'none' },
            testInputStyle,
          ]}
          {...rest}
        />
        {right}
      </Container>
      <Text style={tailwind('text-3 text-red-400')}>{errorMessage ?? ' '}</Text>
    </Container>
  );
}
