import React from 'react';
import { Pressable } from 'react-native';

import ActivityIndicator from 'components/core/ActivityIndicator';
import Text from 'components/core/Text';
import Box from 'components/core/Box';

import { TInfoItemButtonProps } from '../InfoItem.types';

function InfoItemButton({ labelId, icon: Icon, onPress, loading }: TInfoItemButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => {
        const color = pressed ? 'statusNaturalPrimaryOnTap' : 'statusNaturalPrimary';

        return (
          <Box flexDirection="row" alignItems="center" gap="xs">
            <Text textId={labelId} variant="textBodySub" color={color} />
            {loading ? (
              <Box width={24} height={24} alignItems="center" justifyContent="center">
                <ActivityIndicator color="statusNaturalPrimary" size="small" />
              </Box>
            ) : (
              <Icon width={24} height={24} iconColor={color} />
            )}
          </Box>
        );
      }}
    </Pressable>
  );
}

export default InfoItemButton;
