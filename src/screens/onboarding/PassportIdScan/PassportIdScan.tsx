import React, { useLayoutEffect } from 'react';
import { Image, StyleSheet } from 'react-native';

import Box from 'components/core/Box';

import { NavigationHeaderStepper } from 'components/Navigation';
import { TNavigationProps } from 'screens/AppNavigation.types';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import PageHeader from 'components/PageHeader';
import IMAGES from 'constants/images';

function PassportIdScan({ navigation }: TNavigationProps<'PassportIdScan'>) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={1} totalSteps={3} {...props} />,
    });
  }, []);

  return (
    <ScrollView>
      <Box flex={1}>
        <ScrollView>
          <Box alignItems="center" mt={'xl'} gap={'l'} flex={1} justifyContent="center">
            <Box>
              <PageHeader
                titleId="screens.passportIdScan.title"
                descriptionId="screens.passportIdScan.description"
              />
            </Box>
            <Image source={IMAGES.passportDrawing} style={styles.image} />
          </Box>
        </ScrollView>
        <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
          <Button
            labelId="button.openCamera"
            onPress={() => {
              navigation.navigate('PassportCamera');
            }}
          />
        </BottomInsetBox>
      </Box>
    </ScrollView>
  );
}

export default PassportIdScan;

const styles = StyleSheet.create({
  image: {
    height: 258,
    resizeMode: 'contain',
  },
});
