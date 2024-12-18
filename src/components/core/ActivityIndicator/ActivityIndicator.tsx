import React from 'react';
import { ActivityIndicator as NativeActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { TActivityIndicatorProps } from './ActivityIndicator.types';

function ActivityIndicator({ color = 'textActive', ...rest }: TActivityIndicatorProps) {
  const { colors } = useTheme();

  return <NativeActivityIndicator color={colors[color]} {...rest} />;
}

export default ActivityIndicator;
