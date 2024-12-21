import { TTextProps } from 'components/core/Text/Text.types';
import { TBoxProps } from 'components/core/Box/Box.types';
import { TI18nId } from 'types/common';

export type TPageHeaderProps = {
  titleId: TI18nId;
  titleProps?: TTextProps;
  descriptionId: TI18nId;
  descriptionProps?: TTextProps;
  mb?: TBoxProps['mb'];
};

export type TPageHeaderShimmerProps = {
  mb?: TPageHeaderProps['mb'];
};
