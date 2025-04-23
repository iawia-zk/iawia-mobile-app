import React, { useLayoutEffect, useState, useCallback } from 'react';

import Box from 'components/core/Box';

import { TNavigationProps } from 'screens/AppNavigation.types';
import { NavigationHeaderStepper } from 'components/Navigation';
import ScrollView from 'components/ScrollView';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';
import PageHeader from 'components/PageHeader';
import {
  Image,
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Platform,
  Linking,
} from 'react-native';
import NfcManager from 'react-native-nfc-manager';
import IMAGES from 'constants/images';
import { scan, parseScanResponse } from 'helpers/parseNfc/parseNfc';
import useUserStore from 'stores/userStore';
import { PassportData } from 'helpers/parsePassport/passportData.types';
import { initPassportDataParsing } from 'helpers/parsePassport/generateCommitment';
import { storePassportData } from 'stores/passportDataProvider';
import { useFocusEffect } from '@react-navigation/native';

const emitter =
  Platform.OS === 'android' ? new NativeEventEmitter(NativeModules.nativeModule) : null;

const PassportNfcRead = ({ navigation }: TNavigationProps<'PassportNfcRead'>) => {
  const { passportNumber, dateOfBirth, dateOfExpiry } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isNfcSupported, setIsNfcSupported] = useState(true);
  const [isNfcEnabled, setIsNfcEnabled] = useState(true);
  const [isNfcSheetOpen, setIsNfcSheetOpen] = useState(false);

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
        setDialogMessage('NFC is not enabled. Would you like to enable it in settings?');
        setIsNfcEnabled(false);
      }
      setIsNfcSupported(true);
    } else {
      setDialogMessage("Sorry, your device doesn't seem to have an NFC reader.");
      setIsNfcSupported(false);
    }
  }, []);

  const onVerifyPress = useCallback(async () => {
    if (isNfcEnabled) {
      setIsNfcSheetOpen(true);
      const scanStartTime = Date.now();

      try {
        const response = await scan({
          passportNumber,
          dateOfBirth,
          dateOfExpiry,
        });

        const scanDuration = (Date.now() - scanStartTime / 1000).toFixed(2);
        console.log('Scan duration:', scanDuration, 'seconds');

        let passportData: PassportData | null = null;
        let parsedPassportData: PassportData | null = null;

        try {
          passportData = parseScanResponse(response);
        } catch (e: any) {
          console.error('Error parsing scan response:', e);
          return;
        }

        console.log('Passport data:', passportData);

        try {
          parsedPassportData = initPassportDataParsing(passportData);
          const passportMetadata = parsedPassportData.passportMetadata!;
          console.log('Passport metadata:', passportMetadata);
          await storePassportData(parsedPassportData);

          await new Promise((resolve) => setTimeout(resolve, 1000));
          navigation.navigate('SecurityAttributes');
        } catch (e: any) {
          console.error('Error initializing passport data parsing:', e);
          return;
        }
      } catch (e: any) {
        console.error('Error scanning NFC:', e);
        return;
      } finally {
        setIsNfcSheetOpen(false);
      }
    } else if (isNfcSupported) {
      if (Platform.OS === 'ios') {
        Linking.openURL('App-Prefs:root=General&path=About');
      } else {
        Linking.sendIntent('android.settings.NFC_SETTINGS');
      }
    }
  }, [isNfcSupported, isNfcEnabled, passportNumber, dateOfBirth, dateOfExpiry]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _cancelScanIfRunning = useCallback(async () => {
    // // TODO: cancel if scanning
    // setIsNfcSheetOpen(false);
  }, [isNfcSheetOpen]);

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
        <Button labelId="button.readyToScan" onPress={onVerifyPress} disabled={!isNfcSupported}>
          {isNfcEnabled || !isNfcSupported ? 'Start Scan' : 'Open settings'}
        </Button>
      </BottomInsetBox>
    </Box>
  );
};

export default PassportNfcRead;

const styles = StyleSheet.create({
  image: {
    height: 258,
    resizeMode: 'contain',
  },
});
