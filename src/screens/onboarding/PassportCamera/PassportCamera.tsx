import React, { useCallback } from 'react';
import { TNativeCameraProps } from './PassportCamera.types';
import { TNavigationProps } from 'screens/AppNavigation.types';
import { useOnboardingContext } from 'context/OnboardingProvider';
import NativeCamera from './views/NativaCamera';
import { useIsFocused } from '@react-navigation/native';
import Box from 'components/core/Box';

function PassportCamera({ navigation }: TNavigationProps<'PassportCamera'>) {
  const { onboardingDispatch } = useOnboardingContext();
  const isFocused = useIsFocused();

  const onPassportRead = useCallback<TNativeCameraProps['onPassportRead']>(
    (error, result) => {
      // Calculate scan duration in seconds with exactly 2 decimal places

      if (error) {
        console.error(error);
        //TODO: Add error handling here
        return;
      }

      if (!result) {
        console.error('No result from passport scan');
        return;
      }

      onboardingDispatch.setMrzResult(result);

      //   store.update({
      //     passportNumber,
      //     dateOfBirth: formattedDateOfBirth,
      //     dateOfExpiry: formattedDateOfExpiry,
      //   });

      navigation.navigate('PassportNfcRead');
    },
    [navigation]
  );

  return (
    <Box flex={1}>
      <NativeCamera onPassportRead={onPassportRead} isMounted={isFocused} />
    </Box>
  );
}

export default PassportCamera;
