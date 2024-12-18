import React, { useState, memo } from 'react';
import { LayoutChangeEvent } from 'react-native';

import Box from 'components/core/Box';

import { TStepProps } from '../HeaderStepper.types';
import AnimatedStep from './AnimatedStep';

function Step({ active, completed, fillType }: TStepProps) {
  const [width, setWidth] = useState(0);

  function handleOnLayout({ nativeEvent: { layout } }: LayoutChangeEvent) {
    setWidth(Math.ceil(layout.width));
  }

  return (
    <Box
      onLayout={handleOnLayout}
      backgroundColor={completed ? 'buttonPrimary' : 'backgroundSecondaryHover'}
      position="relative"
      height={4}
      flex={1}
      borderRadius={2}
      overflow="hidden">
      {active && width > 0 && <AnimatedStep key={fillType} width={width} fillType={fillType} />}
    </Box>
  );
}

export default memo(Step);
