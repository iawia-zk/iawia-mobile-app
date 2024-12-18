import { darkTheme, lightTheme } from 'theme';
import { TI18nId } from 'types/common';

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

const MAP: Record<
  Theme,
  {
    labelId: TI18nId;
  }
> = {
  [Theme.LIGHT]: {
    labelId: 'label.light',
  },
  [Theme.DARK]: {
    labelId: 'label.dark',
  },
  [Theme.SYSTEM]: {
    labelId: 'label.system',
  },
};

export function getStatusBarStyleByTheme(theme?: Theme) {
  return theme === Theme.DARK ? 'light-content' : 'dark-content';
}

export function getBlurViewTintByTheme(theme?: Theme) {
  return theme === Theme.DARK ? 'dark' : 'light';
}

export function getHeaderBlurStyleByTheme(theme?: Theme) {
  return theme === Theme.DARK ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight';
}

export function getLabelIdByTheme(theme: Theme) {
  return MAP[theme].labelId;
}

export function getColorsByTheme(theme?: Theme) {
  return theme === Theme.DARK ? darkTheme : lightTheme;
}

export default Theme;
