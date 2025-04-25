import React, { PropsWithChildren, createContext, useCallback, useContext, useMemo } from 'react';
import Keychain from 'react-native-keychain';

import { useAuth, unsafe_getPrivateKey } from './authProvider';
import { PassportData } from 'types/passportData';

// TODO: refactor this as it shouldnt be used directly IMHO
export async function loadPassportData() {
  const passportDataCreds = await Keychain.getGenericPassword({
    service: 'passportData',
  });
  console.log('passportDataCreds', passportDataCreds);
  return passportDataCreds === false ? false : passportDataCreds.password;
}

export async function loadPassportDataAndSecret() {
  const passportData = await loadPassportData();
  const secret = await unsafe_getPrivateKey();
  if (!secret || !passportData) {
    return false;
  }
  return JSON.stringify({
    secret,
    passportData: JSON.parse(passportData),
  });
}

export async function storePassportData(passportData: PassportData) {
  console.log('Storing passport data in keychain');
  console.log('passportData', passportData);
  await Keychain.setGenericPassword('passportData', JSON.stringify(passportData), {
    service: 'passportData',
  });
}

export async function clearPassportData() {
  await Keychain.resetGenericPassword({ service: 'passportData' });
}

interface PassportProviderProps extends PropsWithChildren {
  authenticationTimeoutinMs?: number;
}
interface IPassportContext {
  getData: () => Promise<{ signature: string; data: PassportData } | null>;
  setData: (data: PassportData) => Promise<void>;
  getPassportDataAndSecret: () => Promise<{
    data: { passportData: PassportData; secret: string };
    signature: string;
  } | null>;
  clearPassportData: () => Promise<void>;
}

export const PassportContext = createContext<IPassportContext>({
  getData: () => Promise.resolve(null),
  setData: storePassportData,
  getPassportDataAndSecret: () => Promise.resolve(null),
  clearPassportData: clearPassportData,
});

export const PassportProvider = ({ children }: PassportProviderProps) => {
  const { _getSecurely } = useAuth();

  const getData = useCallback(
    () => _getSecurely<PassportData>(loadPassportData, (str) => JSON.parse(str)),
    [_getSecurely]
  );

  const getPassportDataAndSecret = useCallback(
    () =>
      _getSecurely<{ passportData: PassportData; secret: string }>(
        loadPassportDataAndSecret,
        (str) => JSON.parse(str)
      ),
    [_getSecurely]
  );

  const state: IPassportContext = useMemo(
    () => ({
      getData,
      setData: storePassportData,
      getPassportDataAndSecret,
      clearPassportData: clearPassportData,
    }),
    [getData, getPassportDataAndSecret]
  );

  return <PassportContext.Provider value={state}>{children}</PassportContext.Provider>;
};

export const usePassport = () => {
  return useContext(PassportContext);
};
