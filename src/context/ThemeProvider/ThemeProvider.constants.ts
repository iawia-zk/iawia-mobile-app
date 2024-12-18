import { ASYNC_NOOP, NOOP } from 'constants/noop';
import Theme from 'enums/Theme';

import { TThemeDispatch, TThemeState } from './ThemeProvider.types';

export const INITIAL_STATE: TThemeState = {
  theme: Theme.SYSTEM,
};

export const INITIAL_DISPATCH: TThemeDispatch = {
  setTheme: ASYNC_NOOP,
  getThemeValue: NOOP as TThemeDispatch['getThemeValue'],
};
