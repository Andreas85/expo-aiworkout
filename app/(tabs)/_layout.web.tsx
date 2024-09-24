import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuthStore } from '@/store/authStore';
import { StatusBar } from 'expo-status-bar';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import Header from '@/components/hoc/Header.web';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  let { isLargeScreen } = useWebBreakPoints();

  const renderer = () => {
    return (
      <>
        <div className={` ${isLargeScreen ? 'hidden' : 'mb-32'}`}>
          <Header />
        </div>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            // Disable the static render of the header on web
            // to prevent a hydration error in React Navigation v6.
            headerShown: useClientOnlyValue(false, true),
            tabBarItemStyle: {
              marginBottom: 5,
            },
            tabBarInactiveTintColor: '#fff',
            tabBarStyle: Platform.select({
              // web: tailwind(
              //   `${isLargeScreen ? '' : `bg-BACKGROUND absolute left-0 right-0 top-0 mx-auto flex  w-full flex-row items-center  justify-between ${isLargeScreen ? 'px-80' : 'px-96'}`}`,
              // ),
              web: tailwind(`${isLargeScreen ? '' : `hidden`}`),
            }),
          }}>
          <Tabs.Screen
            name="(workout)"
            options={{
              title: 'Workout',
              headerTransparent: true,
              unmountOnBlur: true,
              headerShown: false,
              tabBarLabelPosition: isLargeScreen ? 'below-icon' : 'beside-icon',
              // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
              tabBarIcon: ({ color, size }) => (
                <Svg width={size} height={size} viewBox="0 0 29 29" fill={color}>
                  <G clipPath="url(#clip0_775_5037)">
                    <Path
                      d="M10.079 25.522l.872-.872-.986-.985-.865.865a.457.457 0 01-.662-.008l-4.605-4.605c-.196-.196-.214-.486-.023-.677l.865-.865-.985-.985-.872.872c-.722.722-.708 1.853.033 2.594l4.64 4.64c.734.734 1.866.748 2.588.026zm3.751-.662l.484-.484c1.138-1.138 1.1-2.497-.123-3.72L7.706 14.17c-1.223-1.223-2.59-1.282-3.72-.151l-.58.579c-1.049 1.049-.942 2.368.28 3.59l6.486 6.486c1.222 1.223 2.555 1.288 3.658.184zm-1.041-1.07c-.45.45-1.044.401-1.589-.144l-6.485-6.485c-.552-.552-.635-1.126-.233-1.527l.538-.539c.484-.483 1.105-.448 1.657.104l6.485 6.485c.545.545.574 1.16.076 1.657l-.45.45zm-2.598-6.78l6.05-6.05-1.056-1.054-6.05 6.05 1.056 1.054zm2.194 2.194l6.05-6.049-1.056-1.055-6.049 6.05 1.055 1.055zm11.22-4.12l.485-.484c1.103-1.103 1.038-2.436-.185-3.659L17.42 4.456c-1.223-1.223-2.542-1.329-3.598-.273l-.572.572c-1.138 1.138-1.072 2.498.15 3.72l6.486 6.486c1.223 1.223 2.582 1.26 3.72.123zm-1.034-1.076c-.497.498-1.112.469-1.657-.076L14.43 7.447c-.552-.552-.594-1.167-.104-1.657l.539-.538c.402-.402.975-.319 1.527.233l6.485 6.485c.545.545.594 1.14.145 1.589l-.45.45zm1.31-2.287l.871-.872c.722-.722.708-1.854-.026-2.588l-4.64-4.64c-.74-.74-1.872-.755-2.594-.033l-.872.872.985.985.865-.865c.184-.184.48-.173.677.023l4.605 4.605a.463.463 0 01.008.662l-.865.865.985.986z"
                      fill={color}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_775_5037">
                      <Path
                        fill={color}
                        transform="rotate(-45 21.728 9)"
                        d="M0 0H24.9963V15.001H0z"
                      />
                    </ClipPath>
                  </Defs>
                </Svg>
              ),
            }}
          />
          <Tabs.Screen
            name="my-exercise"
            options={{
              title: 'My exercise',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Svg width={size} height={size} viewBox="0 0 18 23" fill={color}>
                  <G clipPath="url(#clip0_775_5045)">
                    <Path
                      d="M4.345 5.876c.556 0 .995-.44.995-.997a.994.994 0 00-.995-.997c-.535 0-.995.46-.995.997 0 .547.46.997.995.997zm0 3.281c.556 0 .995-.45.995-.997a.979.979 0 00-.995-.987.992.992 0 00-.995.987c0 .547.449.997.995.997zm0 3.431c.556 0 .995-.45.995-.997a.988.988 0 00-.995-.997c-.535 0-.995.45-.995.997 0 .536.46.997.995.997zm3.018-7.034h6.624a.67.67 0 000-1.34H7.363a.67.67 0 000 1.34zm0 3.27h6.624c.374 0 .663-.289.663-.664a.654.654 0 00-.663-.665H7.363a.654.654 0 00-.664.665c0 .375.29.665.664.665zm0 3.432h6.624c.364 0 .663-.3.663-.665a.66.66 0 00-.663-.665H7.363a.66.66 0 00-.664.665c0 .365.3.665.664.665zM0 19.633c0 2.241 1.102 3.356 3.317 3.356h11.365c2.216 0 3.318-1.115 3.318-3.356V3.367C18 1.137 16.898 0 14.682 0H3.317C1.102 0 0 1.137 0 3.367v16.266zm1.723-.032V3.399c0-1.072.567-1.673 1.68-1.673h11.194c1.113 0 1.68.6 1.68 1.673v16.202c0 1.072-.567 1.662-1.68 1.662H3.403c-1.113 0-1.68-.59-1.68-1.662z"
                      fill={color}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_775_5045">
                      <Path fill={color} d="M0 0H18V23H0z" />
                    </ClipPath>
                  </Defs>
                </Svg>
              ),
              headerRight: () => (
                <Link href="/modal" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }}
          />
          <Tabs.Screen
            name="workout-session"
            options={{
              title: 'Workout Session',
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Svg width={size} height={size} viewBox="0 0 27 23" fill={color}>
                  <G clipPath="url(#clip0_775_5052)">
                    <Path
                      d="M13.08 4.89c-.489 0-.89.395-.89.891v6.288c0 .26.079.485.268.733l2.747 3.673c.367.485.878.564 1.334.248.412-.293.445-.822.112-1.284l-3.704-5.06 1.012 3.155V5.781a.88.88 0 00-.878-.89zM13.504 0C8.031 0 3.383 4.046 2.37 9.32H.791c-.8 0-1 .552-.567 1.183l2.491 3.583c.367.519.901.507 1.257 0l2.491-3.595c.423-.62.223-1.172-.567-1.172H4.294c.957-4.26 4.694-7.392 9.21-7.392a9.365 9.365 0 017.65 3.955c.334.462.868.609 1.324.316.456-.27.579-.89.2-1.386C20.565 1.938 17.251 0 13.503 0zm0 22.989c5.472 0 10.12-4.057 11.133-9.32h1.568c.8 0 1.012-.552.567-1.183l-2.48-3.583c-.367-.519-.9-.508-1.257 0l-2.49 3.594c-.435.62-.223 1.172.566 1.172h1.613c-.968 4.249-4.716 7.404-9.22 7.404a9.375 9.375 0 01-7.652-3.967c-.344-.462-.867-.608-1.334-.327-.445.282-.567.902-.19 1.398 2.114 2.873 5.428 4.812 9.176 4.812z"
                      fill={color}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_775_5052">
                      <Path fill={color} d="M0 0H27V23H0z" />
                    </ClipPath>
                  </Defs>
                </Svg>
              ),
              headerRight: () => (
                <Link href="/modal" asChild>
                  <Pressable>
                    {({ pressed }) => (
                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              headerShown: false,
              tabBarItemStyle: {
                display: isAuthenticated ? 'flex' : 'none',
                marginBottom: 5,
              },
              tabBarIcon: ({ color, size }) => (
                <Svg width={size} height={size} viewBox="0 0 34 23" fill={color}>
                  <G clipPath="url(#clip0_775_5059)">
                    <Path
                      d="M15.663 23h15.334C33.035 23 34 22.39 34 21.047c0-3.196-4.041-7.82-10.67-7.82-6.617 0-10.658 4.624-10.658 7.82 0 1.343.965 1.953 2.991 1.953zm-.586-1.843c-.317 0-.44-.085-.44-.341 0-2.001 3.102-5.747 8.693-5.747 5.604 0 8.704 3.746 8.704 5.747 0 .256-.134.341-.451.341H15.077zm8.265-9.444c2.906 0 5.274-2.587 5.274-5.735 0-3.123-2.356-5.576-5.274-5.576-2.905 0-5.286 2.502-5.274 5.6.012 3.137 2.369 5.711 5.274 5.711zm0-1.842c-1.782 0-3.308-1.708-3.308-3.868-.012-2.123 1.49-3.758 3.308-3.758 1.82 0 3.309 1.61 3.309 3.733 0 2.16-1.514 3.893-3.309 3.893zM2.478 23h9.584c-.586-.33-1.026-1.062-.94-1.806H2.185c-.256 0-.366-.098-.366-.33 0-3.026 3.455-5.856 7.447-5.856 1.526 0 2.918.366 4.102 1.061a6.08 6.08 0 011.38-1.293c-1.575-1.037-3.468-1.574-5.482-1.574-5.115 0-9.266 3.71-9.266 7.772C0 22.33.83 23 2.478 23zm6.8-11.19c2.515 0 4.578-2.256 4.578-5.026 0-2.709-2.038-4.893-4.578-4.893-2.515 0-4.59 2.22-4.578 4.917 0 2.758 2.063 5.003 4.578 5.003zm0-1.817c-1.501 0-2.759-1.428-2.759-3.185 0-1.72 1.245-3.099 2.76-3.099 1.537 0 2.77 1.354 2.77 3.075 0 1.781-1.27 3.209-2.77 3.209z"
                      fill={color}
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_775_5059">
                      <Path fill={color} d="M0 0H34V23H0z" />
                    </ClipPath>
                  </Defs>
                </Svg>
              ),
            }}
          />
          <Tabs.Screen
            name="signin"
            options={{
              title: 'Sign in',
              headerShown: false,
              unmountOnBlur: true,
              tabBarItemStyle: {
                display: isAuthenticated ? 'none' : 'flex',
                marginBottom: 5,
              },
              tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            }}
          />
        </Tabs>
      </>
    );
  };
  return (
    <>
      {renderer()}
      <StatusBar style={'auto'} />
    </>
  );
}
