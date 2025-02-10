import GradientBackground from '@/components/atoms/GradientBackground';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { Platform, ScrollView } from 'react-native';
import ProfileScreen from '@/components/screens/ProfileScreen';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useFetchData } from '@/hooks/useFetchData';
import { getProfileService } from '@/services/me';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useAuthStore } from '@/store/authStore';

const Profile = () => {
  const { isLargeScreen } = useWebBreakPoints();
  const { setUserData } = useAuthStore();
  const { data } = useFetchData({
    queryFn: getProfileService,
    queryKey: [REACT_QUERY_API_KEYS.ME],
    staleTime: 0,
  });

  useEffect(() => {
    const userData = data?.data?.user;
    if (userData) {
      setUserData(userData);
    }
  }, [data]);

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
