import { FC } from 'react';

import { BritishFlagIcon } from 'components/Icons';

import { TI18nId } from 'types/common';
import { TIconProps } from 'types/icon';

enum Locale {
  EN = 'en',
}

const MAP: Record<Locale, { labelId: TI18nId; icon: FC<TIconProps> }> = {
  [Locale.EN]: {
    labelId: 'label.english',
    icon: BritishFlagIcon,
  },
};

export function getLocaleLabelIdByLocale(locale: Locale) {
  return MAP[locale].labelId;
}

export function getIconByLocale(locale: Locale) {
  return MAP[locale].icon;
}

export function getLocaleOptions() {
  return Object.keys(MAP).map((key) => ({
    label: getLocaleLabelIdByLocale(key as Locale),
    value: key as Locale,
  }));
}

export default Locale;
