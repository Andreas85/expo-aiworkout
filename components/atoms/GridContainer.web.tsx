import { tailwind } from '@/utils/tailwind';
import React from 'react';
import { ScrollView } from 'react-native';
import { View } from '../Themed';

export default function GridContainer(props: {
  children?: React.ReactNode;
  className?: string; // for web styling
}) {
  const { children, className } = props;
  return (
    <View style={tailwind('h-full bg-transparent')}>
      <ScrollView>
        <div className={className}>{children}</div>
      </ScrollView>
    </View>
  );
}
