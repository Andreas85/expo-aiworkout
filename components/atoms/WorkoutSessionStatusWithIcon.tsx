import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { ICON_SIZE } from '@/utils/appConstants';
import { tailwind } from '@/utils/tailwind';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import Container from './Container';

type Status = 'PENDING' | 'FINISHED';

interface WorkoutSessionStatusWithIconProps {
  itemStatus: Status;
}

export default function WorkoutSessionStatusWithIcon({
  itemStatus,
}: WorkoutSessionStatusWithIconProps) {
  const { isLargeScreen } = useWebBreakPoints();
  const status = itemStatus ? (itemStatus === 'PENDING' ? 'In Progress' : 'Completed') : 'Unknown';
  const iconColor = 'black';

  const renderIcons = () => {
    if (itemStatus === 'PENDING') {
      return (
        <Svg width={25} height={25} viewBox="0 0 30 30" fill={'#000'}>
          <G clipPath="url(#clip0_268_11694)">
            <Path
              d="M7.30882 16.5801C6.72058 16.5801 6.2794 16.1392 6.2794 15.5512C6.2794 14.978 6.72058 14.537 7.30882 14.537H13.9706V5.6443C13.9706 5.07105 14.4117 4.63009 14.9853 4.63009C15.5588 4.63009 16.0147 5.07105 16.0147 5.6443V15.5512C16.0147 16.1392 15.5588 16.5801 14.9853 16.5801H7.30882ZM15 29.9854C23.2059 29.9854 30 23.1799 30 14.9927C30 6.7908 23.1912 0 14.9853 0C6.79411 0 0 6.7908 0 14.9927C0 23.1799 6.80881 29.9854 15 29.9854Z"
              fill={'#A27DE1'}
            />
          </G>
          <Defs>
            <ClipPath id="clip0_268_11694">
              <Rect width={30} height={30} />
            </ClipPath>
          </Defs>
        </Svg>
      );
    }
    return (
      <Container style={tailwind(' rounded-full  bg-WORKOUT_PURPLE p-1')}>
        <FontAwesome5 name="check" size={ICON_SIZE - 2} color={iconColor} />
      </Container>
    );
  };

  return (
    <View style={tailwind('flex-row items-center justify-center rounded-lg')}>
      <Text
        style={tailwind(
          ` mr-2 py-1 text-center ${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]'} font-bold font-medium text-white`,
        )}>
        {status}
      </Text>
      {renderIcons()}
    </View>
  );
}
