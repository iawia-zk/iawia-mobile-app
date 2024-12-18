import { TListItemBaseStateMap } from './ListItemBase.types';

export const LIST_ITEM_BASE_MIN_HEIGHT = 64;
export const LIST_ITEM_STATE_BORDER_RADIUS = 12;

export const LIST_ITEM_BASE_STATE_MAP: TListItemBaseStateMap = {
  onTap: {
    backgroundColor: 'buttonGhostPrimary',
    labelColor: 'textPrimary',
    descriptionColor: 'textSecondary',
  },
  disabled: {
    backgroundColor: undefined,
    labelColor: 'textPassive',
    descriptionColor: 'textPassive',
  },
  error: {
    backgroundColor: undefined,
    labelColor: 'statusErrorPrimary',
    descriptionColor: 'statusErrorPrimary',
  },
  default: {
    backgroundColor: undefined,
    labelColor: 'textPrimary',
    descriptionColor: 'textSecondary',
  },
};
