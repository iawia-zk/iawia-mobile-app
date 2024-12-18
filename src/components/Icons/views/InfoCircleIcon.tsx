import React from 'react';
import { Path } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';

import { TIconProps } from 'types/icon';

function InfoCircleIcon({
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
        d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}

export default InfoCircleIcon;
