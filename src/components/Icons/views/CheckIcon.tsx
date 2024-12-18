import React from 'react';
import { Path } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';

import { TIconProps } from 'types/icon';

function CheckIcon({
  width = 24,
  height = 24,
  strokeWidth = 2,
  iconColor = 'textPrimary',
}: TIconProps) {
  const { colors } = useTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        stroke={colors[iconColor]}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        d="M20 6 9 17l-5-5"
      />
    </Svg>
  );
}

export default CheckIcon;
