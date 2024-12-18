import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import Box from 'components/core/Box';
import ActivityIndicator from 'components/core/ActivityIndicator';

import { TIconBoxProps } from './IconBox.types';
import { ICON_BOX_CONTAINER_SIZE, ICON_SIZE } from './IconBox.constants';

function IconBox({
  variant = 'circle',
  containerSize = 'medium',
  iconSize = 'small',
  icon: Icon,
  iconColor,
  backgroundColor = 'buttonGhostPrimary',
  loading,
  iconProps,
  containerProps,
  outline = false,
}: TIconBoxProps) {
  const containerSizeValue = ICON_BOX_CONTAINER_SIZE[containerSize].size;
  const iconSizeValue = ICON_SIZE[iconSize].size;

  return (
    <Box
      width={containerSizeValue}
      height={containerSizeValue}
      borderRadius={variant === 'circle' ? containerSizeValue : 12}
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
      borderColor="borderOutline"
      borderWidth={outline ? StyleSheet.hairlineWidth * 3 : 0}
      {...containerProps}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Icon width={iconSizeValue} height={iconSizeValue} iconColor={iconColor} {...iconProps} />
      )}
    </Box>
  );
}

export default memo(IconBox);
