import React from 'react';
import { Path } from 'react-native-svg';
import { useTheme } from '@shopify/restyle';

import Svg from 'components/Svg';

import { TIconProps } from 'types/icon';

function CheckVerified01Icon({
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
        d="m9 12 2 2 4.5-4.5M7.334 3.819a3.832 3.832 0 0 0 2.18-.904 3.832 3.832 0 0 1 4.972 0c.613.523 1.376.84 2.18.904a3.832 3.832 0 0 1 3.515 3.515c.064.804.38 1.567.904 2.18a3.832 3.832 0 0 1 0 4.972 3.832 3.832 0 0 0-.904 2.18 3.832 3.832 0 0 1-3.515 3.515 3.832 3.832 0 0 0-2.18.904 3.832 3.832 0 0 1-4.972 0 3.832 3.832 0 0 0-2.18-.904 3.832 3.832 0 0 1-3.515-3.515 3.832 3.832 0 0 0-.904-2.18 3.832 3.832 0 0 1 0-4.972c.523-.613.84-1.376.904-2.18a3.832 3.832 0 0 1 3.515-3.515Z"
      />
    </Svg>
  );
}

export default CheckVerified01Icon;
