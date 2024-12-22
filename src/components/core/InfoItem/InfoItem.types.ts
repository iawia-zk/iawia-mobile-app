import { FC, ReactElement } from 'react';

import { TI18nId } from 'types/common';
import { TTextProps } from 'components/core/Text/Text.types';
import { TSpacing } from 'theme/theme.types';
import { TIconProps } from 'types/icon';

export type TInfoItemProps = {
  labelId: TI18nId;
  labelProps?: TTextProps;
  descriptionId?: TI18nId;
  descriptionProps?: TTextProps;
  value?: string | number | ReactElement;
  valueProps?: TTextProps;
  marginBottom?: keyof TSpacing;
  flexStart?: boolean;
};

export type TInfoItemShimmerProps = {
  count?: number;
  hasDescription?: boolean;
  hasValue?: boolean;
};

export type TInfoItemButtonProps = {
  labelId: TI18nId;
  icon: FC<TIconProps>;
  onPress: () => void;
  loading?: boolean;
};
