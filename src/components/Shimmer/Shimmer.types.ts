import { TBoxProps } from 'components/core/Box/Box.types';

export type TShimmerProps = {
  type?: 'line' | 'rect' | 'circle' | 'cardCircle' | 'card' | 'input' | 'avatar' | 'button';
  width?: string | number;
  height?: string | number;
} & TBoxProps;
