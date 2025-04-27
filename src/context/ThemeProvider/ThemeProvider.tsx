import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { ThemeProvider as ReStyleThemeProvider } from '@shopify/restyle';
import { Appearance, StatusBar } from 'react-native';

import { TChildrenOnly } from 'types/common';
import Theme, { getColorsByTheme, getStatusBarStyleByTheme } from 'enums/Theme';
import storage, { STORAGE_KEYS } from 'helpers/storage';

import { INITIAL_DISPATCH, INITIAL_STATE } from './ThemeProvider.constants';
import { TThemeContext, TThemeState, TThemeValue } from './ThemeProvider.types';
import { useChangeThemeWorkaround } from './ThemeProvider.hooks';

const themeContext = createContext<TThemeContext>({
  themeState: INITIAL_STATE,
  themeDispatch: INITIAL_DISPATCH,
});

function ThemeProvider({ children }: TChildrenOnly): ReactElement {
  const currentSystemThemeType = useChangeThemeWorkaround();
  const [{ theme }, setState] = useState<TThemeState>(INITIAL_STATE);

  useEffect(() => {
    getSelectedTheme();
  }, []);

  useEffect(() => {
    Appearance.setColorScheme(theme === Theme.SYSTEM ? null : getThemeValue());
  }, [theme]);

  async function getSelectedTheme() {
    const themeValue = await storage.readStorage(STORAGE_KEYS.THEME);
    setTheme(themeValue ?? Theme.SYSTEM);
  }

  async function setTheme(themeValue: Theme) {
    await storage.writeStorage(STORAGE_KEYS.THEME, themeValue);
    setState((state) => ({
      ...state,
      theme: themeValue,
    }));
  }

  function getThemeValue(): TThemeValue {
    if (theme === Theme.SYSTEM) {
      return (currentSystemThemeType as TThemeValue) ?? Theme.LIGHT;
    }
    return theme;
  }

  const value: TThemeContext = {
    themeState: {
      theme,
    },
    themeDispatch: {
      setTheme,
      getThemeValue,
    },
  };

  return (
    <themeContext.Provider value={value}>
      <ReStyleThemeProvider theme={getColorsByTheme(Theme.DARK)}>
        <StatusBar
          barStyle={getStatusBarStyleByTheme(Theme.DARK)}
          backgroundColor="transparent"
          translucent
        />
        {children}
      </ReStyleThemeProvider>
    </themeContext.Provider>
  );
}

export default ThemeProvider;

export const useThemeContext = (): TThemeContext => useContext(themeContext);
