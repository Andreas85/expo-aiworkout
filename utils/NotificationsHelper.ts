import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGES_KEYS } from './appConstants';

export const getIsAppTrackingTransparencyPermissionAsked = async () => {
  try {
    const permissionsAsked = await AsyncStorage.getItem(STORAGES_KEYS.APP_TRACKING_PERMISSIONS);
    return permissionsAsked ? JSON.parse(permissionsAsked) : null;
  } catch (error) {
    console.error('Error appTracking permissions:', error);
    return {};
  }
};
