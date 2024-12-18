import React from 'react';

import Box from 'components/core/Box';
import { Bell03Icon } from 'components/Icons';

import { TNavigationHeaderActionsProps } from 'components/Navigation/Navigation.types';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';

function NavigationHeaderActions({ onPressNotification }: TNavigationHeaderActionsProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="m">
      <NavigationHeaderBaseButton onPress={onPressNotification}>
        <Bell03Icon />
      </NavigationHeaderBaseButton>
    </Box>
  );
}

export default NavigationHeaderActions;
