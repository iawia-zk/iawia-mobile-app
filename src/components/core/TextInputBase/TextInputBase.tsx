import React, { useState, forwardRef, Ref } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputFocusEventData,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useTranslation } from 'react-i18next';

import TextInputLabel from 'components/core/TextInputLabel';
import Box from 'components/core/Box';

import spacing from 'theme/spacing';
import { textVariants } from 'theme/variants';
import { IS_IOS } from 'constants/platform';

import {
  getBackgroundColor,
  getBorderColor,
  getInputColor,
  getLabelColor,
} from './TextInputBase.helpers';
import { TTextInputBaseProps } from './TextInputBase.types';
import {
  TEXT_INPUT_BASE_INPUT_BORDER_RADIUS,
  TEXT_INPUT_BASE_INPUT_HEIGHT,
  TEXT_INPUT_BASE_INPUT_PADDING_TOP,
  TEXT_INPUT_BASE_LINE_HEIGHT,
  TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING,
} from './TextInputBase.constants';

function TextInputBase(
  {
    labelId,
    placeholderId,
    hasError,
    autoFocus = false,
    onFocus,
    onBlur,
    value,
    autoCorrect = false,
    editable = true,
    containerStyle,
    inputStyle,
    rightComponent,
    ...rest
  }: TTextInputBaseProps,
  ref: Ref<NativeTextInput>
) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(autoFocus);

  function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    onFocus?.(e);
    setIsFocused(true);
  }

  function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    onBlur?.(e);
    setIsFocused(false);
  }

  const isPlaceholderVisible = !value && isFocused;

  return (
    <Box
      width={'100%'}
      style={[styles.inputContainer, containerStyle]}
      borderWidth={StyleSheet.hairlineWidth * 3}
      borderColor={getBorderColor({ isFocused, hasError, editable })}
      backgroundColor={getBackgroundColor({ isFocused, hasError, editable })}
      overflow="hidden">
      <Box
        style={styles.labelWrapper}
        pointerEvents="none"
        backgroundColor={getBackgroundColor({ isFocused, hasError, editable })}>
        <TextInputLabel
          textId={labelId}
          textColor={getLabelColor({ isFocused, hasError, editable })}
          isPositionTop={!!value || isFocused}
        />
      </Box>
      <NativeTextInput
        ref={ref}
        style={[styles.input, { color: colors[getInputColor({ editable })] }, inputStyle]}
        autoFocus={autoFocus}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={t(placeholderId)}
        placeholderTextColor={isPlaceholderVisible ? colors.textPassive : colors.transparent}
        value={value}
        autoCorrect={autoCorrect}
        underlineColorAndroid={colors.transparent}
        editable={editable}
        {...(IS_IOS && {
          selectionColor: colors.textActive,
        })}
        cursorColor={colors.textActive}
        {...rest}
      />
      {rightComponent}
    </Box>
  );
}

export default forwardRef(TextInputBase);

const styles = StyleSheet.create({
  inputContainer: {
    height: TEXT_INPUT_BASE_INPUT_HEIGHT,
    borderRadius: TEXT_INPUT_BASE_INPUT_BORDER_RADIUS,
  },
  input: {
    height: TEXT_INPUT_BASE_INPUT_HEIGHT,
    borderRadius: TEXT_INPUT_BASE_INPUT_BORDER_RADIUS,
    paddingHorizontal: spacing.m,
    paddingBottom: TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING,
    paddingTop: TEXT_INPUT_BASE_INPUT_PADDING_TOP,
    fontFamily: textVariants.textBodySubBold.fontFamily,
    fontSize: textVariants.textBodySubBold.fontSize,
    lineHeight: TEXT_INPUT_BASE_LINE_HEIGHT,
  },
  labelWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingTop: TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING,
    paddingLeft: spacing.m,
  },
});
