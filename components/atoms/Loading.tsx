import { ActivityIndicator } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';

const Loading = () => {
  return <ActivityIndicator style={tailwind('self-center py-24')} />;
};

export default Loading;
