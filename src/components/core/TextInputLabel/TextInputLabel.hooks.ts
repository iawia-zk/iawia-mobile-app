import { PixelRatio } from 'react-native';
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

import { ANIMATED_VALUE, LABEL_POSITION_FONT } from './TextInputLabel.constants';
import { TUseLabelStyle } from './TextInputLabel.types';

function useLabelStyle(isPositionTop: boolean): TUseLabelStyle {
  const animatedLabelPosition = useDerivedValue(
    () =>
      withTiming(isPositionTop ? ANIMATED_VALUE.TOP : ANIMATED_VALUE.DEFAULT, {
        duration: 150,
        easing: Easing.inOut(Easing.ease),
      }),
    [isPositionTop]
  );

  const topFontSize = Math.round(LABEL_POSITION_FONT.DEFAULT.fontSize * PixelRatio.getFontScale());
  const defaultFontsize = Math.round(LABEL_POSITION_FONT.TOP.fontSize * PixelRatio.getFontScale());
  const topTranslateY = PixelRatio.getFontScale() < 1 ? 0 : -1;

  return useAnimatedStyle(() => ({
    fontSize: interpolate(
      animatedLabelPosition.value,
      [ANIMATED_VALUE.DEFAULT, ANIMATED_VALUE.TOP],
      [topFontSize, defaultFontsize],
      {
        extrapolateRight: Extrapolation.CLAMP,
      }
    ),
    lineHeight: interpolate(
      animatedLabelPosition.value,
      [ANIMATED_VALUE.DEFAULT, ANIMATED_VALUE.TOP],
      [LABEL_POSITION_FONT.DEFAULT.lineHeight, LABEL_POSITION_FONT.TOP.lineHeight],
      {
        extrapolateRight: Extrapolation.CLAMP,
      }
    ),
    transform: [
      {
        translateY: interpolate(
          animatedLabelPosition.value,
          [ANIMATED_VALUE.DEFAULT, ANIMATED_VALUE.TOP],
          [8, topTranslateY]
        ),
      },
    ],
  }));
}

export { useLabelStyle };
