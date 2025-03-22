// @ts-ignore
import PassportReader from 'react-native-passport-reader';
import Config from 'react-native-config';
import NfcManager from 'react-native-nfc-manager';

import extractMRZInfo from 'helpers/extractMrz';
import DataSource from 'enums/DataSource';
import { mockData } from 'constants/mockData';
import { useOnboardingContext } from 'context/OnboardingProvider';

import { PassportData } from './useNFC.types';

function useNFC() {
  const { onboardingState } = useOnboardingContext();
  const isMock = Config.DATA_SOURCE === DataSource.MOCK;

  console.log('isMock', isMock);

  NfcManager.start();

  async function readNFC(): Promise<PassportData | void> {
    try {
      // !isMock &&
      //   (await NfcManager.requestTechnology(NfcTech.Ndef, {
      //     alertMessage: 'Place your passport',
      //   }));

      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // TODO: (serhat) implement platform check
      const result = await scanAndroid();

      NfcManager.cancelTechnologyRequest();
      return result;
    } catch (ex) {
      console.warn('Oops!', ex);
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function scanAndroid(): Promise<PassportData | void> {
    const passportId = onboardingState.passportId ?? '';

    const { documentNumber, birthDate, expiryDate } = extractMRZInfo(passportId);

    try {
      if (!isMock) {
        const response = await PassportReader.scan({
          documentNumber: documentNumber,
          dateOfBirth: birthDate,
          dateOfExpiry: expiryDate,
        });

        return response;
      }

      return mockData.mockPassportData;
    } catch (e: any) {
      // TODO: (serhat) handle error
      console.log(e);
    }
  }

  return {
    readNFC,
  };
}

export default useNFC;
