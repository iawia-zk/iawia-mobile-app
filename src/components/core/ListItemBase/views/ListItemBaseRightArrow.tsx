import React from 'react';

import Box from 'components/core/Box';
import { CheckIcon, ChevronRightIcon } from 'components/Icons';

import { TListItemBaseStates } from '../ListItemBase.types';

function ListItemBaseRightArrow({ pressed, disabled }: TListItemBaseStates) {
  return (
    <Box ml="s">
      {pressed ? (
        <CheckIcon iconColor="textActive" />
      ) : (
        <ChevronRightIcon iconColor={disabled ? 'textPassive' : 'textPrimary'} />
      )}
    </Box>
  );
}

export default ListItemBaseRightArrow;
