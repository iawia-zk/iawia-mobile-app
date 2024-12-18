import Theme from 'enums/Theme';

export type TThemeContext = {
  themeState: TThemeState;
  themeDispatch: TThemeDispatch;
};

export type TThemeState = {
  theme: Theme;
};

export type TThemeDispatch = {
  setTheme: (theme: Theme) => Promise<void>;
  getThemeValue: () => Theme;
};

export type TThemeValue = Theme.LIGHT | Theme.DARK;
