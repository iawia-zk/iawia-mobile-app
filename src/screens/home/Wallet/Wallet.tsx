import CopyInfoItem from 'components/CopyInfoItem';
import Box from 'components/core/Box';
import Button from 'components/core/Button';
import TextInput from 'components/core/TextInput';
import ScrollView from 'components/ScrollView';
import { useWalletContext, walletService } from 'context/WalletProvider/WalletProvider';
import { getRawDataFromHex } from 'helpers/walletService/walletService.helper';
import useInitialTransaction from 'hooks/useInitialTransaction';

import React, { useEffect, useState } from 'react';

const Wallet = () => {
  const { walletState, walletDispatch } = useWalletContext();
  const { startTransaction, loading } = useInitialTransaction();
  const [phrase, setPhrase] = useState(walletState.wallet?.mnemonic?.phrase);
  const [txDataLoading, setTxDataLoading] = useState(false);
  const [txData, setTxData] = useState<string | null>(null);

  useEffect(() => {
    walletDispatch.init();
  }, []);

  async function getTransactionData() {
    setTxDataLoading(true);
    const transactions = await walletService.getTransactions();

    if (!transactions || transactions.length === 0) {
      return;
    }

    const transaction = transactions[0];
    console.log('transaction', transaction);

    const transactionDetails = await walletService.getTransactionDetails(transaction.hash);
    const data = getRawDataFromHex(transactionDetails?.data ?? '');
    setTxData(data);
    setTxDataLoading(false);
  }

  return (
    <ScrollView paddingHorizontal="none">
      <Box gap={'m'} mx={'m'}>
        <TextInput
          labelId="label.phrase"
          placeholderId="label.phrase"
          value={phrase}
          onChangeText={setPhrase}
          hasError={false}
        />
        <CopyInfoItem labelId="label.walletAddress" value={walletState.wallet?.address ?? '-'} />
        <CopyInfoItem labelId="label.phrase" value={walletState.wallet?.mnemonic?.phrase ?? '-'} />
        <CopyInfoItem labelId="label.balance" value={walletState.balance ?? '-'} />
        {txData && <CopyInfoItem labelId="label.txData" value={txData} />}
        <Button onPress={walletDispatch.generateWallet} labelId="button.generateWallet" />
        <Button
          onPress={() => walletDispatch.importWallet(phrase ?? '')}
          labelId="button.importWallet"
        />
        <Button
          onPress={getTransactionData}
          labelId="button.getTransactions"
          loading={txDataLoading}
        />
        <Button onPress={startTransaction} labelId="button.startTransaction" loading={loading} />
      </Box>
    </ScrollView>
  );
};

export default Wallet;
