import React from 'react';

import Shimmer from 'components/Shimmer';

import { TEXT_INPUT_BASE_INPUT_BORDER_RADIUS } from 'components/core/TextInputBase/TextInputBase.constants';

import { TEXT_INPUT_HEIGHT } from '../TextInput.constants';

function TextInputShimmer() {
  return (
    <Shimmer
      width="100%"
      height={TEXT_INPUT_HEIGHT}
      borderRadius={TEXT_INPUT_BASE_INPUT_BORDER_RADIUS}
    />
  );
}

export default TextInputShimmer;
