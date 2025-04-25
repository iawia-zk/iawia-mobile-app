import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Image, Platform, StyleSheet } from 'react-native';

import Box from 'components/core/Box';

import { NavigationHeaderStepper } from 'components/Navigation';
import { TNavigationProps } from 'screens/AppNavigation.types';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import PageHeader from 'components/PageHeader';
import { PassportCamera, PassportCameraProps } from 'components/PassportCamera/PassportCamera';
import IMAGES from 'constants/images';
import useUserInfo from 'stores/userInfoStore';

function PassportIdScan({ navigation }: TNavigationProps<'PassportIdScan'>) {
  const [isPressed, setIsPressed] = useState(false);
  const store = useUserInfo();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={1} totalSteps={3} {...props} />,
    });
  }, []);

  const onPassportRead = useCallback<PassportCameraProps['onPassportRead']>(
    (error, result) => {
      if (error) {
        console.error(error);
        // TODO: Add error handling here
        return;
      }

      if (!result) {
        console.error('No result from passport scan');
        return;
      }

      const { passportNumber, dateOfBirth, dateOfExpiry } = result;

      const formattedDateOfBirth =
        Platform.OS === 'ios' ? formatDateToYYMMDD(dateOfBirth) : dateOfBirth;
      const formattedDateOfExpiry =
        Platform.OS === 'ios' ? formatDateToYYMMDD(dateOfExpiry) : dateOfExpiry;

      store.update({
        passportNumber,
        dateOfBirth: formattedDateOfBirth,
        dateOfExpiry: formattedDateOfExpiry,
      });

      navigation.navigate('PassportNfcRead');
    },
    [store, navigation]
  );

  // function handleCameraOpen() {
  //   console.log('showManualText');
  //   if (showManualText) {
  //     let text = manualText;
  //     if (!text.includes('/n')) {
  //       text = '.\n' + text;
  //     }
  //     onboardingDispatch.setPassportId(text);
  //     // onboardingDispatch.setPassportId(mockData.mockPassportId.id);
  //     navigation.navigate('PassportNfcRead');
  //     return;
  //   }
  // }

  return (
    <Box flex={1}>
      {isPressed ? (
        <PassportCamera onPassportRead={onPassportRead} isMounted={isPressed} />
      ) : (
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
                setIsPressed(true);
              }}
            />
          </BottomInsetBox>
        </Box>
      )}
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
