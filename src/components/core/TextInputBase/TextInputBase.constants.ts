import spacing from 'theme/spacing';
import { IS_ANDROID } from 'constants/platform';

export const TEXT_INPUT_BASE_INPUT_HEIGHT = 64;
export const TEXT_INPUT_BASE_INPUT_BORDER_RADIUS = 8;
export const TEXT_INPUT_BASE_FOCUSED_LABEL_HEIGHT = 16;
export const TEXT_INPUT_BASE_FOCUSED_LABEL_TEXT_SPACING = spacing.xxs;
export const TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING = spacing.sm;
export const TEXT_INPUT_BASE_INPUT_PADDING_TOP =
  TEXT_INPUT_BASE_PADDING_VERTICAL_SPACING +
  TEXT_INPUT_BASE_FOCUSED_LABEL_HEIGHT +
  TEXT_INPUT_BASE_FOCUSED_LABEL_TEXT_SPACING;
// FIXME: (semih) giving 16 as line height causes flickering on android
export const TEXT_INPUT_BASE_LINE_HEIGHT = IS_ANDROID ? 22 : 16;
