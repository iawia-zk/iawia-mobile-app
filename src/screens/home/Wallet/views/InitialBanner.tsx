import React from 'react';

import Card from 'components/Card';
import Box from 'components/core/Box';
import ListItem from 'components/core/ListItem';
import { InfoCircleIcon } from 'components/Icons';
import Button from 'components/core/Button';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import useInitialTransaction from 'hooks/useInitialTransaction';
import { PassportTransactionData } from 'types/passportData';
import { encryptData } from 'helpers/encryption';
import Config from 'react-native-config';

function InitialBanner() {
  const { walletState } = useWalletContext();
  const { loading, startTransaction } = useInitialTransaction();

  async function sendInitialTransaction() {
    console.log('sendInitialTransaction');
    const data: PassportTransactionData = {
      nationality: 'TUR',
      dateOfBirth: '020104',
      dateOfExpiry: '270104',
      documentNumber: 'U30266290',
      issuingCountry: 'TUR',
    };

    const encryptedData: any = {};

    for (const key of Object.keys(data) as Array<keyof PassportTransactionData>) {
      const value = await encryptData(
        data[key] as string,
        Config.PASSPORT_ENCRYPTION_KEY as string
      );

      encryptedData[key] = value;
    }

    startTransaction(encryptedData);
  }

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
          loading={loading}
          onPress={sendInitialTransaction}
          labelId="button.generateCommitments"
          disabled={!walletState.balance || Number(walletState.balance) < 0.0001}
        />
      </Box>
    </Card>
  );
}

export default InitialBanner;
