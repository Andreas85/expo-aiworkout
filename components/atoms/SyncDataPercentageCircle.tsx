import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const SyncDataPercentageCircle: React.FC<{ completed: number | null; total: number | null }> = ({
  completed,
  total,
}) => {
  const validCompleted = isNaN(Number(completed)) || completed == null ? 0 : Number(completed);
  const validTotal = isNaN(Number(total)) || total == null ? 1 : Math.max(Number(total), 1); // Avoid division by 0
  const percentage = Math.min((validCompleted / validTotal) * 100, 100); // Dynamic percentage calculation

  const radius = 56; // Circle radius
  const strokeWidth = 10; // Width of the stroke
  const circumference = 2 * Math.PI * radius; // Total circumference of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference; // Progress offset
  const progressColor = Colors.brandColorDark; // Dynamic progress color

  return (
    <View style={styles.container}>
      <Svg width={180} height={180} viewBox="0 0 180 180">
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
          y="90"
          fontSize={radius / 3}
          fontWeight="bold"
          stroke={Colors.white}
          fill={Colors.white}
          textAnchor="middle"
          alignmentBaseline="middle">
          {`${validCompleted}/${validTotal}`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SyncDataPercentageCircle;
