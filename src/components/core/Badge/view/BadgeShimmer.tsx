import React from 'react';

import Shimmer from 'components/Shimmer';

import { BADGE_SIZE_MAP } from '../Badge.constants';
import { TBadgeShimmerProps } from '../Badge.types';

function BadgeShimmer({ size }: TBadgeShimmerProps) {
  const { borderRadius, minHeight } = BADGE_SIZE_MAP[size];

  return <Shimmer type="line" width="40%" height={minHeight} borderRadius={borderRadius} />;
}

export default BadgeShimmer;
