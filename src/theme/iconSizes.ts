import { IS_SMALL_DEVICE } from 'theme/responsiveSize';

const ICON_SIZES = {
  large: IS_SMALL_DEVICE ? 96 : 124,
  medium: IS_SMALL_DEVICE ? 64 : 80,
};

export default ICON_SIZES;
