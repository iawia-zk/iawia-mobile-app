import { Dimensions, PixelRatio, Platform } from 'react-native';
import { memoize } from 'lodash/fp';

export const { height, width } = Dimensions.get('window');

const IPHONE_X_HEIGHT = 812;
const IPHONE_SMALL_DEVICE_HEIGHT = 667;
const ANDROID_SMALL_DEVICE_HEIGHT = 700;

const SMALL_DEVICE_HEIGHT = Platform.select({
  ios: IPHONE_SMALL_DEVICE_HEIGHT,
  android: ANDROID_SMALL_DEVICE_HEIGHT,
  default: 667,
});

export const scaleFactorHeight = height / IPHONE_X_HEIGHT;
export const IS_SMALL_DEVICE = scaleFactorHeight < 1 && height <= SMALL_DEVICE_HEIGHT;

const responsiveSize = memoize((size) => {
  if (IS_SMALL_DEVICE) {
    return getRoundedSize(size, scaleFactorHeight);
  }

  return size;
});

function getRoundedSize(size: number, scale: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export default responsiveSize;
