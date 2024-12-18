import { LIST_ITEM_BASE_STATE_MAP } from './ListItemBase.constants';
import { TListItemBaseStates } from './ListItemBase.types';

function getListItemStateStyle({ pressed, disabled, hasError }: TListItemBaseStates) {
  if (hasError) {
    return LIST_ITEM_BASE_STATE_MAP.error;
  }
  if (pressed) {
    return LIST_ITEM_BASE_STATE_MAP.onTap;
  }
  if (disabled) {
    return LIST_ITEM_BASE_STATE_MAP.disabled;
  }
  return LIST_ITEM_BASE_STATE_MAP.default;
}

export { getListItemStateStyle };
