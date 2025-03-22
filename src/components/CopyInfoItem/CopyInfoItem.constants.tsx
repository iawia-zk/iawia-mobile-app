import { TCopyInfoItemStateStyleMap } from 'components/CopyInfoItem/CopyInfoItem.types';

export const COPY_ITEM_MIN_HEIGHT = 48;

export const COPY_STATE_STYLE_MAP: TCopyInfoItemStateStyleMap = {
  copied: {
    valueColor: 'statusPositivePrimary',
    iconColor: 'statusPositivePrimary',
  },
  default: {
    valueColor: 'textPrimary',
    iconColor: 'statusNaturalPrimary',
  },
};
