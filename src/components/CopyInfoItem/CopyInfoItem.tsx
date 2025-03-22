import React, { useState } from 'react';
import { Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { Copy07Icon, FileCheck03Icon } from 'components/Icons';

import useTimeout from 'hooks/useTimeout';

import { getCopyInfoItemStyle } from './CopyInfoItem.helpers';
import { TCopyInfoItemProps } from './CopyInfoItem.types';

function CopyInfoItem({
  labelId,
  labelProps,
  formattedValue,
  value,
  valueProps,
  onCopied,
  marginBottom,
  isCopyLabelVisible = true,
}: TCopyInfoItemProps) {
  const [copied, setCopy] = useState(false);
  const [startTimeout] = useTimeout({
    delay: 750,
    callback: () => setCopy(false),
    autoStart: false,
  });
  const copyInfoItemStyle = getCopyInfoItemStyle({ copied });
  const Icon = copied ? FileCheck03Icon : Copy07Icon;

  function handleCopy() {
    Clipboard.setString(value);
    setCopy(true);
    startTimeout(true);
    onCopied?.();
  }

  return (
    <Box marginBottom={marginBottom}>
      <Pressable onPress={handleCopy}>
        <Text textId={labelId} variant="textBodySub" color="textSecondary" {...labelProps} />
        <Box flexDirection="row" alignItems="center" mt="xxs">
          <Box flex={1} mr="s">
            <Text variant="textBodySubBold" color={copyInfoItemStyle.valueColor} {...valueProps}>
              {formattedValue || value}
            </Text>
          </Box>
          <Box alignSelf="flex-start" flexDirection="row" alignItems="center">
            {isCopyLabelVisible && (
              <Text
                textId={copied ? 'label.copied' : 'label.copy'}
                variant="textBodySub"
                color={copyInfoItemStyle.iconColor}
                mr="xs"
              />
            )}
            <Icon iconColor={copyInfoItemStyle.iconColor} />
          </Box>
        </Box>
      </Pressable>
    </Box>
  );
}

export default CopyInfoItem;
