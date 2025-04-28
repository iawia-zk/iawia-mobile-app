import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import Box from 'components/core/Box';
import Text from 'components/core/Text';

import { TSegmentedControlProps } from './SegmentedControl.types';
import {
  SEGMENTED_CONTROL_ANIMATION_CONFIG,
  SEGMENTED_CONTROL_BORDER_WIDTH,
} from './SegmentedControl.constants';

const AnimatedBox = Animated.createAnimatedComponent(Box);

function SegmentedControl<T>({
  options,
  value,
  onChange,
  marginBottom = 'none',
}: TSegmentedControlProps<T>) {
  const [optionWidth, setOptionWidth] = useState<number>(0);

  const selectedIndex = options.findIndex(({ value: optionValue }) => optionValue === value);

  const indicatorAnimatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: withTiming(optionWidth * selectedIndex, SEGMENTED_CONTROL_ANIMATION_CONFIG) },
      ],
    }),
    [selectedIndex, optionWidth]
  );

  function handleOptionOnPress(optionValue: T) {
    if (optionValue !== value) {
      onChange?.(optionValue);
    }
  }

  function handleSetOptionWidth({ nativeEvent: { layout } }: LayoutChangeEvent) {
    const indicatorWidth = (layout.width - SEGMENTED_CONTROL_BORDER_WIDTH * 2) / options.length;
    setOptionWidth(indicatorWidth);
  }

  return (
    <Box
      position="relative"
      flexDirection="row"
      alignItems="center"
      borderWidth={SEGMENTED_CONTROL_BORDER_WIDTH}
      borderRadius={16}
      borderColor="backgroundSecondary"
      backgroundColor="backgroundSecondary"
      height={40}
      marginBottom={marginBottom}
      onLayout={handleSetOptionWidth}>
      <AnimatedBox
        backgroundColor="backgroundTertiary"
        width={optionWidth}
        style={indicatorAnimatedStyle}
        position="absolute"
        height={36}
        borderRadius={14}
      />
      {options.map(({ labelId, value: optionValue }, i) => {
        const isSelected = optionValue === value;
        return (
          <Pressable
            onPress={() => handleOptionOnPress(optionValue)}
            style={styles.optionContainer}
            key={i}>
            <Text
              textId={labelId}
              variant={isSelected ? 'textBodyBold' : 'textBody'}
              color={isSelected ? 'textPrimary' : 'textSecondary'}
              numberOfLines={1}
            />
          </Pressable>
        );
      })}
    </Box>
  );
}

export default SegmentedControl;

const styles = StyleSheet.create({
  optionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
