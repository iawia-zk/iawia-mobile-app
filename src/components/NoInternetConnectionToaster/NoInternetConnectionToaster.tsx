import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Box from 'components/core/Box';
import ListItem from 'components/core/ListItem';
import { LinkBroken01Icon } from 'components/Icons';

import spacing from 'theme/spacing';

function NoInternetConnectionToaster() {
  const { top: topInset } = useSafeAreaInsets();

  return (
    <Box position="absolute" top={0} left={0} right={0} zIndex={999}>
      <Box
        style={{ paddingTop: topInset + spacing.s }}
        backgroundColor="statusErrorGhost"
        p="m"
        borderBottomLeftRadius={24}
        borderBottomRightRadius={24}>
        <ListItem
          labelId="messages.noInternetConnection.title"
          labelProps={{
            color: 'statusErrorPrimary',
          }}
          descriptionId="messages.noInternetConnection.description"
          descriptionProps={{
            color: 'textSecondary',
          }}
          rightIcon={LinkBroken01Icon}
          iconColor="statusErrorPrimary"
          iconBoxProps={{
            backgroundColor: 'statusErrorGhostHover',
          }}
        />
        <Box
          alignSelf="center"
          width={48}
          height={4}
          borderRadius={24}
          backgroundColor="statusErrorGhostHover"
        />
      </Box>
    </Box>
  );
}

export default NoInternetConnectionToaster;
