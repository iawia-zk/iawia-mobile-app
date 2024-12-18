import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'components/core/Text';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';
import { TNavigationHeaderCloseButtonProps } from './Navigation.types';

function NavigationHeaderDoneButton({ onPress }: TNavigationHeaderCloseButtonProps) {
  return (
    <NavigationHeaderBaseButton style={styles.button} onPress={onPress}>
      <Text textId="button.done" color="textActive" variant="textBodySub" />
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderDoneButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 0,
  },
});
