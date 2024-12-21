import { ReactNode } from 'react';
import { ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import { KeyboardAwareProps } from 'react-native-keyboard-aware-scroll-view';
import { AnimatedProps } from 'react-native-reanimated';

import { TThemePrimitives } from 'theme/theme.types';
import { TSpacing } from 'theme/theme.types';

export type TScrollViewProps = {
  children?: ReactNode;
  headerListenerActivated?: boolean;
  backgroundColor?: keyof TThemePrimitives;
  paddingHorizontal?: keyof TSpacing;
  paddingTop?: keyof TSpacing;
  keyboardAware?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onScrollHandlerCallback?: ScrollViewProps['onScroll'];
} & ScrollViewProps &
  KeyboardAwareProps &
  AnimatedProps<ScrollViewProps>;
