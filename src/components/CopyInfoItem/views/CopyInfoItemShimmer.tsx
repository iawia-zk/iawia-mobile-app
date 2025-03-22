import React from 'react';

import Box from 'components/core/Box';
import Shimmer from 'components/Shimmer';

import { COPY_ITEM_MIN_HEIGHT } from '../CopyInfoItem.constants';
import { TCopyInfoItemShimmerProps } from '../CopyInfoItem.types';

function CopyInfoItemShimmer({ count = 1, marginBottom = 'none' }: TCopyInfoItemShimmerProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          minHeight={COPY_ITEM_MIN_HEIGHT}
          flexDirection="row"
          alignItems="center"
          marginBottom={count === i + 1 ? 'none' : marginBottom}>
          <Box flex={1}>
            <Shimmer width="30%" height={14} />
            <Shimmer width="50%" height={14} mt="s" />
          </Box>
          <Box
            alignSelf="stretch"
            justifyContent="flex-end"
            alignItems="flex-end"
            width="40%"
            mb="s">
            <Shimmer width="40%" height={14} />
          </Box>
        </Box>
      ))}
    </>
  );
}

export default CopyInfoItemShimmer;
