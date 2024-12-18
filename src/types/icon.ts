import { VectorEffect } from 'react-native-svg';

import { TThemePrimitives } from 'theme/theme.types';

export type TIconBaseProps = {
  width?: number | string;
  height?: number | string;
  strokeWidth?: number;
  iconColor?: keyof TThemePrimitives;
  themeIconColor?: keyof TThemePrimitives;
  staticIconColor?: string;
  vectorEffect?: VectorEffect;
  pathColor?: {
    fill1?: string;
    fill2?: string;
    fill3?: string;
    fill4?: string;
    fill5?: string;
    fill6?: string;
  };
};

export type TIconProps = TIconBaseProps;
