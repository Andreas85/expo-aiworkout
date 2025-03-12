import { Switch } from 'react-native';
import React from 'react';
import { ICustomSwitch } from '@/utils/interfaces';
import { Text } from '../Themed';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';

const CustomSwitch = (props: ICustomSwitch) => {
  const {
    isEnabled,
    toggleSwitch,
    label,
    labelStyle = '',
    containerStyle,
    hasRightLabel = false,
    labelRight,
  } = props;
  return (
    <>
      <Container
        style={[tailwind('my-4 flex flex-row items-center justify-end gap-1'), containerStyle]}>
        <Text style={[labelStyle]}>{label}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#A27DE1' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor={'#A27DE1'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        {hasRightLabel && <Text style={[labelStyle, tailwind('mr-2')]}>{labelRight}</Text>}
      </Container>
    </>
  );
};

export default CustomSwitch;
