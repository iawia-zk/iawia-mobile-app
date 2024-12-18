import React from 'react';
import { StyleSheet } from 'react-native';

import { ArrowLeftIcon } from 'components/Icons';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';
import { TNavigationHeaderCloseButtonProps } from './Navigation.types';

function NavigationHeaderBackButton({ onPress }: TNavigationHeaderCloseButtonProps) {
  return (
    <NavigationHeaderBaseButton style={styles.button} onPress={onPress}>
      <ArrowLeftIcon width={24} height={24} />
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderBackButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 0,
  },
});
