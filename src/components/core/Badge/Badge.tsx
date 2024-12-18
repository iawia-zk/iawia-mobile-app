import React, { memo } from 'react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TBadgeProps } from './Badge.types';
import { BADGE_SIZE_MAP, BADGE_VARIANT_MAP } from './Badge.constants';

function Badge({ labelId, labelProps, variant, size, icon }: TBadgeProps) {
  const { color, defaultIcon, backgroundColor } = BADGE_VARIANT_MAP[variant];
  const { paddingX, paddingY, iconSize, textVariant, borderRadius, minHeight } =
    BADGE_SIZE_MAP[size];
  const Icon = icon || defaultIcon;

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      height={minHeight}
      minHeight={minHeight}
      py={paddingY}
      px={Icon ? paddingX : 's'}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      gap="xs">
      {Icon && <Icon width={iconSize} height={iconSize} iconColor={color} />}
      <Text textId={labelId} variant={textVariant} color={color} {...labelProps} />
    </Box>
  );
}

export default memo(Badge);
