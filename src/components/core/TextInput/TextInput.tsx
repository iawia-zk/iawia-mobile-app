import React, { forwardRef, Ref } from 'react';
import { StyleSheet, TextInput as NativeTextInput } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from 'components/core/Box';
import TextInputBase from 'components/core/TextInputBase';

import spacing from 'theme/spacing';
import { getInputColor } from 'components/core/TextInputBase/TextInputBase.helpers';
import { TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING } from 'components/core/TextInputBase/TextInputBase.constants';

import { ICON_SIZE, TEXT_INPUT_HEIGHT } from './TextInput.constants';
import { TTextInputProps } from './TextInput.types';

function TextInput(
  { rightIcon: RightIcon, editable, ...rest }: TTextInputProps,
  ref: Ref<NativeTextInput>
) {
  const { colors } = useTheme();

  function renderRightIcon() {
    if (!RightIcon) {
      return <></>;
    }

    return (
      <Box
        position="absolute"
        right={spacing.m}
        top={TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING}
        paddingVertical="s">
        <RightIcon
          width={ICON_SIZE}
          height={ICON_SIZE}
          iconColor={colors[getInputColor({ editable })]}
        />
      </Box>
    );
  }

  return (
    <TextInputBase
      ref={ref}
      editable={editable}
      {...rest}
      inputStyle={[styles.input, RightIcon && styles.inputWithRightIcon]}
      containerStyle={styles.inputContainer}
      rightComponent={renderRightIcon()}
    />
  );
}

export default forwardRef(TextInput);

const styles = StyleSheet.create({
  inputContainer: {
    height: TEXT_INPUT_HEIGHT,
  },
  input: {
    height: TEXT_INPUT_HEIGHT,
  },
  inputWithRightIcon: {
    paddingRight: spacing.s + ICON_SIZE + spacing.m,
  },
});
