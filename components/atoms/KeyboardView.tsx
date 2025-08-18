import { tailwind } from '@/utils/tailwind';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface IKeyboardView {
  children: React.ReactNode;
  nativeStyle?: StyleProp<ViewStyle>;
}

const KeyboardView = ({ children, nativeStyle }: IKeyboardView) => {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      style={[tailwind('my-4'), nativeStyle]} // ✅ full height
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardView;
