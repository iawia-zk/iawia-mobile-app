import { TI18nId } from 'types/common';
import { TSpacing } from 'theme/theme.types';

export type TSegmentedControlProps<T = string> = {
  options: Array<TSegmentedControlOption<T>>;
  value: T;
  onChange: (value: T) => void;
  marginBottom?: keyof TSpacing;
};

export type TSegmentedControlOption<T> = {
  labelId: TI18nId;
  value: T;
};
