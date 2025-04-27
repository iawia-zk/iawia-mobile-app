import Box from 'components/core/Box';
import Card from 'components/core/Card';
import ListItem from 'components/core/ListItem';
import Text from 'components/core/Text';
import { CheckIcon, PuzzlePiecesIcon, WalletIcon } from 'components/Icons';
import ScrollView from 'components/ScrollView';
import { NOOP } from 'constants/noop';
import { useWalletContext, walletService } from 'context/WalletProvider/WalletProvider';
import { BURN_ADDRESS } from 'helpers/walletService/walletService.constants';
import { getRawDataFromHex } from 'helpers/walletService/walletService.helper';
import React, { useEffect } from 'react';
import { TI18nId } from 'types/common';
import { TWalletData } from 'types/walletData';

const ZeroKnowledgeProof = () => {
  const { walletState, walletDispatch } = useWalletContext();

  useEffect(() => {
    getTransactionData();
  }, []);

  async function getTransactionData() {
    const transactions = await walletService.getTransactions();

    if (!transactions || transactions.length === 0) {
      return;
    }

    const transaction = transactions.filter((tx) => tx.to === BURN_ADDRESS)[0];

    const transactionDetails = await walletService.getTransactionDetails(transaction.hash);
    const stringData = getRawDataFromHex(transactionDetails?.data ?? '');
    const data: TWalletData = JSON.parse(stringData);
    walletDispatch.setWalletData(data);
  }

  return (
    <ScrollView paddingHorizontal="none">
      <Box p="m" gap="s">
        <Text variant="titleSubsection" color="textPrimary">
          Export your wallet
        </Text>
        <Card gap={'m'} p={'m'} mb={'s'}>
          <ListItem
            labelId="label.export.toExtension"
            descriptionId="label.export.toExtension.description"
            leftIcon={PuzzlePiecesIcon}
            onPress={NOOP}
          />
          <ListItem
            labelId="label.export.phrase"
            descriptionId="label.export.phrase.description"
            leftIcon={WalletIcon}
            onPress={NOOP}
          />
        </Card>
        <Text variant="titleSubsection" color="textPrimary">
          Your commitments
        </Text>
        <Card p={'m'} gap={'s'} mb={'xxl'}>
          {!walletState.walletData || walletState.walletData?.snarks.length === 0 ? (
            <>
              <Text variant="textBodyBold" color="textSecondary">
                No commitments found.
              </Text>
            </>
          ) : (
            walletState.walletData?.snarks.map((snark) => (
              <ListItem
                key={snark.ipfsHash}
                labelId={snark.type as unknown as TI18nId}
                descriptionId={snark.ipfsHash as TI18nId}
                rightIcon={CheckIcon}
              />
            ))
          )}
        </Card>
      </Box>
    </ScrollView>
  );
};

export default ZeroKnowledgeProof;
