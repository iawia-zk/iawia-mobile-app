import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Animated from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';

import { FONT_FAMILY } from 'theme/fonts';

import { TTextInputLabelProps } from './TextInputLabel.types';
import { useLabelStyle } from './TextInputLabel.hooks';

function TextInputLabel({ textId, textColor, isPositionTop }: TTextInputLabelProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const animatedStyle = useLabelStyle(isPositionTop);

  return (
    <Animated.Text
      style={[animatedStyle, { color: colors[textColor], fontFamily: FONT_FAMILY.regular }]}
      allowFontScaling={false}>
      {t(textId)}
    </Animated.Text>
  );
}

export default memo(TextInputLabel);
