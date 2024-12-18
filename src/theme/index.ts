import { createTheme, BaseTheme } from '@shopify/restyle';

import lightThemePrimitives from './lightThemePrimitives';
import darkThemePrimitives from './darkThemePrimitives';
import { textVariants } from './variants';

import spacing from './spacing';
import breakpoints from './breakpoints';

import { TThemePrimitives } from './theme.types';

function generateTheme(themePrimitives: TThemePrimitives): BaseTheme {
  return createTheme({
    colors: themePrimitives,
    spacing,
    breakpoints,
    textVariants,
  });
}

export const lightTheme = generateTheme(lightThemePrimitives);

export const darkTheme = generateTheme(darkThemePrimitives);
