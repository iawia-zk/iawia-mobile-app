import React from 'react';

import Card from 'components/Card';
import Box from 'components/core/Box';
import ListItem from 'components/core/ListItem';
import { InfoCircleIcon } from 'components/Icons';
import Button from 'components/core/Button';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';

function InitialBanner() {
  const { walletState } = useWalletContext();

  return (
    <Card
      width="100%"
      py="m"
      px="s"
      gap={'s'}
      justifyContent="center"
      borderRadius={32}
      backgroundColor="appLogoBackgroundDark">
      <Box px="s">
        <ListItem
          labelId="label.initialBanner"
          descriptionId="label.initialBannerDescription"
          iconColor="avatarFire"
          leftIcon={InfoCircleIcon}
        />
      </Box>
      <Box justifyContent="center" flexDirection="row">
        <Button
          block={false}
          labelId="button.generateCommitments"
          disabled={!walletState.balance || Number(walletState.balance) < 0.0001}
        />
      </Box>
    </Card>
  );
}

export default InitialBanner;
