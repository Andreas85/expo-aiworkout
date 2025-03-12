import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';
import '../input.css';
// import { enableLegacyWebImplementation } from 'react-native-gesture-handler';

import { useColorScheme } from '@/components/useColorScheme';
import Navbar from '@/components/hoc/Navbar';
import { Alert, AppState, AppStateStatus, Platform } from 'react-native';
import Header from '@/components/hoc/Header.web';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import Container from '@/components/atoms/Container';
import { tailwind } from '@/utils/tailwind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ToastProvider } from 'react-native-toast-notifications';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import React from 'react';
import * as Updates from 'expo-updates';
import { interactionStore } from '@/store/interactionStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// enableLegacyWebImplementation(true);
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useReactQueryDevTools(queryClient);

  const hasUserInteracted = interactionStore(state => state.hasInteracted);
  const { setHasInteracted } = interactionStore();
  const colorScheme = useColorScheme();
  const { isLargeScreen } = useWebBreakPoints();

  const renderRoot = () => {
    return (
      <>
        {Platform.OS === 'web' && !isLargeScreen ? <Header /> : null}
        <Container
          style={[
            Platform.select({
              web: tailwind('flex-1'),
              native: tailwind('flex-1'),
            }),
          ]}>
          <Navbar />
        </Container>
      </>
    );
  };

  async function checkForUpdates() {
    if (Platform.OS === 'web' || Updates.isEmbeddedLaunch === false) {
      console.log('Update checking is not supported in Expo Go.');
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert('Update Available', 'An update is available. Do you want to install it now?', [
          {
            text: 'Update',
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }

  // Detect user interaction and update Zustand store
  useEffect(() => {
    if (hasUserInteracted) return; // Exit if already interacted

    if (Platform.OS === 'web') {
      const handleInteraction = () => {
        setHasInteracted(true); // Update Zustand store

        // Remove listeners after the first interaction
        document.removeEventListener('mousedown', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
      };

      // Add event listeners for interaction
      document.addEventListener('mousedown', handleInteraction); // Mouse click
      document.addEventListener('keydown', handleInteraction); // Key press
      document.addEventListener('scroll', handleInteraction); // Scroll

      return () => {
        // Cleanup listeners on unmount
        document.removeEventListener('mousedown', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
      };
    }
  }, [hasUserInteracted, setHasInteracted]);

  useEffect(() => {
    checkForUpdates();
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ToastProvider
          placement="bottom"
          duration={2000}
          animationType="slide-in"
          animationDuration={250}
          successColor="green"
          dangerColor="red"
          warningColor="orange"
          normalColor="gray">
          <GestureHandlerRootView style={{ flex: 1 }}>{renderRoot()}</GestureHandlerRootView>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
