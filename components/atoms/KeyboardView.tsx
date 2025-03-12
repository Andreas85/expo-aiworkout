import { tailwind } from '@/utils/tailwind';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface IKeyboardView {
  children: React.ReactNode;
  nativeStyle?: StyleProp<ViewStyle>;
}

const KeyboardView = (props: IKeyboardView) => {
  const { children, nativeStyle } = props;
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="always"
      style={[tailwind('my-4'), nativeStyle]}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardView;
