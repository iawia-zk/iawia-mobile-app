import React, { useCallback, useLayoutEffect, useState } from 'react';

import Box from 'components/core/Box';

import { TNavigationProps } from 'screens/AppNavigation.types';
import { NavigationHeaderStepper } from 'components/Navigation';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import PageHeader from 'components/PageHeader';
import {
  Image,
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
} from 'react-native';
import IMAGES from 'constants/images';
import NfcManager from 'react-native-nfc-manager';
import { PassportData } from 'types/passportData';
import { useFocusEffect } from '@react-navigation/native';
import useNFC from 'hooks/useNFC';
import { checkIfPassportIdExists } from 'helpers/uniquenessService/uniquenessService';
import { useOnboardingContext } from 'context/OnboardingProvider';

const emitter =
  Platform.OS === 'android' ? new NativeEventEmitter(NativeModules.nativeModule) : null;

function PassportNfcRead({ navigation }: TNavigationProps<'PassportNfcRead'>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { onboardingState } = useOnboardingContext();
  const { scan } = useNFC();
  const [isNfcSupported, setIsNfcSupported] = useState(true);
  const [isNfcEnabled, setIsNfcEnabled] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: (props) => <NavigationHeaderStepper currentStep={2} totalSteps={3} {...props} />,
    });
  }, []);

  const checkNfcSupport = useCallback(async () => {
    const isSupported = await NfcManager.isSupported();
    if (isSupported) {
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        setIsNfcEnabled(false);
      }
      setIsNfcSupported(true);
    } else {
      setIsNfcSupported(false);
    }
  }, []);

  const onVerifyPress = useCallback(async () => {
    //In this method, severeal things should be done:
    // 1. Read NFC
    // 2. If NFC read is successful, create a salty hash of the passport id
    // 3. Search for the passport id in the ipfs database
    // 4. If the passport id is found, get wallet address and public key (Phase 2, should be ignored for now)
    // 5. If the passport id is not found, navigate to SecurityAttributes (This page is also be in phase 2 to fetch wallet)
    //    Therefore, we should create wallet, and create a start generating ZK screen to send initial transaction
    //    After the initial transaction is sent, we should store salty passport id hash in ipfs

    await checkIfPassportIdExists('mock_passport_id');
    if (isNfcEnabled) {
      // setIsNfcSheetOpen(true);

      try {
        const { documentNumber, birthDate, expiryDate } = onboardingState;

        if (!documentNumber || !birthDate || !expiryDate) {
          console.error('Passport data is missing');
          return;
        }
        console.log('Starting NFC Scan', documentNumber, birthDate, expiryDate);

        setIsLoading(true);
        const scanResponse = await scan({
          passportNumber: documentNumber,
          dateOfBirth: birthDate,
          dateOfExpiry: expiryDate,
        });

        console.log('NFC Scan Response', scanResponse);

        let passportData: PassportData | null = null;
        try {
          console.log('Parsing NFC Response', passportData);
          // passportData = parseScanResponse(scanResponse);
        } catch (e: any) {
          console.error('Parsing NFC Response Unsuccessful');
          return;
        }
        try {
          // parsedPassportData = initPassportDataParsing(passportData);
          // const passportMetadata = parsedPassportData.passportMetadata!;

          // await storePassportData(parsedPassportData);
          // Feels better somehow
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e: any) {
          console.error('Passport Parsed Failed:', e);
          return;
        }
      } catch (e: any) {
        // const scanDurationSeconds = ((Date.now() - scanStartTime) / 1000).toFixed(2);
        console.error('NFC Scan Unsuccessful:', e);
      } finally {
        setIsLoading(false);
      }
    } else if (isNfcSupported) {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:root=General&path=About');
      } else {
        Linking.sendIntent('android.settings.NFC_SETTINGS');
      }
    }
  }, [isNfcSupported, isNfcEnabled, onboardingState]);

  useFocusEffect(
    useCallback(() => {
      checkNfcSupport();

      if (Platform.OS === 'android' && emitter) {
        const subscription = emitter.addListener('NativeEvent', (event: string) =>
          console.info(event)
        );

        return () => {
          subscription.remove();
        };
      }
    }, [checkNfcSupport])
  );

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
        <Button labelId="button.readyToScan" onPress={onVerifyPress} loading={isLoading} />
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
