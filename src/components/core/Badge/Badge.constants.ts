import {
  AlertCircleIcon,
  CheckVerified01Icon,
  Hourglass01Icon,
  InfoCircleIcon,
} from 'components/Icons';

import { TBadgeVariantMap, TBadgeSizeMap } from './Badge.types';

export const BADGE_VARIANT_MAP: TBadgeVariantMap = {
  info: {
    color: 'statusNaturalPrimary',
    backgroundColor: 'statusNaturalGhost',
    defaultIcon: InfoCircleIcon,
  },
  success: {
    color: 'statusPositivePrimary',
    backgroundColor: 'statusPositiveGhost',
    defaultIcon: CheckVerified01Icon,
  },
  warning: {
    color: 'statusWarningPrimary',
    backgroundColor: 'statusWarningGhost',
    defaultIcon: Hourglass01Icon,
  },
  danger: {
    color: 'statusErrorPrimary',
    backgroundColor: 'statusErrorGhost',
    defaultIcon: AlertCircleIcon,
  },
  natural: {
    color: 'textSecondary',
    backgroundColor: 'backgroundSecondary',
    defaultIcon: undefined,
  },
};

export const BADGE_SIZE_MAP: TBadgeSizeMap = {
  large: {
    iconSize: 24,
    textVariant: 'textBodyBold',
    paddingX: 's',
    paddingY: 's',
    borderRadius: 20,
    minHeight: 40,
  },
  medium: {
    paddingX: 's',
    paddingY: 'xs',
    minHeight: 32,
    iconSize: 24,
    borderRadius: 16,
    textVariant: 'textBodySubBold',
  },
  small: {
    paddingX: 'xs',
    paddingY: 'xs',
    minHeight: 24,
    iconSize: 16,
    borderRadius: 16,
    textVariant: 'textBodySmallBold',
  },
};
