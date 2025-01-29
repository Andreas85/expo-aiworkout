import GradientBackground from '@/components/atoms/GradientBackground';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { Platform, ScrollView } from 'react-native';
import ProfileScreen from '@/components/screens/ProfileScreen';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const Profile = () => {
  const { isLargeScreen } = useWebBreakPoints();

  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground
        styleNative={Platform.select({
          web: tailwind(isLargeScreen ? 'mt-0' : 'mt-24'),
        })}>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ProfileScreen />
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Profile;
