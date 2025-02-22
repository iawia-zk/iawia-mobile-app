import React, { useEffect, useLayoutEffect } from 'react';

import Box from 'components/core/Box';

import { NavigationHeaderStepper } from 'components/Navigation';
import { TNavigationProps } from 'screens/AppNavigation.types';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import PageHeader from 'components/PageHeader';
import { Image, StyleSheet } from 'react-native';
import IMAGES from 'constants/images';
import { useOnboardingContext } from 'context/OnboardingProvider';
import { mockData } from 'constants/mockData';
import TextInput from 'components/core/TextInput';

function PassportIdScan({ navigation }: TNavigationProps<'PassportIdScan'>) {
  const { onboardingDispatch } = useOnboardingContext();
  const [showManualText, setShowManualText] = React.useState(false);
  const [manualText, setManualText] = React.useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={1} totalSteps={3} {...props} />,
    });
  }, []);

  useEffect(() => {
    onboardingDispatch.setPassportId(mockData.mockPassportId.id);
  }, []);

  function handleCameraOpen() {
    console.log('showManualText');
    if (showManualText) {
      let text = manualText;
      if (!text.includes('/n')) {
        text = '.\n' + text;
      }
      onboardingDispatch.setPassportId(text);
      // onboardingDispatch.setPassportId(mockData.mockPassportId.id);
      navigation.navigate('PassportNfcRead');
      return;
    }

    setShowManualText(true);
  }

  return (
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
          {showManualText && (
            <TextInput
              labelId="button.manualInput"
              placeholderId="button.manualInput"
              value={manualText}
              onChangeText={setManualText}
              hasError={false}
            />
          )}
        </Box>
      </ScrollView>
      <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
        <Button labelId="button.openCamera" onPress={handleCameraOpen} />
        <Button
          labelId={!showManualText ? 'button.manualInput' : 'button.proceed'}
          variant="secondary"
          onPress={handleCameraOpen}
        />
      </BottomInsetBox>
    </Box>
  );
}

export default PassportIdScan;

const styles = StyleSheet.create({
  image: {
    height: 258,
    resizeMode: 'contain',
  },
});
