import { ReactElement, ReactNode } from 'react';

import { TI18nId } from 'types/common';
import { TTextProps } from 'components/core/Text/Text.types';
import { TThemePrimitives } from 'theme/theme.types';
import { TSpacing } from 'theme/theme.types';
import { StyleProp, ViewStyle } from 'react-native';
import { TBadgeProps } from 'components/core/Badge/Badge.types';

export type TListItemBaseProps = {
  labelId: TI18nId;
  descriptionId?: TI18nId;
  labelProps?: TTextProps;
  descriptionProps?: TTextProps;
  badgeProps?: TBadgeProps;
  left?: ReactNode | ((states: TListItemBaseStates) => ReactElement | undefined);
  right?: ReactNode | ((states: TListItemBaseStates) => ReactElement | undefined);
  onPress?: () => void;
  disabled?: boolean;
  hasArrow?: boolean;
  marginTop?: keyof TSpacing;
  marginBottom?: keyof TSpacing;
  selectedBackground?: keyof TThemePrimitives;
  containerStyle?: StyleProp<ViewStyle>;
  hasError?: boolean;
};

export type TListItemBaseStates = {
  disabled?: boolean;
  pressed?: boolean;
  hasError?: boolean;
};

export type TListItemBaseState = 'onTap' | 'disabled' | 'error' | 'default';
export type TListItemBaseStateMap = Record<
  TListItemBaseState,
  {
    labelColor?: keyof TThemePrimitives;
    descriptionColor?: keyof TThemePrimitives;
    backgroundColor?: keyof TThemePrimitives;
  }
>;
