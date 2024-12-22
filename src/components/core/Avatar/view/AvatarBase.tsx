import React, { useState } from 'react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import AvatarImage from './AvatarImage';

import { AVATAR_BORDER_WIDTH } from '../Avatar.constants';
import { TAvatarBaseProps } from '../Avatar.types';
import { getAvatarSize } from '../Avatar.helpers';

function AvatarBase({
  label,
  labelColor = 'textInverted',
  icon: Icon,
  iconColor,
  iconVectorEffect,
  iconStrokeWidth,
  imageUrl,
  imageResizeMode,
  borderColor = 'borderOutline',
  backgroundColor = 'backgroundTertiary',
  size = 'medium',
  children,
  cover,
  themeIconColor,
  largeLabel = false,
}: TAvatarBaseProps) {
  const {
    size: avatarSize,
    borderRadius: avatarBorderRadius,
    iconSize: avatarIconSize,
    imageSize: avatarImageSize,
  } = getAvatarSize({ size });
  const [imageLoadedError, setImageLoadedError] = useState<boolean>(false);

  function renderContent() {
    if (imageUrl && !imageLoadedError) {
      return (
        <AvatarImage
          uri={imageUrl}
          size={avatarImageSize}
          borderRadius={avatarBorderRadius}
          onSetImageLoadedError={setImageLoadedError}
          resizeMode={imageResizeMode}
        />
      );
    }

    if (Icon) {
      return (
        <Icon
          width={cover ? avatarImageSize : avatarIconSize}
          height={cover ? avatarImageSize : avatarIconSize}
          iconColor={iconColor}
          themeIconColor={themeIconColor}
          strokeWidth={iconStrokeWidth}
          vectorEffect={iconVectorEffect}
        />
      );
    }

    return (
      <Text
        variant={largeLabel ? 'titleSubsection' : 'textBodySubBold'}
        color={labelColor}
        numberOfLines={1}>
        {label}
      </Text>
    );
  }

  return (
    <Box
      height={avatarSize}
      width={avatarSize}
      borderWidth={AVATAR_BORDER_WIDTH}
      borderRadius={avatarBorderRadius}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      alignItems="center"
      justifyContent="center"
      position="relative">
      {renderContent()}
      {children}
    </Box>
  );
}

export default AvatarBase;
