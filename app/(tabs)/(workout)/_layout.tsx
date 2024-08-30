import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WorkoutIndex from '.';
import PublicScreen from './public';
import Container from '@/components/atoms/Container';
import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { Text } from '@/components/Themed';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuthStore } from '@/store/authStore';

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const insets = useSafeAreaInsets();
  // const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <Container style={[tailwind('flex-1'), { marginTop: insets.bottom }]}>
        {/* {isAuthenticated && ( */}
        <Tab.Navigator
          sceneContainerStyle={Platform.select({
            web: tailwind('bg-transparent'),
            native: tailwind('flex-1 bg-transparent'),
          })}
          initialRouteName="index"
          screenOptions={({ route }) => {
            // console.log(route, 'route');

            return {
              tabBarStyle: Platform.select({
                web: tailwind(
                  'rounded-t-4 mx-auto mt-28 w-72 bg-WORKOUT_VERSION_BACKGROUND capitalize',
                ),
                native: {
                  backgroundColor: '#493B42', // Set the background color based on the selected tab
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  marginHorizontal: 16,
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
              // tabBarC
              // tabBarContentContainerStyle: Platform.select({
              //   web: tailwind('max-w-72 bg-red-600 '),
              // }),
            };
          }}>
          <Tab.Screen
            name="index"
            component={WorkoutIndex}
            options={({ route }) => ({
              title: 'My workouts',
            })}
          />
          <Tab.Screen
            name="public"
            component={PublicScreen}
            options={({ route }) => ({
              title: 'Public workouts',
            })}
          />
        </Tab.Navigator>
        {/* )} */}
      </Container>
    </SafeAreaView>
  );
}
