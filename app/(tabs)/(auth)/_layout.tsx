import { Image, StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Container from '@/components/atoms/Container';
import { IMAGES } from '@/utils/images';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Container
        style={[styles.containerRowView, { flexDirection: isLargeScreen ? 'column' : 'row' }]}>
        <Container style={styles.card}>
          <Image
            resizeMode="cover"
            style={[
              styles.storeIcon,
              {
                height: '100%',
                paddingHorizontal: 0,
                margin: 0,
              },
            ]}
            source={IMAGES.signinBanner}
          />
        </Container>
        <Container style={styles.card}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
            }}>
            <Stack.Screen name="signin" options={{}} />
            <Stack.Screen name="signup" options={{}} />
          </Stack>
        </Container>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional dark overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeIcon: {
    width: 'auto',
    margin: 10,
    position: 'relative',
  },
  card: {
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
    flexGrow: 1,
  },
  containerRowView: {
    flex: 1,
    flexWrap: 'wrap',
    width: 'auto',
  },
});

export default AuthLayout;
