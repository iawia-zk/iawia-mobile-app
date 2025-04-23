import React from 'react';

import Box from 'components/core/Box';

import Text from 'components/core/Text';
import { TNavigationProps } from 'screens/AppNavigation.types';
import BottomInsetBox from 'components/BottomInsetBox';
import Button from 'components/core/Button';

function Introduction({ navigation }: TNavigationProps<'Introduction'>) {
  return (
    <Box flex={1}>
      <Box height={'100%'} justifyContent="center" gap={'l'}>
        <Text variant="titleSection" textAlign="center">
          IAWIA ZK
        </Text>
        <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
          <Button
            labelId="button.start"
            //   leftIcon={Upload04Icon}
            onPress={() => navigation.navigate('PassportCameraScan')}
          />
        </BottomInsetBox>
      </Box>
    </Box>
  );
}

export default Introduction;
