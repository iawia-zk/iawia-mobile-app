import { ReactNode } from 'react';
import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

import { TI18nId } from 'types/common';

export type TTextInputBaseProps = {
  labelId: TI18nId;
  placeholderId: TI18nId;
  hasError: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  rightComponent?: ReactNode;
} & Omit<TextInputProps, 'placeholder' | 'style'>;

export type TGetBackgroundColorParams = {
  hasError: TTextInputBaseProps['hasError'];
  isFocused: boolean;
  editable: TTextInputBaseProps['editable'];
};
export type TGetBorderColorParams = {
  hasError: TTextInputBaseProps['hasError'];
  isFocused: boolean;
  editable: TTextInputBaseProps['editable'];
};

export type TGetLabelColorParams = {
  hasError: TTextInputBaseProps['hasError'];
  isFocused: boolean;
  editable: TTextInputBaseProps['editable'];
};

export type TGetInputColorParams = {
  editable: TTextInputBaseProps['editable'];
};
