import React, { memo } from 'react';

import Text from 'components/core/Text';

import { TPageHeaderProps } from './PageHeader.types';

function PageHeader({
  titleId,
  titleProps,
  descriptionId,
  descriptionProps,
  mb = 'l',
}: TPageHeaderProps) {
  return (
    <>
      <Text textId={titleId} {...titleProps} variant="titleSection" mb="s" textAlign="center" />
      <Text
        textId={descriptionId}
        {...descriptionProps}
        textAlign="center"
        variant="textBodySub"
        color="textSecondary"
        mb={mb}
      />
    </>
  );
}

export default memo(PageHeader);
