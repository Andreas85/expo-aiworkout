import { getStatusColor } from '@/utils/helper';
import { tailwind } from '@/utils/tailwind';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function WorkoutStatus(props: { itemStatus: 'PENDING' | 'FINISHED' }) {
  const { itemStatus } = props;
  const status = itemStatus ? (itemStatus === 'PENDING' ? 'IN PROGRESS' : 'COMPLETED') : 'Unknown';
  const [colorObject, setColorObject] = useState<{
    background: string;
    text: string;
  }>({
    background: 'bg-gray-400',
    text: 'text-gray-400',
  });

  useEffect(() => {
    if (itemStatus) {
      const status = itemStatus;
      const result = getStatusColor(status) as {
        background: string;
        text: string;
      };
      setColorObject(result);
    }
  }, [itemStatus]);

  return (
    <View style={tailwind(`items-center justify-center rounded  ${colorObject.background} `)}>
      <Text style={tailwind(` px-2 py-1 text-center text-sm font-medium text-white`)}>
        {status}
      </Text>
    </View>
  );
}
