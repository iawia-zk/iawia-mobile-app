import React, { ReactElement, useEffect, useState } from 'react';
import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { useWalletContext, walletService } from 'context/WalletProvider/WalletProvider';
import { TTransaction } from 'types/wallet';

function TransactionList(): ReactElement {
  const { walletState } = useWalletContext();
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      if (walletState.wallet?.address) {
        const txs = await walletService.getTransactions();
        setTransactions(txs);
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [walletState.wallet?.address]);

  if (loading) {
    return (
      <Box p="m" alignItems="center" justifyContent="center">
        <Text variant="textBody">Loading transactions...</Text>
      </Box>
    );
  }

  if (!transactions.length) {
    return (
      <Box p="m" alignItems="center" justifyContent="center">
        <Text variant="textBody">No transactions found</Text>
      </Box>
    );
  }

  return (
    <Box px="s" gap="s">
      {transactions.map((tx) => (
        <Box
          key={tx.hash}
          alignItems="center"
          justifyContent="space-between"
          p="s"
          backgroundColor="backgroundSecondary"
          borderRadius={16}>
          <Box>
            <Text variant="textBody">
              {tx.from.toLowerCase() === walletState.wallet?.address.toLowerCase()
                ? 'Sent'
                : 'Received'}
            </Text>
            <Text variant="textBody" color="textSecondary">
              {tx.uniqueId}
            </Text>
          </Box>
          <Box alignItems="flex-end">
            <Text variant="textBody">{Number(tx.value) / 1e18} ETH</Text>
            <Text variant="textBody" color="textSecondary">
              {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default TransactionList;
