import { FC } from 'react';

import { TI18nId } from 'types/common';
import { TIconProps } from 'types/icon';
import { TTextVariantKeys, TThemePrimitives } from 'theme/theme.types';
import { TSpacing } from 'theme/theme.types';
import { TTextProps } from 'components/core/Text/Text.types';

export type TBadgeShimmerProps = {
  size: TBadgeSize;
};

export type TBadgeProps = {
  labelId: TI18nId;
  labelProps?: TTextProps;
  variant: TBadgeVariant;
  size: TBadgeSize;
  icon?: FC<TIconProps>;
};

export type TBadgeVariant = 'success' | 'info' | 'warning' | 'danger' | 'natural';
export type TBadgeVariantMap = Record<
  TBadgeVariant,
  {
    color: keyof TThemePrimitives;
    backgroundColor: keyof TThemePrimitives;
    defaultIcon?: FC<TIconProps>;
  }
>;

export type TBadgeSize = 'small' | 'medium' | 'large';
export type TBadgeSizeMap = Record<
  TBadgeSize,
  {
    paddingX: keyof TSpacing;
    paddingY: keyof TSpacing;
    borderRadius: number;
    textVariant: TTextVariantKeys;
    iconSize: number;
    minHeight: number;
  }
>;
