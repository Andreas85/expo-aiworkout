import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const PercentageCircle: React.FC<{ score: number; totalQuestions: number }> = ({
  score,
  totalQuestions,
}) => {
  const radius = 70; // Circle radius
  const strokeWidth = 15; // Width of the stroke
  const circumference = 2 * Math.PI * radius; // Total circumference of the circle
  const percentage = Math.min((score / totalQuestions) * 100, 100); // Dynamic percentage calculation
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Progress offset
  const progressColor = Colors.brandColor; // Dynamic progress color based on score

  return (
    <View style={styles.container}>
      <Svg width={180} height={180}>
        {/* Background Circle */}
        <Circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#e0e0e0" // Light gray background
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
          y="95"
          fontSize="20"
          fontWeight="bold"
          fill={Colors.lightGray}
          textAnchor="middle">
          {`${score}/${totalQuestions}`}
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
