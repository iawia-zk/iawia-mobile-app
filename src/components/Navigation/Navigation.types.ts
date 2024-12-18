import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { HeaderButtonProps } from '@react-navigation/elements';

import { THeaderStepperProps } from 'components/HeaderStepper/HeaderStepper.types';

export type TNavigationHeaderStepperProps = {
  children: string | ReactNode;
} & THeaderStepperProps;

export type TNavigationHeaderBaseButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
} & HeaderButtonProps;

export type TNavigationHeaderCloseButtonProps = { isLeft?: boolean } & Omit<
  TNavigationHeaderBaseButtonProps,
  'children'
>;

export type TNavigationHeaderProfileProps = {
  firstName?: string;
  lastName?: string;
} & Omit<TNavigationHeaderBaseButtonProps, 'children'>;

export type TNavigationHeaderActionsProps = {
  onPressNotification: () => void;
};
