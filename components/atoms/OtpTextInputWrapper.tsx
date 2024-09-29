import React, { useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { KeyboardTypeOptions, Platform, StyleProp, Text, ViewStyle } from 'react-native';
import { tailwind } from '@/utils/tailwind';

interface OtpTextInputWrapperProps {
  cellCount?: number;
  keyboardType?: KeyboardTypeOptions;
  containerStyle?: StyleProp<ViewStyle>;
  cellStyle?: string;
  focusedCellStyle?: string;
  testID?: string;
  onChange: (value: string) => void;
}

const OtpTextInputWrapper = (IProps: OtpTextInputWrapperProps) => {
  const {
    onChange,
    cellCount = 4,
    containerStyle,
    focusedCellStyle,
    keyboardType = 'number-pad',
    cellStyle,
    testID,
  } = IProps;
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleChangeText = (newValue: string) => {
    setValue(newValue);
    onChange(newValue); // Send the value back to the parent
  };
  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={handleChangeText}
      cellCount={cellCount}
      rootStyle={[
        Platform.select({
          web: tailwind('m-auto flex-row items-center justify-between gap-4  px-8'),
          native: tailwind('flex-row items-center justify-between gap-4 px-8'),
        }),
        containerStyle,
      ]}
      keyboardType={keyboardType ? keyboardType : 'number-pad'}
      textContentType={'oneTimeCode'}
      testID={testID}
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[
            Platform.select({
              web: tailwind(
                'text-8 min-h-12 min-w-12 rounded-lg border-2 border-black  text-center text-white',
              ),
              native: tailwind(
                'text-8 h-12 w-12 rounded-lg border-2 border-black text-center text-white',
              ),
            }),
            tailwind(
              `${isFocused ? (focusedCellStyle ? focusedCellStyle : 'border-black') : 'border-gray-300'} `,
              cellStyle,
            ),
          ]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};

export default OtpTextInputWrapper;
