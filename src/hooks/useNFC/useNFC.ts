import PassportReader from 'react-native-passport-reader';
import Config from 'react-native-config';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import DataSource from 'enums/DataSource';
import { mockData } from 'constants/mockData';
import { useOnboardingContext } from 'context/OnboardingProvider';

import { PassportData } from './useNFC.types';
import useUserInfo from 'stores/userInfoStore';

interface Inputs {
  passportNumber: string;
  dateOfBirth: string;
  dateOfExpiry: string;
}

function useNFC() {
  const { passportNumber, dateOfBirth, dateOfExpiry } = useUserInfo();
  const isMock = Config.DATA_SOURCE === DataSource.MOCK;

  console.log('isMock', isMock);

  NfcManager.start();

  async function readNFC(): Promise<PassportData | void> {
    try {
      !isMock &&
        (await NfcManager.requestTechnology(NfcTech.Ndef, {
          alertMessage: 'Place your passport',
        }));

      if (isMock) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // TODO: (serhat) implement platform check
      const result = await scanAndroid({ passportNumber, dateOfBirth, dateOfExpiry });

      NfcManager.cancelTechnologyRequest();
      return result;
    } catch (ex) {
      console.warn('Oops!', ex);
      NfcManager.cancelTechnologyRequest();
    }
  }

  async function scanAndroid(inputs: Inputs): Promise<PassportData | void> {
    try {
      if (!isMock) {
        const response = await PassportReader.scan({
          documentNumber: inputs.passportNumber,
          dateOfBirth: inputs.dateOfBirth,
          dateOfExpiry: inputs.dateOfExpiry,
        });

        return response;
      }

      return mockData.mockPassportData;
    } catch (e: any) {
      // TODO: (serhat) handle error
      console.log(e);
    }
  };

  return {
    readNFC,
  };
}

export default useNFC;
