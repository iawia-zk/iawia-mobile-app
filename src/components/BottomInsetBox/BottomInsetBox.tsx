import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Box from 'components/core/Box';

import spacing from 'theme/spacing';

import { TBottomInsetBoxProps } from './BottomInsetBox.types';

function BottomInsetBox({
  backgroundColor = 'backgroundPrimary',
  paddingBottom = 'm',
  children,
  ...rest
}: TBottomInsetBoxProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <Box
      style={{ paddingBottom: bottomInset + spacing[paddingBottom] }}
      backgroundColor={backgroundColor}
      gap="m"
      {...rest}>
      {children}
    </Box>
  );
}

export default BottomInsetBox;
