import { TI18nId } from 'types/common';
import { TTextProps } from 'components/core/Text/Text.types';
import { TThemePrimitives } from 'theme/theme.types';
import { TSpacing } from 'theme/theme.types';

export type TCopyInfoItemProps = {
  labelId: TI18nId;
  labelProps?: TTextProps;
  value: string;
  onCopied?: () => void;
  marginBottom?: keyof TSpacing;
  formattedValue?: string;
  isCopyLabelVisible?: boolean;
  valueProps?: TTextProps;
};

export type TCopyInfoItemStatus = 'copied' | 'default';
export type TCopyInfoItemStyleParams = 'valueColor' | 'iconColor';

export type TCopyInfoItemStateStyleMap = Record<
  TCopyInfoItemStatus,
  Record<TCopyInfoItemStyleParams, keyof TThemePrimitives>
>;

export type TCopyInfoItemStateProps = {
  copied: boolean;
};

export type TCopyInfoItemGetStyleReturn = Record<TCopyInfoItemStyleParams, keyof TThemePrimitives>;

export type TCopyInfoItemShimmerProps = {
  count?: number;
  marginBottom?: keyof TSpacing;
};
