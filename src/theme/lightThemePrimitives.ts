import palette from './palette';

import { TThemePrimitives } from './theme.types';

const lightThemePrimitives: TThemePrimitives = {
  // Text Primitives
  textPrimary: palette.moon900,
  textSecondary: palette.moon600,
  textPassive: palette.moon500,
  textActive: palette.orchid500,
  textInverted: palette.moon100,

  // Background Primitives
  backgroundPrimary: palette.moon200,
  backgroundSecondary: palette.moon300,
  backgroundSecondaryHover: palette.moon400,
  backgroundTertiary: palette.moon100,
  backgroundTertiaryHover: palette.moon200,
  backgroundModal: 'rgba(37, 37, 41, 0.56)',
  backgroundNavigation: 'rgba(244, 245, 248, 0.80)',

  // Border Primitives
  borderOutline: palette.moon200,
  borderOutlineActive: palette.orchid500,
  borderDivider: palette.moon300,

  // Status primitives
  statusNaturalPrimary: palette.sky600,
  statusNaturalPrimaryHover: palette.sky700,
  statusNaturalPrimaryOnTap: palette.sky800,
  statusNaturalGhost: palette.sky100,
  statusNaturalGhostHover: palette.sky200,

  statusErrorPrimary: palette.fire600,
  statusErrorPrimaryHover: palette.fire700,
  statusErrorPrimaryOnTap: palette.fire800,
  statusErrorGhost: palette.fire100,
  statusErrorGhostHover: palette.fire200,

  statusWarningPrimary: palette.sunburst500,
  statusWarningPrimaryHover: palette.sunburst600,
  statusWarningPrimaryOnTap: palette.sunburst700,
  statusWarningGhost: palette.sunburst100,
  statusWarningGhostHover: palette.sunburst200,

  statusPositivePrimary: palette.spring600,
  statusPositivePrimaryHover: palette.spring700,
  statusPositivePrimaryOnTap: palette.spring800,
  statusPositiveGhost: palette.spring100,
  statusPositiveGhostHover: palette.spring200,

  // Button Primitives
  buttonPrimary: palette.orchid500,
  buttonPrimaryHover: palette.orchid600,
  buttonPrimaryOnTap: palette.orchid700,

  buttonGhostPrimary: palette.orchid100,
  buttonGhostPrimaryHover: palette.orchid200,

  // Illustration Primitives
  illustrationPrimary: palette.orchid500,
  illustrationSecondary: palette.turquoise600,

  // Avatars
  avatarOrchid: palette.orchid600,
  avatarTurquoise: palette.turquoise600,
  avatarSky: palette.sky600,
  avatarSpring: palette.spring600,
  avatarSunburst: palette.sunburst600,
  avatarFire: palette.fire600,
  avatarSand: palette.sand600,
  avatarRose: palette.rose600,

  // Common Primitives
  transparent: palette.transparent,

  // App Logo Background Primitives
  appLogoBackgroundPrimary: palette.orchid500,
  appLogoBackgroundDark: palette.moon800,
  appLogoBackgroundLight: palette.moon200,

  // White icon
  whiteIcon: palette.moon100,
};

export default lightThemePrimitives;
