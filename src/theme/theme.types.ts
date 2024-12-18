import { BaseTheme } from '@shopify/restyle';

export type TTheme = BaseTheme;

export type TThemePrimitives = {
  // Text Primitives
  textPrimary: string;
  textPassive: string;
  textActive: string;
  textInverted: string;
  textSecondary: string;

  // Background Primitives
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundSecondaryHover: string;
  backgroundTertiary: string;
  backgroundTertiaryHover: string;
  backgroundModal: string;
  backgroundNavigation: string;

  // Border Primitives
  borderOutline: string;
  borderOutlineActive: string;
  borderDivider: string;

  // Status primitives
  statusNaturalPrimary: string;
  statusNaturalPrimaryHover: string;
  statusNaturalPrimaryOnTap: string;
  statusNaturalGhost: string;
  statusNaturalGhostHover: string;

  statusErrorPrimary: string;
  statusErrorPrimaryHover: string;
  statusErrorPrimaryOnTap: string;
  statusErrorGhost: string;
  statusErrorGhostHover: string;

  statusWarningPrimary: string;
  statusWarningPrimaryHover: string;
  statusWarningPrimaryOnTap: string;
  statusWarningGhost: string;
  statusWarningGhostHover: string;

  statusPositivePrimary: string;
  statusPositivePrimaryHover: string;
  statusPositivePrimaryOnTap: string;

  statusPositiveGhost: string;
  statusPositiveGhostHover: string;

  // Button Primitives
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonPrimaryOnTap: string;

  buttonGhostPrimary: string;
  buttonGhostPrimaryHover: string;

  // Illustration Primitives
  illustrationPrimary: string;
  illustrationSecondary: string;

  // Avatar Primitives
  avatarOrchid: string;
  avatarTurquoise: string;
  avatarSky: string;
  avatarSpring: string;
  avatarSunburst: string;
  avatarFire: string;
  avatarSand: string;
  avatarRose: string;

  // Common Primitives
  transparent: string;

  // App logo Primitives
  appLogoBackgroundPrimary: string;
  appLogoBackgroundDark: string;
  appLogoBackgroundLight: string;

  // White icon primitive
  whiteIcon: string;
};

export type TPalette = {
  orchid100: string;
  orchid200: string;
  orchid300: string;
  orchid400: string;
  orchid500: string;
  orchid600: string;
  orchid700: string;
  orchid800: string;
  orchid900: string;

  turquoise100: string;
  turquoise200: string;
  turquoise300: string;
  turquoise400: string;
  turquoise500: string;
  turquoise600: string;
  turquoise700: string;
  turquoise800: string;
  turquoise900: string;

  moon100: string;
  moon200: string;
  moon300: string;
  moon400: string;
  moon500: string;
  moon600: string;
  moon700: string;
  moon800: string;
  moon900: string;

  sky100: string;
  sky200: string;
  sky300: string;
  sky400: string;
  sky500: string;
  sky600: string;
  sky700: string;
  sky800: string;
  sky900: string;

  spring100: string;
  spring200: string;
  spring300: string;
  spring400: string;
  spring500: string;
  spring600: string;
  spring700: string;
  spring800: string;
  spring900: string;

  sunburst100: string;
  sunburst200: string;
  sunburst300: string;
  sunburst400: string;
  sunburst500: string;
  sunburst600: string;
  sunburst700: string;
  sunburst800: string;
  sunburst900: string;

  fire100: string;
  fire200: string;
  fire300: string;
  fire400: string;
  fire500: string;
  fire600: string;
  fire700: string;
  fire800: string;
  fire900: string;

  sand100: string;
  sand200: string;
  sand300: string;
  sand400: string;
  sand500: string;
  sand600: string;
  sand700: string;
  sand800: string;
  sand900: string;

  rose100: string;
  rose200: string;
  rose300: string;
  rose400: string;
  rose500: string;
  rose600: string;
  rose700: string;
  rose800: string;
  rose900: string;

  flagYellow: string;
  flagLightBlue: string;
  flagPurple: string;
  flagRed: string;
  flagOrange: string;
  flagGreen: string;

  white: string;
  silver: string;
  transparent: string;
};

export type TTextVariantKeys =
  | 'titleSection'
  | 'titleSubsection'
  | 'textBodyBold'
  | 'textBody'
  | 'textBodySubBold'
  | 'textBodySub'
  | 'textBodySmallBold'
  | 'textBodySmall';

export type TTextVariants = {
  [key in TTextVariantKeys]: {
    fontFamily: string;
    fontSize: number;
    letterSpacing: number;
  };
};

export type TSpacing = {
  none: number;
  xxs: number;
  xs: number;
  s: number;
  sm: number;
  m: number;
  ml: number;
  l: number;
  xl: number;
  xxl: number;
};

export type TContainerVariants = {
  [key: string]: {
    backgroundColor: string;
    [key: string]: string | number;
  };
};

export type TBreakpoints = {
  phone: number;
  tablet: number;
};
