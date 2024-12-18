import palette from './palette';

import { TThemePrimitives } from './theme.types';

const darkThemePrimitives: TThemePrimitives = {
  // Text Primitives
  textPrimary: palette.moon200,
  textSecondary: palette.moon400,
  textPassive: palette.moon500,
  textActive: palette.turquoise500,
  textInverted: palette.moon900,

  // Background Primitives
  backgroundPrimary: palette.moon900,
  backgroundSecondary: palette.moon700,
  backgroundSecondaryHover: palette.moon600,
  backgroundTertiary: palette.moon800,
  backgroundTertiaryHover: palette.moon900,
  backgroundModal: 'rgba(37, 37, 41, 0.80)',
  backgroundNavigation: 'rgba(26, 26, 29, 0.80)',

  // Border Primitives
  borderOutline: palette.moon700,
  borderOutlineActive: palette.turquoise500,
  borderDivider: palette.moon700,

  // Status primitives
  statusNaturalPrimary: palette.sky300,
  statusNaturalPrimaryHover: palette.sky400,
  statusNaturalPrimaryOnTap: palette.sky500,
  statusNaturalGhost: palette.sky900,
  statusNaturalGhostHover: palette.sky800,

  statusErrorPrimary: palette.fire400,
  statusErrorPrimaryHover: palette.fire500,
  statusErrorPrimaryOnTap: palette.fire600,
  statusErrorGhost: palette.fire900,
  statusErrorGhostHover: palette.fire800,

  statusWarningPrimary: palette.sunburst400,
  statusWarningPrimaryHover: palette.sunburst400,
  statusWarningPrimaryOnTap: palette.sunburst500,
  statusWarningGhost: palette.sunburst800,
  statusWarningGhostHover: palette.sunburst700,

  statusPositivePrimary: palette.spring400,
  statusPositivePrimaryHover: palette.spring400,
  statusPositivePrimaryOnTap: palette.spring500,
  statusPositiveGhost: palette.spring800,
  statusPositiveGhostHover: palette.spring700,

  // Button Primitives
  buttonPrimary: palette.turquoise500,
  buttonPrimaryHover: palette.turquoise600,
  buttonPrimaryOnTap: palette.turquoise700,

  buttonGhostPrimary: palette.turquoise900,
  buttonGhostPrimaryHover: palette.turquoise800,

  // Illustration Primitives
  illustrationPrimary: palette.turquoise600,
  illustrationSecondary: palette.orchid400,

  // Avatars
  avatarOrchid: palette.orchid400,
  avatarTurquoise: palette.turquoise400,
  avatarSky: palette.sky400,
  avatarSpring: palette.spring400,
  avatarSunburst: palette.sunburst400,
  avatarFire: palette.fire400,
  avatarSand: palette.sand400,
  avatarRose: palette.rose400,

  // Common Primitives
  transparent: palette.transparent,

  // App Logo Background Primitives
  appLogoBackgroundPrimary: palette.orchid500,
  appLogoBackgroundDark: palette.moon800,
  appLogoBackgroundLight: palette.moon200,

  // White icon
  whiteIcon: palette.moon100,
};

export default darkThemePrimitives;
