import { Platform, StyleSheet, Text } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

interface ICustomHeaderProps {
  heading: string;
}

const CustomTopHeader = (props: ICustomHeaderProps) => {
  const { heading } = props;
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <>
      <Container
        style={[tailwind('flex-row items-center justify-between rounded-2xl ')]}
        className="mb-4 flex w-full flex-1 flex-col gap-2">
        <Container
          style={tailwind('mb-4 flex w-full flex-row justify-between gap-y-4')}
          className="flex items-center justify-between">
          <Text
            style={[
              Platform.select({
                web: tailwind(`${isLargeScreen ? 'text-[1.125rem]' : 'text-[2rem]'}`),
                native: tailwind('text-[1.125rem]'),
              }),
              tailwind(` text-center capitalize not-italic leading-10 text-white `),
            ]}>
            {heading}
          </Text>
        </Container>
      </Container>
      <Container style={[tailwind('mb-4 border-[0.5px] border-white')]} />
    </>
  );
};

export default CustomTopHeader;

const styles = StyleSheet.create({});
