import { Switch } from 'react-native';
import React from 'react';
import { ICustomSwitch } from '@/utils/interfaces';
import { Text, View } from '../Themed';
import { tailwind } from '@/utils/tailwind';

const CustomSwitch = (props: ICustomSwitch) => {
  const { isEnabled, toggleSwitch, label } = props;
  return (
    <>
      <View style={tailwind('flex flex-row items-center justify-end gap-1')}>
        <Text>{label}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#A27DE1' }}
          thumbColor={'#f4f3f4'}
          ios_backgroundColor={'#A27DE1'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </>
  );
};

export default CustomSwitch;
