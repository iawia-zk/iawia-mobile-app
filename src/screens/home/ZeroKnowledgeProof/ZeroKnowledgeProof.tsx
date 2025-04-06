import Card from 'components/core/Card';
import ListItem from 'components/core/ListItem';
import { CheckIcon } from 'components/Icons';
import ScrollView from 'components/ScrollView';
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
      <Card p={'s'} gap={'s'} mb={'xxl'} mx={'m'}>
        {walletState.walletData?.snarks.map((snark) => (
          <ListItem
            key={snark.ipfsHash}
            labelId={snark.type as unknown as TI18nId}
            descriptionId={snark.ipfsHash as TI18nId}
            rightIcon={CheckIcon}
          />
        ))}
      </Card>
    </ScrollView>
  );
};

export default ZeroKnowledgeProof;
