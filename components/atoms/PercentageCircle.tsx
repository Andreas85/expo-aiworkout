import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const PercentageCircle: React.FC<{ remainingTime: number; totalDurationTime: number }> = ({
  remainingTime,
  totalDurationTime,
}) => {
  const radius = 56; // Circle radius
  const strokeWidth = 10; // Width of the stroke
  const circumference = 2 * Math.PI * radius; // Total circumference of the circle
  const percentage = Math.min((remainingTime / totalDurationTime) * 100, 100); // Dynamic percentage calculation
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Progress offset
  const progressColor = Colors.brandColorDark; // Dynamic progress color based on remainingTime

  return (
    <View style={styles.container}>
      <Svg width={180} height={180}>
        {/* Background Circle */}
        <Circle
          cx="90"
          cy="90"
          r={radius}
          stroke={Colors.lightGray} // Light gray background
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx="90"
          cy="90"
          r={radius}
          stroke={progressColor} // Dynamic progress color
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round" // Rounded edges for the progress arc
          strokeDasharray={circumference} // Total circle length
          strokeDashoffset={strokeDashoffset} // Progress offset
        />
        {/* Score Text */}
        <SvgText
          x="90"
          y="120"
          fontSize="90"
          stroke={Colors.white}
          fill={Colors.white}
          textAnchor="middle">
          {`${remainingTime}`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PercentageCircle;
