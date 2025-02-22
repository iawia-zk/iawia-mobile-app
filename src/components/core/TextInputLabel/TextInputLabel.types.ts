import { TThemePrimitives } from 'theme/theme.types';
import { TI18nId } from 'types/common';

export type TTextInputLabelProps = {
  textId: TI18nId;
  textColor: keyof TThemePrimitives;
  isPositionTop: boolean;
};

export type TUseLabelStyle = {
  fontSize: number;
  lineHeight: number;
  transform: [{ translateY: number }];
};
