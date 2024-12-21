import React from 'react';

import Shimmer from 'components/Shimmer';

import { TButtonShimmerProps } from '../Button.types';
import { getButtonSize } from 'components/core/Button/Button.helpers';

function ButtonShimmer({ size = 'medium', block = true, ...rest }: TButtonShimmerProps) {
  const buttonSize = getButtonSize({ size });

  return (
    <Shimmer type="button" width={block ? '100%' : '40%'} height={buttonSize.minHeight} {...rest} />
  );
}

export default ButtonShimmer;
