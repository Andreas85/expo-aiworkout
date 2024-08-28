import Colors from '@/constants/Colors';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function TextContainer(props: {
  data?: any;
  className?: string; // for web styling
}) {
  const { data, className = '' } = props;
  const theme = useColorScheme() ?? 'light';
  const textColor = Colors[theme]['text'];

  return (
    <div className={className + ` block `} style={{ color: textColor }}>
      {data}
    </div>
  );
}
