import { TSpacing } from './theme.types';
import responsiveSize from 'theme/responsiveSize';

const spacing: TSpacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  s: 8,
  sm: 12,
  m: 16,
  ml: 20,
  l: 24,
  xl: responsiveSize(32),
  xxl: responsiveSize(40),
};

export default spacing;
