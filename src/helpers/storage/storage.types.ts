import { STORAGE_KEYS } from './storage.constants';

export type TStorageKeys = STORAGE_KEYS;

export type TStorage = {
  readStorage: (key: TStorageKeys) => Promise<any>;
  readStorageFromKeys: (keys: Array<TStorageKeys>) => Promise<any>;
  writeStorage: (key: TStorageKeys, data: any) => Promise<void>;
  writeStorageFromKeys: (keyValuePairs: Partial<Record<TStorageKeys, any>>) => Promise<void>;
  removeStorage: (key: TStorageKeys) => Promise<void>;
  removeStorageFromKeys: (keys: Array<TStorageKeys>) => Promise<void>;
  clearEntireStorage: () => Promise<void>;
};
