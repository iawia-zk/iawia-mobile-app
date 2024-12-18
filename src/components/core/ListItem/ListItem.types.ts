import { FC } from 'react';

import { TListItemBaseProps } from 'components/core/ListItemBase/ListItemBase.types';
import { TIconBaseProps } from 'types/icon';
import { TSpacing, TThemePrimitives } from 'theme/theme.types';
import { TIconBoxProps } from 'components/core/IconBox/IconBox.types';
import { TBadgeProps } from 'components/core/Badge/Badge.types';

export type TListItemProps = Pick<
  TListItemBaseProps,
  'labelId' | 'descriptionId' | 'labelProps' | 'descriptionProps' | 'onPress' | 'disabled'
> & {
  leftIcon?: FC<TIconBaseProps>;
  rightIcon?: FC<TIconBaseProps>;
  iconColor?: keyof TThemePrimitives;
  iconBackgroundColor?: keyof TThemePrimitives;
  iconBoxProps?: Omit<TIconBoxProps, 'icon'>;
  badgeProps?: TBadgeProps;
  hasError?: boolean;
};

export type TListItemShimmerProps = {
  count?: number;
  gap?: keyof TSpacing;
  hasDescription?: boolean;
  hasLeftIcon?: boolean;
  hasRightIcon?: boolean;
};
