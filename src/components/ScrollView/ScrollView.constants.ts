import { Dimensions, StatusBar } from 'react-native';
import spacing from 'theme/spacing';
import { IS_ANDROID } from 'constants/platform';

const deviceHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;

export const SCROLL_VIEW_ANDROID_BOTTOM_OFFSET = IS_ANDROID
  ? deviceHeight - windowHeight - (StatusBar.currentHeight ?? 0) + spacing.m
  : 0;
