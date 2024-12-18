import React, { memo, ReactElement } from 'react';
import { Text as NativeText } from 'react-native';
import { Trans } from 'react-i18next';
import { createText } from '@shopify/restyle';

import { TTheme } from 'theme/theme.types';
import { TI18nId } from 'types/common';

import { TTextProps } from './Text.types';

const ThemedText = createText<TTheme>(NativeText);

function Text({
  textId,
  children,
  values,
  variant = 'textBody',
  color = 'textPrimary',
  components,
  ...rest
}: TTextProps): ReactElement {
  return (
    <ThemedText variant={variant} color={color} {...rest}>
      {textId && <Trans<TI18nId> i18nKey={textId} values={values} components={components} />}
      {children}
    </ThemedText>
  );
}

export default memo(Text);
