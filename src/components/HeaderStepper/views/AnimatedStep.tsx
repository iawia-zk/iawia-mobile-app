import React, { useEffect } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import Box from 'components/core/Box';

import { TAnimatedStepProps } from '../HeaderStepper.types';
import { ANIMATION_DELAY_IN_MS, TIMING_ANIMATION_CONFIGURATION } from '../HeaderStepper.constants';

const AnimatedBox = Animated.createAnimatedComponent(Box);

function AnimatedStep({ fillType, width }: TAnimatedStepProps) {
  const animationValue = useSharedValue(getStartPosition());
  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: withDelay(
            ANIMATION_DELAY_IN_MS,
            withTiming(
              interpolate(animationValue.value, [0, 1], [-width, 0]),
              TIMING_ANIMATION_CONFIGURATION
            )
          ),
        },
      ],
    }),
    [fillType, width]
  );

  useEffect(() => {
    animationValue.value = getTargetPosition();
  }, [fillType]);

  function getStartPosition() {
    switch (fillType) {
      case 'halfToFull':
        return 0.5;
      case 'zeroToHalf':
      case 'zeroToFull':
      default:
        return 0;
    }
  }

  function getTargetPosition() {
    switch (fillType) {
      case 'zeroToHalf':
        return 0.5;
      case 'halfToFull':
      case 'zeroToFull':
      default:
        return 1;
    }
  }

  return (
    <AnimatedBox
      height="100%"
      backgroundColor="buttonPrimary"
      width={width}
      style={animatedStyles}
    />
  );
}

export default AnimatedStep;
