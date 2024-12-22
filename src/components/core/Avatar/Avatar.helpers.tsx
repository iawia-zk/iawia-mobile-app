import { TAvatarSizeProperty, TAvatarGetSizeProps } from './Avatar.types';
import { AVATAR_SIZE_MAP } from './Avatar.constants';

export function getAvatarSize({ size }: TAvatarGetSizeProps): TAvatarSizeProperty {
  return AVATAR_SIZE_MAP[size];
}
