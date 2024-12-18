import React from 'react';
import { StyleSheet } from 'react-native';

import Text from 'components/core/Text';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';
import { TNavigationHeaderCloseButtonProps } from './Navigation.types';

function NavigationHeaderClearButton({ onPress }: TNavigationHeaderCloseButtonProps) {
  return (
    <NavigationHeaderBaseButton style={styles.right} onPress={onPress}>
      <Text textId="button.clear" color="textActive" variant="textBodySub" />
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderClearButton;

const styles = StyleSheet.create({
  right: {
    position: 'absolute',
    right: 0,
  },
});
