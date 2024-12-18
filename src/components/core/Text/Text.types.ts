import { ReactNode } from 'react';
import { StyleProp, TextStyle, TextProps as NativeTextProps } from 'react-native';
import { TextProps } from '@shopify/restyle';
import { TransProps } from 'react-i18next';

import { TI18nId } from 'types/common';
import { TShimmerProps } from 'components/Shimmer/Shimmer.types';
import { TTextVariantKeys, TTheme, TThemePrimitives } from 'theme/theme.types';

export type TTextProps = {
  textId?: TI18nId;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  values?: Record<string, any>;
  variant?: TTextVariantKeys;
  color?: keyof TThemePrimitives;
  components?: TransProps<TI18nId>['components'];
} & Omit<TextProps<TTheme>, 'variant'> &
  NativeTextProps;

export type TTextShimmerProps = { variant?: TTextProps['variant'] } & Omit<
  TShimmerProps,
  'type' | 'color' | 'height'
>;
