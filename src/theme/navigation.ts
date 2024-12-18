import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { FONT_FAMILY } from 'theme/fonts';
import { IS_IOS } from 'constants/platform';

export const DEFAULT_STACK_NAVIGATION_OPTIONS: NativeStackNavigationOptions = {
  headerTransparent: IS_IOS,
  headerBlurEffect: 'systemUltraThinMaterialLight',
  headerTitleStyle: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 16,
  },
  headerShadowVisible: false,
  headerBackVisible: false,
  headerBackTitleVisible: false,
  headerTitleAlign: 'center',
};

export const SLIDE_FROM_RIGHT_ANIMATION = IS_IOS ? 'simple_push' : 'slide_from_right';

export const MODAL_SLIDE_FROM_BOTTOM: NativeStackNavigationOptions = {
  animation: 'slide_from_bottom',
  gestureDirection: 'vertical',
  fullScreenGestureEnabled: true,
};

export const CHILD_STACK_PREFIX: string = 'child-stack';
