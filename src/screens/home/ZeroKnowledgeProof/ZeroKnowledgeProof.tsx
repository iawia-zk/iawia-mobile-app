import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import Box from 'components/core/Box';
import Card from 'components/core/Card';
import ListItem from 'components/core/ListItem';
import Text from 'components/core/Text';
import { PuzzlePiecesIcon, WalletIcon } from 'components/Icons';
import ScrollView from 'components/ScrollView';
import { NOOP } from 'constants/noop';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import { encryptData } from 'helpers/encryption';
import React, { useEffect } from 'react';
import Config from 'react-native-config';

const ZeroKnowledgeProof = () => {
  const { walletState } = useWalletContext();

  useEffect(() => {
    getTransactionData();
  }, []);

  async function exportToExtension() {
    console.log('exportToExtension');
    const phrase = walletState.wallet?.mnemonic?.phrase;
    if (!phrase) {
      return;
    }

    console.log('phrase', phrase);

    const encryptionKey = Config.PHRASE_ENCRYPTION_KEY;

    if (!encryptionKey) {
      console.log('no encryption key');
      return;
    }

    console.log('encrypting phrase');
    let encryptedPhrase = '';
    try {
      const encryptedData = await encryptData(phrase, encryptionKey);
      encryptedPhrase = JSON.stringify(encryptedData);
      console.log('encrypted phrase', encryptedPhrase);
      Clipboard.setString(encryptedPhrase);
      console.log('copying to clipboard');

      Toast.show({
        type: 'success',
        text1: 'Encrypted phrase copied to clipboard!',
      });
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to encrypt phrase',
      });
    }
  }

  async function getTransactionData() {
    // const transactions = await walletService.getTransactions();
    // if (!transactions || transactions.length === 0) {
    //   return;
    // }
    // const transaction = transactions.filter((tx) => tx.to === BURN_ADDRESS)[0];
    // const transactionDetails = await walletService.getTransactionDetails(transaction.hash);
    // const stringData = getRawDataFromHex(transactionDetails?.data ?? '');
    // const data: TWalletData = JSON.parse(stringData);
    // walletDispatch.setWalletData(data);
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
            onPress={exportToExtension}
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
        {/* <Card p={'m'} gap={'s'} mb={'xxl'}>
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
        </Card> */}
      </Box>
    </ScrollView>
  );
};

export default ZeroKnowledgeProof;
