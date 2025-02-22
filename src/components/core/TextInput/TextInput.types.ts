import { FC } from 'react';

import { TIconProps } from 'types/icon';
import { TTextInputBaseProps } from 'components/core/TextInputBase/TextInputBase.types';

export type TTextInputProps = {
  rightIcon?: FC<TIconProps>;
} & Omit<TTextInputBaseProps, 'rightComponent' | 'multiline' | 'inputStyle' | 'containerStyle'>;
