import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIsAppTrackingTransparencyPermissionAsked } from './NotificationsHelper';
import { STORAGES_KEYS } from './appConstants';

async function checkIsAppTrackingPersmissionAskedAndUpdated() {
  const isPermissionAsked = await getIsAppTrackingTransparencyPermissionAsked();
  if (!isPermissionAsked) {
    await AsyncStorage.setItem(STORAGES_KEYS.APP_TRACKING_PERMISSIONS, 'true');
  }
}

const Permissionhelper = {
  checkIsAppTrackingPersmissionAskedAndUpdated,
};

export default Permissionhelper;
