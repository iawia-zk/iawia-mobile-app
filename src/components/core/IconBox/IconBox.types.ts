import { FC } from 'react';

import { TBoxProps } from 'components/core/Box/Box.types';
import { TThemePrimitives } from 'theme/theme.types';
import { TIconBaseProps } from 'types/icon';

export type TIconBoxProps = {
  variant?: TIconBoxVariant;
  containerSize?: TIconContainerSize;
  iconSize?: TIconSize;
  containerProps?: TBoxProps;
  icon: FC<TIconBaseProps>;
  backgroundColor?: keyof TThemePrimitives;
  iconColor?: keyof TThemePrimitives;
  iconProps?: TIconBaseProps;
  loading?: boolean;
  outline?: boolean;
};

export type TIconContainerSize = 'xSmall' | 'small' | 'medium' | 'large';
export type TIconSize = 'small' | 'medium' | 'large';
export type TIconBoxVariant = 'circle' | 'square';

export type TIconContainerSizeMap = Record<TIconContainerSize, TSizeProperty>;
export type TIconSizeMap = Record<TIconSize, TSizeProperty>;

export type TSizeProperty = {
  size: number;
};
