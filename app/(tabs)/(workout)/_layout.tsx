import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Container from '@/components/atoms/Container';
import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { Text } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useBreakPoints from '@/hooks/useBreakPoints';
import { useAuthStore } from '@/store/authStore';
import WorkoutIndexRoute from './workouts';
import PublicScreenRoute from './workouts/public';

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const insets = useSafeAreaInsets();
  const { isLargeScreen } = useBreakPoints();
  const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <Container style={[tailwind('flex-1'), { marginTop: insets.bottom }]}>
        <Tab.Navigator
          sceneContainerStyle={Platform.select({
            web: tailwind('bg-transparent'),
            native: tailwind('flex-1 bg-transparent'),
          })}
          // initialRouteName="workout"
          screenOptions={({ route }) => {
            // console.log(route, 'route');

            return {
              tabBarStyle: Platform.select({
                web: tailwind(
                  `rounded-t-4 mx-auto 
                  ${isLargeScreen ? 'mt-4' : ''} 
                  w-80  capitalize 
                  ${!isAuthenticated && 'hidden'}
                  `,
                ),
                native: {
                  // backgroundColor: '#493B42', // Set the background color based on the selected tab
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  marginHorizontal: 16,
                  display: !isAuthenticated ? 'none' : 'flex',
                },
              }),
              tabBarIndicatorStyle: {
                backgroundColor: '#9C79C9', // Set the background color for the selected tab's indicator
              },
              tabBarIndicatorContainerStyle: {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              },
              tabBarLabel: (props: { focused: boolean; color: string; children: string }) => {
                const { children } = props;
                return <Text>{children}</Text>;
              },
            };
          }}>
          {isAuthenticated && (
            <Tab.Screen
              name="workouts/index"
              component={WorkoutIndexRoute}
              options={({ route }) => ({
                title: 'My workouts',
              })}
            />
          )}
          <Tab.Screen
            name="workouts/public"
            component={PublicScreenRoute}
            options={({ route }) => ({
              title: 'Public workouts',
            })}
          />
        </Tab.Navigator>
      </Container>
    </SafeAreaView>
  );
}
