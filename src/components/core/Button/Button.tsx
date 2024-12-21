import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Box from 'components/core/Box';
import Text from 'components/core/Text';
import ActivityIndicator from 'components/core/ActivityIndicator';

import { TButtonProps } from './Button.types';
import { getButtonSize, getButtonStyle } from './Button.helpers';

function Button({
  labelId,
  labelValues,
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  block = true,
  ...rest
}: TButtonProps) {
  return (
    <Pressable
      style={block ? styles.fitButton : styles.centerButton}
      disabled={disabled || loading}
      {...rest}>
      {({ pressed }) => {
        const buttonStyle = getButtonStyle({ variant, pressed, disabled, loading });
        const buttonSize = getButtonSize({ size });
        const buttonBorderWidth = buttonSize.borderWidth[variant];

        return (
          <Box
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            minHeight={buttonSize.minHeight}
            padding={buttonSize.padding}
            borderWidth={buttonBorderWidth}
            borderRadius={buttonSize.borderRadius}
            borderColor={buttonStyle.border}
            backgroundColor={buttonStyle.background}>
            {loading && (
              <Box
                mr="s"
                alignItems="center"
                justifyContent="center"
                width={buttonSize.iconSize}
                height={buttonSize.iconSize}>
                <ActivityIndicator color={buttonStyle.text} />
              </Box>
            )}
            {!loading && LeftIcon && (
              <Box mr="s">
                <LeftIcon
                  width={buttonSize.iconSize}
                  height={buttonSize.iconSize}
                  iconColor={buttonStyle.text}
                />
              </Box>
            )}
            <Text
              textId={labelId}
              values={labelValues}
              color={buttonStyle.text}
              variant={buttonSize.textVariant}
              numberOfLines={1}
            />
            {RightIcon && (
              <Box ml="s">
                <RightIcon
                  width={buttonSize.iconSize}
                  height={buttonSize.iconSize}
                  iconColor={buttonStyle.text}
                />
              </Box>
            )}
          </Box>
        );
      }}
    </Pressable>
  );
}

export default memo(Button);

const styles = StyleSheet.create({
  centerButton: {
    alignSelf: 'flex-start',
  },
  fitButton: {
    width: '100%',
  },
});
