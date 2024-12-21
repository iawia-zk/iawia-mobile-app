import React, { useLayoutEffect } from 'react';

import Box from 'components/core/Box';

import Text from 'components/core/Text';
import { NavigationHeaderStepper } from 'components/Navigation';
import { TNavigationProps } from 'screens/AppNavigation.types';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import { NOOP } from 'constants/noop';

// { navigation }: TNavigationProps<'PassportIdScan'>

function SecurityAttributes({ navigation }: TNavigationProps<'SecurityAttributes'>) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={3} totalSteps={3} {...props} />,
    });
  }, []);

  return (
    <Box flex={1}>
      <ScrollView>
        <Box height={'100%'} backgroundColor={'avatarFire'}>
          <Box height={100} width={'100%'} backgroundColor={'avatarOrchid'} />
          <Box backgroundColor={'textSecondary'}>
            <Text textId="button.cancel" />
          </Box>
          <Text textId="button.cancel" />
        </Box>
      </ScrollView>
      <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
        <Button
          labelId="button.openCamera"
          //   leftIcon={Upload04Icon}
          onPress={() => navigation.navigate('PassportNfcRead')}
        />
        <Button
          labelId="button.manualInput"
          variant="secondary"
          //   leftIcon={Upload04Icon}
          onPress={NOOP}
        />
      </BottomInsetBox>
    </Box>
  );
}

export default SecurityAttributes;
