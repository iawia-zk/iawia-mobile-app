import { ReactNode } from 'react';

import { TSpacing } from 'theme/theme.types';
import { TBoxProps } from 'components/core/Box/Box.types';

export type TBottomInsetBoxProps = {
  paddingBottom?: keyof TSpacing;
  children: ReactNode;
} & Omit<TBoxProps, 'paddingBottom'>;
