import { Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import Container from '../atoms/Container';

interface IWrapperContainer {
  children: React.ReactNode;
  wrapperContainerStyle?: { web?: string; native?: string };
}

const WrapperContainer = (props: IWrapperContainer) => {
  const { children, wrapperContainerStyle } = props;
  return (
    <Container
      style={[
        Platform.select({
          web: tailwind(`rounded-lg  bg-[#252425] p-2` + wrapperContainerStyle?.web),
          native: tailwind('rounded-lg bg-[#252425] px-1' + wrapperContainerStyle?.native),
        }),
      ]}>
      {children}
    </Container>
  );
};

export default WrapperContainer;

const styles = StyleSheet.create({});
