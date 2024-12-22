import { StyleSheet } from 'react-native';

import { TAvatarSizeMap } from './Avatar.types';

export const AVATAR_BORDER_WIDTH = StyleSheet.hairlineWidth * 3;
export const AVATAR_BADGE_ALIGNMENT_POSITION = -1;

export const AVATAR_SIZE_MAP: TAvatarSizeMap = {
  currencyBadge: { size: 16, iconSize: 14, imageSize: 16, borderRadius: 8 },
  badge: { size: 16, iconSize: 10, imageSize: 16, borderRadius: 8 },
  small: { size: 40, iconSize: 20, imageSize: 40, borderRadius: 20 },
  medium: { size: 48, iconSize: 24, imageSize: 48, borderRadius: 24 },
  large: { size: 80, iconSize: 24, imageSize: 80, borderRadius: 100 },
};
