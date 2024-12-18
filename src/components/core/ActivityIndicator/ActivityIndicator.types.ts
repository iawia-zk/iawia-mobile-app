import { ActivityIndicatorProps } from 'react-native';

import { TThemePrimitives } from 'theme/theme.types';

export type TActivityIndicatorProps = {
  color?: keyof TThemePrimitives;
} & ActivityIndicatorProps;
