import { findBestLanguageTag } from 'react-native-localize';

import storage, { STORAGE_KEYS } from 'helpers/storage';

import Locale from 'enums/Locale';

async function getDeviceLanguage(): Promise<Locale> {
  try {
    const preferredLanguage = await storage.readStorage(STORAGE_KEYS.PREFERRED_LANGUAGE);

    if (preferredLanguage) {
      return preferredLanguage;
    }

    const locale = findBestLanguageTag([Locale.EN]);

    return locale?.languageTag ?? Locale.EN;
  } catch (e) {
    return Locale.EN;
  }
}

export default getDeviceLanguage;
