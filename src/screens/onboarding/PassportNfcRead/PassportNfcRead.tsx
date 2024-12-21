import React, { useLayoutEffect } from 'react';

import Box from 'components/core/Box';

import { TNavigationProps } from 'screens/AppNavigation.types';
import { NavigationHeaderStepper } from 'components/Navigation';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import { NOOP } from 'constants/noop';
import PageHeader from 'components/PageHeader';
import { Image, StyleSheet } from 'react-native';
import IMAGES from 'constants/images';

function PassportNfcRead({ navigation }: TNavigationProps<'PassportNfcRead'>) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={2} totalSteps={3} {...props} />,
    });
  }, []);

  return (
    <Box flex={1}>
      <ScrollView>
        <Box alignItems="center" mt={'xl'} gap={'l'} flex={1} justifyContent="center">
          <Box>
            <PageHeader
              titleId="screens.passportNfcRead.title"
              descriptionId="screens.passportNfcRead.description"
            />
          </Box>
          <Image source={IMAGES.passportLastpage} style={styles.image} />
        </Box>
      </ScrollView>
      <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
        <Button labelId="button.readyToScan" onPress={NOOP} />
      </BottomInsetBox>
    </Box>
  );
}

export default PassportNfcRead;

const styles = StyleSheet.create({
  image: {
    height: 258,
    resizeMode: 'contain',
  },
});
