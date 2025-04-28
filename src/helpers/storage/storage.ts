import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_PREFIX } from './storage.constants';
import { TStorage, TStorageKeys } from './storage.types';

async function readStorage(key: TStorageKeys) {
  try {
    const data: any = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return JSON.parse(data);
  } catch (e) {}
}

async function writeStorageFromKeys(keyValuePairs: Partial<Record<TStorageKeys, any>>) {
  try {
    const items = Object.entries(keyValuePairs).map(([key, value]) => [
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value),
    ]);

    await AsyncStorage.multiSet(items as any);
  } catch (e) {}
}

async function writeStorage(key: TStorageKeys, data: any) {
  try {
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (e) {
    console.log('writeStorage', 'error');
  }
}

async function removeStorage(key: TStorageKeys) {
  try {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (e) {}
}

async function readStorageFromKeys(keys: Array<TStorageKeys>) {
  try {
    const values: any = await AsyncStorage.multiGet(handleConcatKeysWithPrefix(keys));

    return values.reduce((acc: any, cur: any) => {
      if (!acc[cur[0]]) {
        const storageKey = cur[0].replace(STORAGE_PREFIX, '');
        acc[storageKey] = JSON.parse(cur[1]);
        return acc;
      }
      return acc;
    }, {});
  } catch (e) {}
}

async function removeStorageFromKeys(keys: Array<TStorageKeys>) {
  try {
    await AsyncStorage.multiRemove(handleConcatKeysWithPrefix(keys));
  } catch (e) {}
}

async function clearEntireStorage() {
  try {
    await AsyncStorage.clear();
  } catch (e) {}
}

function handleConcatKeysWithPrefix(keys: Array<TStorageKeys>) {
  return keys.map((key: string) => `${STORAGE_PREFIX}${key}`);
}

const storage: TStorage = {
  readStorage,
  readStorageFromKeys,
  writeStorage,
  writeStorageFromKeys,
  removeStorage,
  removeStorageFromKeys,
  clearEntireStorage,
};

export default storage;
