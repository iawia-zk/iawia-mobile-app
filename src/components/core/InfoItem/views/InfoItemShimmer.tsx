import React from 'react';

import Box from 'components/core/Box';
import Shimmer from 'components/Shimmer';

import { ONLY_VALUE_MIN_HEIGHT, WITH_DESCRIPTION_MIN_HEIGHT } from '../InfoItem.constants';
import { TInfoItemShimmerProps } from '../InfoItem.types';

function InfoItemShimmer({ count = 1, hasDescription, hasValue = true }: TInfoItemShimmerProps) {
  return (
    <Box gap="m">
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          minHeight={hasDescription ? WITH_DESCRIPTION_MIN_HEIGHT : ONLY_VALUE_MIN_HEIGHT}
          flexDirection="row"
          alignItems="center">
          <Box flex={1}>
            <Shimmer width="50%" height={14} />
            {hasDescription && <Shimmer width="70%" height={14} mt="s" />}
          </Box>
          {hasValue && (
            <Box
              alignSelf="stretch"
              justifyContent={hasDescription ? 'flex-end' : 'center'}
              alignItems="flex-end"
              width="40%">
              <Shimmer width="40%" height={14} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default InfoItemShimmer;
