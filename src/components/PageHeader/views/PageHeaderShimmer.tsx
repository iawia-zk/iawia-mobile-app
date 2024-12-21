import React from 'react';

import { TextShimmer } from 'components/core/Text';

import { TPageHeaderShimmerProps } from '../PageHeader.types';

function PageHeaderShimmer({ mb = 'l' }: TPageHeaderShimmerProps) {
  return (
    <>
      <TextShimmer variant="titleSection" width="75%" mb="s" />
      <TextShimmer variant="textBodySub" mb={mb} width="90%" />
    </>
  );
}

export default PageHeaderShimmer;
