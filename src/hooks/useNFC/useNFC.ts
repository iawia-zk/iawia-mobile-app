import PassportReader from 'react-native-passport-reader';

import { mockData } from 'constants/mockData';

import { PassportData } from 'types/passportData';
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
