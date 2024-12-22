import React from 'react';

import AvatarBase from './view/AvatarBase';
import AvatarBadge from './view/AvatarBadge';
import { TAvatarProps } from './Avatar.types';

function Avatar({
  size,
  backgroundColor,
  label,
  labelColor,
  imageUrl,
  icon,
  iconColor,
  badgeProps,
  cover,
  borderColor,
  themeIconColor,
  largeLabel,
  imageResizeMode,
}: TAvatarProps) {
  return (
    <AvatarBase
      size={size}
      backgroundColor={backgroundColor}
      label={label}
      imageUrl={imageUrl}
      imageResizeMode={imageResizeMode}
      icon={icon}
      iconColor={iconColor}
      themeIconColor={themeIconColor}
      labelColor={labelColor}
      borderColor={borderColor}
      largeLabel={largeLabel}
      cover={cover}>
      {badgeProps && <AvatarBadge {...badgeProps} />}
    </AvatarBase>
  );
}

export default Avatar;
