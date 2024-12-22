import React from 'react';

import Box from 'components/core/Box';

import { AVATAR_BADGE_ALIGNMENT_POSITION, AVATAR_SIZE_MAP } from '../Avatar.constants';
import { TAvatarBadgeProps } from '../Avatar.types';

import AvatarBase from './AvatarBase';

function AvatarBadge({
  icon,
  iconColor,
  iconVectorEffect,
  iconStrokeWidth,
  imageUrl,
  backgroundColor,
  size: badgeSize = 'badge',
}: TAvatarBadgeProps) {
  const { borderRadius, size } = AVATAR_SIZE_MAP[badgeSize];
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      position="absolute"
      bottom={AVATAR_BADGE_ALIGNMENT_POSITION}
      right={AVATAR_BADGE_ALIGNMENT_POSITION}
      height={size}
      width={size}
      borderRadius={borderRadius}
      backgroundColor="borderOutline">
      <AvatarBase
        size={badgeSize}
        backgroundColor={backgroundColor}
        imageUrl={imageUrl}
        icon={icon}
        iconColor={iconColor}
        iconStrokeWidth={iconStrokeWidth}
        iconVectorEffect={iconVectorEffect}
      />
    </Box>
  );
}

export default AvatarBadge;
