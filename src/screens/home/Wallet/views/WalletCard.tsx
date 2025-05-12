import React from 'react';

import Card from 'components/Card';
import CopyInfoItem from 'components/CopyInfoItem';
import Avatar from 'components/core/Avatar';
import Box from 'components/core/Box';
import ListItemBase from 'components/core/ListItemBase';
import Text from 'components/core/Text';
import IMAGES from 'constants/images';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import { formatBalance } from 'helpers/walletService/walletService.helper';

function WalletCard() {
  const { walletState } = useWalletContext();
  const formattedBalance = walletState.balance ? formatBalance(walletState.balance) : '';

  return (
    <Card
      height={160}
      width="100%"
      py="m"
      px="s"
      borderRadius={32}
      backgroundColor="appLogoBackgroundDark">
      <Box px="s">
        <Text variant="textBodyBold" color="textPassive" />
      </Box>
      <ListItemBase
        left={<Avatar imageUrl={IMAGES.ethLogo} backgroundColor="textPassive" size="small" />}
        labelId="label.formattedBalance"
        labelProps={{
          variant: 'textBodyBold',
          // color: 'diamond',
          values: { balance: formattedBalance },
        }}
      />
      <Box px="s">
        <CopyInfoItem
          labelId="label.walletAddress"
          valueProps={{
            color: 'textPassive',
            variant: 'textBodySmall',
          }}
          labelProps={{
            // color: 'diamond',
            variant: 'textBodySmallBold',
          }}
          value={walletState.wallet?.address ?? ''}
        />
      </Box>
    </Card>
  );
}

export default WalletCard;
