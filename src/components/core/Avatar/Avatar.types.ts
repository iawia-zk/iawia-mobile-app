import { FC, ReactNode } from 'react';
import { ImageProps } from 'react-native';
import { VectorEffect } from 'react-native-svg';

import { TIconBaseProps } from 'types/icon';
import { TThemePrimitives } from 'theme/theme.types';

export type TAvatarProps = {
  badgeProps?: TAvatarBadgeProps;
} & TAvatarBaseProps;

export type TAvatarBadgeProps = Omit<TAvatarBaseProps, 'label' | 'children'>;
export type TAvatarImageProps = {
  size: number;
  borderRadius: number;
  uri: ImageProps['source'];
  onSetImageLoadedError: (hasError: boolean) => void;
  resizeMode?: ImageProps['resizeMode'];
};
export type TAvatarBaseProps = {
  label?: string;
  labelColor?: keyof TThemePrimitives;
  imageUrl?: ImageProps['source'];
  icon?: FC<TIconBaseProps>;
  iconVectorEffect?: VectorEffect;
  iconStrokeWidth?: number;
  iconColor?: keyof TThemePrimitives;
  themeIconColor?: keyof TThemePrimitives;
  size?: TAvatarSize;
  backgroundColor?: keyof TThemePrimitives;
  borderColor?: keyof TThemePrimitives;
  children?: ReactNode;
  cover?: boolean;
  largeLabel?: boolean;
  imageResizeMode?: TAvatarImageProps['resizeMode'];
};

export type TAvatarSize = 'small' | 'medium' | 'large' | 'badge' | 'currencyBadge';
export type TAvatarSizeProperty = {
  size: number;
  iconSize: number;
  imageSize: number;
  borderRadius: number;
};
export type TAvatarSizeMap = Record<TAvatarSize, TAvatarSizeProperty>;

export type TAvatarGetSizeProps = { size: TAvatarSize };
