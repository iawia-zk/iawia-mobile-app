import { Platform } from 'react-native';
import { getApiLevel } from 'react-native-device-info';

export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export async function isAndroidAPILevelLowerThan23() {
  const androidAPILevel = await getApiLevel();
  return IS_ANDROID && androidAPILevel < 23;
}
