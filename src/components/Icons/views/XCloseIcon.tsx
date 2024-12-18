import React from 'react';
import { Path } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';

import { TIconProps } from 'types/icon';

function XCloseIcon({
  width = 24,
  height = 24,
  strokeWidth = 2,
  iconColor = 'textPrimary',
  vectorEffect = 'default',
}: TIconProps) {
  const { colors } = useTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        stroke={colors[iconColor]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M18 6 6 18M6 6l12 12"
        vectorEffect={vectorEffect}
      />
    </Svg>
  );
}

export default XCloseIcon;
