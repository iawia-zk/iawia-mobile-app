import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Box from 'components/core/Box';
import Text from 'components/core/Text';
import Badge from 'components/core/Badge';

import ListItemBaseRightArrow from './views/ListItemBaseRightArrow';

import { TListItemBaseProps } from './ListItemBase.types';
import { LIST_ITEM_BASE_MIN_HEIGHT, LIST_ITEM_STATE_BORDER_RADIUS } from './ListItemBase.constants';
import { getListItemStateStyle } from './ListItemBase.helpers';

function ListItemBase({
  labelId,
  labelProps,
  descriptionId,
  descriptionProps,
  badgeProps,
  left,
  right,
  onPress,
  disabled,
  hasArrow,
  marginTop,
  marginBottom,
  selectedBackground,
  containerStyle,
  hasError,
}: TListItemBaseProps) {
  const hasDescription = descriptionId || descriptionProps;

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Pressable onPress={onPress} disabled={disabled || !onPress}>
        {({ pressed }) => {
          const { labelColor, descriptionColor, backgroundColor } = getListItemStateStyle({
            pressed,
            disabled,
            hasError,
          });

          return (
            <>
              <Box
                style={StyleSheet.absoluteFillObject}
                borderRadius={LIST_ITEM_STATE_BORDER_RADIUS}
                backgroundColor={selectedBackground || backgroundColor}
                overflow="hidden"
              />
              <Box
                style={containerStyle}
                flexDirection="row"
                alignItems="center"
                gap="s"
                p="s"
                minHeight={LIST_ITEM_BASE_MIN_HEIGHT}>
                {left && typeof left === 'function' ? left({ pressed, disabled, hasError }) : left}
                <Box justifyContent="center" flex={1} gap="xxs">
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <Text
                      textId={labelId}
                      variant="textBodyBold"
                      color={labelColor}
                      {...labelProps}
                    />
                    {badgeProps && <Badge {...badgeProps} />}
                  </Box>
                  {hasDescription && (
                    <Text
                      textId={descriptionId}
                      variant="textBodySub"
                      color={descriptionColor}
                      {...descriptionProps}
                    />
                  )}
                </Box>
                {right && typeof right === 'function'
                  ? right({ pressed, disabled, hasError })
                  : right}
                {hasArrow && <ListItemBaseRightArrow pressed={pressed} disabled={disabled} />}
              </Box>
            </>
          );
        }}
      </Pressable>
    </Box>
  );
}

export default memo(ListItemBase);
