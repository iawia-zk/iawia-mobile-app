import React, { Ref, forwardRef, useMemo } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView as NativeScrollView,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import useScrollBlurHeader from 'hooks/useScrollBlurHeader';
import spacing from 'theme/spacing';

import { TScrollViewProps } from './ScrollView.types';
import { SCROLL_VIEW_ANDROID_BOTTOM_OFFSET } from './ScrollView.constants';

function ScrollView(
  {
    children,
    headerListenerActivated = true,
    backgroundColor = 'backgroundPrimary',
    contentInsetAdjustmentBehavior = 'automatic',
    paddingTop = 'm',
    paddingHorizontal = 'm',
    keyboardAware = false,
    contentStyle,
    onScrollHandlerCallback,
    ...restProps
  }: TScrollViewProps,
  ref: Ref<KeyboardAwareScrollView | NativeScrollView>
) {
  const { colors } = useTheme();
  const { onScrollHandler } = useScrollBlurHeader();

  const ScrollViewComponent = useMemo(
    () => (keyboardAware ? KeyboardAwareScrollView : NativeScrollView),
    []
  );

  function handleOnScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    onScrollHandler(event);
    onScrollHandlerCallback?.(event);
  }

  return (
    <ScrollViewComponent
      ref={ref}
      testID="scrollView"
      style={[
        {
          backgroundColor: colors[backgroundColor],
          paddingHorizontal: spacing[paddingHorizontal],
        },
      ]}
      contentContainerStyle={[
        {
          backgroundColor: colors[backgroundColor],
          paddingTop: spacing[paddingTop],
          paddingBottom: SCROLL_VIEW_ANDROID_BOTTOM_OFFSET,
        },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...restProps}
      {...(headerListenerActivated && { onScroll: handleOnScroll, scrollEventThrottle: 16 })}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}>
      {children}
    </ScrollViewComponent>
  );
}

export default forwardRef(ScrollView);
