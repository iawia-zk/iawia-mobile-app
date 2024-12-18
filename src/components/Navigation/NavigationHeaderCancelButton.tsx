import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'components/core/Text';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';
import { TNavigationHeaderCloseButtonProps } from './Navigation.types';

function NavigationHeaderCancelButton({ onPress }: TNavigationHeaderCloseButtonProps) {
  return (
    <NavigationHeaderBaseButton style={styles.button} onPress={onPress}>
      <Text textId="button.cancel" color="textActive" variant="textBodySub" />
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderCancelButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0,
  },
});
