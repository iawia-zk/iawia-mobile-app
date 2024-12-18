import React from 'react';

import Box from 'components/core/Box';

import Step from './views/Step';
import { THeaderStepperProps } from './HeaderStepper.types';

function HeaderStepper({ totalSteps, currentStep, fillType = 'zeroToFull' }: THeaderStepperProps) {
  return (
    <Box flexDirection="row" alignItems="center" gap="xs">
      {[...Array(totalSteps)]
        .map((_, i) => i + 1)
        .map((step) => (
          <Step
            key={step}
            active={step === currentStep}
            completed={step < currentStep}
            fillType={fillType}
          />
        ))}
    </Box>
  );
}

export default HeaderStepper;
