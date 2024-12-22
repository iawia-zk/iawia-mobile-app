import React, { isValidElement, cloneElement } from 'react';
import { StyleSheet } from 'react-native';
import { isNil } from 'lodash/fp';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TInfoItemProps } from './InfoItem.types';

function InfoItem({
  labelId,
  labelProps,
  descriptionId,
  descriptionProps,
  value,
  valueProps,
  marginBottom,
  flexStart = false,
}: TInfoItemProps) {
  return (
    <Box flexDirection="row" marginBottom={marginBottom}>
      <Box
        mr="xxs"
        gap="xxs"
        justifyContent={descriptionId || flexStart ? 'flex-start' : 'center'}
        flexShrink={1}>
        <Text textId={labelId} variant="textBodySub" color="textSecondary" {...labelProps} />
        {descriptionId && (
          <Text
            style={styles.description}
            textId={descriptionId}
            variant="textBodySubBold"
            {...descriptionProps}
          />
        )}
      </Box>
      {!isNil(value) && (
        <Box justifyContent={descriptionId ? 'flex-end' : 'center'} flexGrow={1} flexShrink={1}>
          {isValidElement(value) ? (
            <Box alignSelf="flex-end">{cloneElement(value)}</Box>
          ) : (
            <Text variant="textBodySubBold" textAlign="right" {...valueProps}>
              {value}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

export default InfoItem;

const styles = StyleSheet.create({
  description: {
    paddingVertical: 1,
  },
});
