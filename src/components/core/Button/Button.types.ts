import { FC } from 'react';
import { PressableProps } from 'react-native';

import { TI18nId } from 'types/common';
import { TSpacing } from 'theme/theme.types';
import { TIconProps } from 'types/icon';
import { TTextVariantKeys, TThemePrimitives } from 'theme/theme.types';
import { TTextProps } from 'components/core/Text/Text.types';
import { TShimmerProps } from 'components/Shimmer/Shimmer.types';

export type TButtonProps = {
  labelId: TI18nId;
  labelValues?: TTextProps['values'];
  rightIcon?: FC<TIconProps>;
  leftIcon?: FC<TIconProps>;
  variant?: TButtonVariants;
  size?: TButtonSize;
  loading?: boolean;
  block?: boolean;
} & PressableProps;

export type TButtonVariants = 'primary' | 'secondary' | 'ghost' | 'success' | 'error';
export type TButtonStates = 'default' | 'onTap' | 'disabled';
export type TButtonStyleProperties = 'background' | 'text' | 'border';

export type TButtonVariantMap = Record<
  TButtonVariants,
  Record<TButtonStates, Record<TButtonStyleProperties, keyof TThemePrimitives>>
>;

export type TButtonSize = 'small' | 'medium' | 'large' | 'xLarge';
export type TButtonSizeProperty = {
  minHeight: number;
  padding: keyof TSpacing;
  iconSize: number;
  borderRadius: number;
  borderWidth: Record<TButtonVariants, number>;
  textVariant: TTextVariantKeys;
};
export type TButtonSizeMap = Record<TButtonSize, TButtonSizeProperty>;

export type TButtonGetStyleProps = {
  variant: TButtonVariants;
  loading: boolean;
  pressed: boolean;
  disabled: PressableProps['disabled'];
};
export type TButtonGetStyleReturn = Record<TButtonStyleProperties, keyof TThemePrimitives>;

export type TButtonGetSizeProps = { size: TButtonSize };

export type TButtonShimmerProps = {
  size?: TButtonProps['size'];
  block?: TButtonProps['block'];
} & TShimmerProps;
