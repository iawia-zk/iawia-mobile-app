import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import spacing from 'theme/spacing';

import { TNavigationHeaderBaseButtonProps } from '../Navigation.types';

function NavigationHeaderBaseButton({
  style,
  onPress,
  children,
}: TNavigationHeaderBaseButtonProps) {
  const { goBack } = useNavigation();

  function handleOnPress() {
    if (onPress) {
      onPress();
    } else {
      goBack();
    }
  }

  return (
    <TouchableOpacity
      style={style}
      activeOpacity={0.75}
      hitSlop={{
        top: spacing.m,
        bottom: spacing.m,
        left: spacing.m,
        right: spacing.m,
      }}
      onPress={handleOnPress}>
      {children}
    </TouchableOpacity>
  );
}

export default NavigationHeaderBaseButton;
