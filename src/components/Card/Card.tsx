import React from 'react';

import Box from 'components/core/Box';

import { TCardProps } from './Card.types';

function Card({ children, ...rest }: TCardProps) {
  return (
    <Box borderRadius={16} backgroundColor="backgroundTertiary" {...rest}>
      {children}
    </Box>
  );
}

export default Card;
