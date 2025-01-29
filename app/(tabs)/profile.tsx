import GradientBackground from '@/components/atoms/GradientBackground';
import React from 'react';
import Container from '@/components/atoms/Container';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '@/components/atoms/ActionButton';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

const Profile = () => {
  const authStore = useAuthStore();
  const handleLogout = () => {
    authStore.clearTokenFromStore();
    router.navigate('/');
  };
  return (
    <SafeAreaView style={[tailwind('flex-1')]}>
      <GradientBackground>
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Container>
            <ActionButton
              uppercase={true}
              label={'Logout'}
              onPress={handleLogout}
              style={tailwind('rounded-lg')}
            />
          </Container>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Profile;
