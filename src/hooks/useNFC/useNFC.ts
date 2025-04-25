import { useEffect } from 'react';
import PassportReader from 'react-native-passport-reader';
import Config from 'react-native-config';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

import DataSource from 'enums/DataSource';
import { mockData } from 'constants/mockData';

import { PassportData } from './useNFC.types';
import useUserInfo from 'stores/userInfoStore';
import { NativeModules, Platform } from 'react-native';

interface Inputs {
  passportNumber: string;
  dateOfBirth: string;
  dateOfExpiry: string;
}

function useNFC() {
  async function scan(inputs: Inputs): Promise<PassportData | void> {
    console.log('Scanning NFC...');
    return Platform.OS === 'android' ? await scanAndroid(inputs) : await scanIOS(inputs);
  }

  async function scanAndroid(inputs: Inputs): Promise<any> {
    console.log('Android NFC Scan');
    return await PassportReader.scan({
      documentNumber: inputs.passportNumber,
      dateOfBirth: inputs.dateOfBirth,
      dateOfExpiry: inputs.dateOfExpiry,
    });
  }

  async function scanIOS(inputs: Inputs): Promise<any> {
    return await NativeModules.PassportReader.scanPassport(
      inputs.passportNumber,
      inputs.dateOfBirth,
      inputs.dateOfExpiry
    );
  }

  return {
    scan,
  };
}

export default useNFC;
