import React from 'react';

import Box from 'components/core/Box';
import Shimmer from 'components/Shimmer';

import { LIST_ITEM_BASE_MIN_HEIGHT } from 'components/core/ListItemBase/ListItemBase.constants';

import { LIST_ITEM_ICON_CONTAINER_SIZE } from '../ListItem.constants';
import { TListItemShimmerProps } from '../ListItem.types';

function ListItemShimmer({
  count = 1,
  gap = 's',
  hasDescription,
  hasLeftIcon,
  hasRightIcon,
}: TListItemShimmerProps) {
  return (
    <Box gap={gap}>
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          minHeight={LIST_ITEM_BASE_MIN_HEIGHT}
          flexDirection="row"
          alignItems="center"
          gap="s"
          p="s">
          {hasLeftIcon && (
            <Shimmer
              width={LIST_ITEM_ICON_CONTAINER_SIZE}
              height={LIST_ITEM_ICON_CONTAINER_SIZE}
              type="circle"
              backgroundColor="backgroundPrimary"
            />
          )}
          <Box flex={1}>
            <Shimmer width="50%" height={16} />
            {hasDescription && <Shimmer width="60%" height={12} mt="s" />}
          </Box>
          {hasRightIcon && (
            <Shimmer
              width={LIST_ITEM_ICON_CONTAINER_SIZE}
              height={LIST_ITEM_ICON_CONTAINER_SIZE}
              type="circle"
              backgroundColor="backgroundPrimary"
            />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default ListItemShimmer;
