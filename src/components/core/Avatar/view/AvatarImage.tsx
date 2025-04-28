import React, { useState, memo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Shimmer from 'components/Shimmer';
import Box from 'components/core/Box';

import { AVATAR_BORDER_WIDTH } from '../Avatar.constants';
import { TAvatarImageProps } from '../Avatar.types';

function AvatarImage({
  size,
  borderRadius,
  uri,
  onSetImageLoadedError,
  resizeMode = 'contain',
}: TAvatarImageProps) {
  const { colors } = useTheme();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <>
      {imageLoading && (
        <Box style={StyleSheet.absoluteFillObject} zIndex={1}>
          <Shimmer type="circle" width={size} height={size} />
        </Box>
      )}
      <Image
        style={{
          width: size,
          height: size,
          borderRadius: borderRadius,
          borderWidth: AVATAR_BORDER_WIDTH,
          borderColor: colors.borderOutline,
        }}
        resizeMode={resizeMode}
        source={uri}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => onSetImageLoadedError(true)}
      />
    </>
  );
}

export default memo(AvatarImage);
