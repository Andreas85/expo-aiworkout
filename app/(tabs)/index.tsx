import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { tailwind } from '@/utils/tailwind';
import { useColorScheme } from '@/components/useColorScheme.web';
import { useAuthStore } from '@/store/authStore';

export default function TabOneScreen() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();
  return (
    <View
      style={styles.container}
      // style={tailwind('android:bg-blue-600 web:bg-red-600 p-2 ')}
    >
      <Text style={tailwind('text-blue-400')}>
        Tab One {JSON.stringify(isAuthenticated)} check {JSON.stringify(colorScheme)}
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
