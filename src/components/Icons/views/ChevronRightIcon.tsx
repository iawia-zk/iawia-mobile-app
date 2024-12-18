import React from 'react';
import { Path } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';

import { TIconProps } from 'types/icon';

function ChevronRightIcon({ width = 24, height = 24, iconColor = 'textPrimary' }: TIconProps) {
  const { colors } = useTheme();

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18L15 12L9 6"
        stroke={colors[iconColor]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
}

export default ChevronRightIcon;
