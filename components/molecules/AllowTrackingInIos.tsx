import { StyleSheet, TouchableOpacity, View, Text, Platform } from 'react-native';
import React from 'react';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import { IMAGES } from '@/utils/images';
import usePlatform from '@/hooks/usePlatform';

// Only import the tracking module if we're on iOS
let requestTrackingPermissionsAsync: any;
if (Platform.OS === 'ios') {
  ({ requestTrackingPermissionsAsync } = require('expo-tracking-transparency'));
}

const AllowTrackingInIos = (props: {
  title?: string;
  desc?: string;
  setShowPermissionScreen?: any;
}) => {
  const { title, desc, setShowPermissionScreen } = props;
  const { isIOS, isWeb } = usePlatform();
  const handleNotNowClick = () => {
    setShowPermissionScreen(false);
  };

  const handleAllowNotificationAccess = async () => {
    try {
      const { status } = await requestTrackingPermissionsAsync();
      console.log('Tracking permission status:', status);
      if (status === 'granted') {
        console.log('Permission Granted', 'Tracking permission is enabled!');
      }

      setShowPermissionScreen?.();
    } catch (error) {
      console.error('Error requesting tracking permission:', error);
    }
  };

  const renderButton = () => {
    return (
      <TouchableOpacity onPress={handleAllowNotificationAccess} style={[styles.buttonClass]}>
        <Text style={{ color: 'white', alignSelf: 'center' }}>{'Continue'}</Text>
      </TouchableOpacity>
    );
  };

  // If on web, just return null or some other component
  if (isWeb) {
    return null;
    // Or you could return a web-specific version:
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <Text>Web version - tracking permissions not applicable</Text>
    //   </View>
    // );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          backgroundColor: `#252425`,
        }}>
        <View
          style={{
            rowGap: 4,
            paddingHorizontal: 20,
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <View style={{}}>
            <Image
              source={IMAGES.logo}
              style={styles.image}
              contentFit="contain"
              transition={1000}
            />
          </View>
          <Text style={[styles.title]}>{title}</Text>
          <Text style={[styles.desc]}>{desc}</Text>
          <View style={{}}>
            {renderButton()}
            {!isIOS && (
              <TouchableOpacity style={{ paddingVertical: 25 }} onPress={handleNotNowClick}>
                <Text style={{ alignSelf: 'center' }}>{'Decide Later'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
};

export default AllowTrackingInIos;

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    flexWrap: 'wrap',
    textAlign: 'center',
    color: Colors.white,
  },

  desc: {
    alignSelf: 'center',
    fontSize: 14,
    width: 350,
    color: 'gray',
  },
  buttonClass: {
    borderRadius: 50,
    width: 300,
    margin: 'auto',
    marginTop: 30,
    backgroundColor: Colors.brandColor,
    paddingVertical: 15,
  },
});
