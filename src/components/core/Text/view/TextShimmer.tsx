import React from 'react';
import { useTheme } from '@shopify/restyle';

import Shimmer from 'components/Shimmer';

import { TTextShimmerProps } from '../Text.types';

function TextShimmer({ variant = 'textBody', ...rest }: TTextShimmerProps) {
  const { textVariants } = useTheme();

  return <Shimmer type="line" height={textVariants[variant].lineHeight} {...rest} />;
}

export default TextShimmer;
