import React from 'react';
import { StyleSheet } from 'react-native';

import Box from 'components/core/Box';
import { XCloseIcon } from 'components/Icons';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';
import { TNavigationHeaderCloseButtonProps } from './Navigation.types';

function NavigationHeaderCloseButton({ onPress, isLeft }: TNavigationHeaderCloseButtonProps) {
  return (
    <NavigationHeaderBaseButton
      style={[styles.button, isLeft ? styles.left : styles.right]}
      onPress={onPress}>
      <Box width={24} height={24}>
        <XCloseIcon width={24} height={24} />
      </Box>
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderCloseButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  right: {
    right: 0,
  },
});
