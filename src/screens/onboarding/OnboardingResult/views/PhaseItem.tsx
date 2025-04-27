import React from 'react';

import Text from 'components/core/Text';
import { TI18nId } from 'types/common';

function PhaseItem({ phaseNo, textId }: { phaseNo: number; textId: TI18nId }) {
  return (
    <Text variant="textBodyBold">
      {phaseNo}- <Text variant="textBody" textId={textId} />
    </Text>
  );
}

export default PhaseItem;
