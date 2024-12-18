import React from 'react';

import Box from 'components/core/Box';
import Text from 'components/core/Text';
import HeaderStepper from 'components/HeaderStepper';

import { TNavigationHeaderStepperProps } from './Navigation.types';

function NavigationHeaderStepper({
  children,
  totalSteps,
  currentStep,
  fillType,
}: TNavigationHeaderStepperProps) {
  return (
    <Box height={44} pt="xs">
      <Text variant="textBodySubBold" textAlign="center" mb="xs">
        {children}
      </Text>
      <Box minWidth="80%">
        <HeaderStepper totalSteps={totalSteps} currentStep={currentStep} fillType={fillType} />
      </Box>
    </Box>
  );
}

export default NavigationHeaderStepper;
