import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Rect, Stop, LinearGradient } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';
import Box from 'components/core/Box';

import { TThemePrimitives } from 'theme/theme.types';

import {
  SHIMMER_ANIMATION_CONFIG,
  SHIMMER_STYLE_MAP,
  INITIAL_ANIMATION_WIDTH,
} from './Shimmer.constants';
import { TShimmerProps } from './Shimmer.types';

function Shimmer({ width, height, type = 'line', ...rest }: TShimmerProps) {
  const { colors } = useTheme();
  const [animationWidth, setAnimationWidth] = useState(INITIAL_ANIMATION_WIDTH);
  const animationValue = useSharedValue(-1);

  const shimmerStyle = SHIMMER_STYLE_MAP[type];

  useEffect(() => {
    animationValue.value = 1;
  }, []);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: withRepeat(
            withTiming(
              interpolate(
                animationValue.value,
                [-1, 1],
                [-animationWidth, animationWidth],
                Extrapolate.CLAMP
              ),
              SHIMMER_ANIMATION_CONFIG
            ),
            -1
          ),
        },
      ],
    }),
    []
  );

  function getColors(): {
    backgroundColor: keyof TThemePrimitives;
    indicatorBackgroundColor: keyof TThemePrimitives;
  } {
    return {
      backgroundColor: colors.backgroundSecondary,
      indicatorBackgroundColor: colors.backgroundSecondaryHover,
    };
  }

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: layoutWidth },
      },
    }: LayoutChangeEvent) => {
      setAnimationWidth(layoutWidth);
    },
    []
  );

  const { backgroundColor, indicatorBackgroundColor } = getColors();

  return (
    <Box
      style={[
        styles.container,
        shimmerStyle,
        { backgroundColor },
        !!width && { width },
        !!height && { height },
      ]}
      onLayout={handleLayout}
      {...rest}>
      <Animated.View style={[styles.wrapper, shimmerStyle, animatedStyle, styles.wrapperCover]}>
        <Svg>
          <LinearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="0%">
            <Stop offset="0%" stopColor={backgroundColor} />
            <Stop offset="50%" stopColor={indicatorBackgroundColor} />
            <Stop offset="100%" stopColor={backgroundColor} />
          </LinearGradient>
          <Rect fill="url(#grad)" x="0" y="0" width="100%" height="100%" />
        </Svg>
      </Animated.View>
    </Box>
  );
}

export default Shimmer;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    height: 11,
    overflow: 'hidden',
  },
  wrapper: {
    left: 0,
    position: 'absolute',
    top: 0,
    zIndex: 9,
  },
  wrapperCover: {
    width: '100%',
    height: '100%',
  },
});
