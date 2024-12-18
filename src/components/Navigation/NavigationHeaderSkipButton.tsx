import React from 'react';

import Text from 'components/core/Text';

import NavigationHeaderBaseButton from './views/NavigationHeaderBaseButton';

function NavigationHeaderSkipButton() {
  return (
    <NavigationHeaderBaseButton>
      <Text textId="button.skip" variant="textBodySub" color="textActive" />
    </NavigationHeaderBaseButton>
  );
}

export default NavigationHeaderSkipButton;
