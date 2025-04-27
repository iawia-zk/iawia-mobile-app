import React, { useEffect, useState } from 'react';
import Box from 'components/core/Box';
import ScrollView from 'components/ScrollView';
import { SEGMENTED_CONTROL_OPTIONS, WalletTabOption } from './Wallet.constants';
import WalletCard from './views/WalletCard';
import SegmentedControl from 'components/SegmentedControl';
import TokenList from './views/TokenList';
import TransactionList from './views/TransactionList';
import useWalletTransactions from './Wallet.hooks';
import InitialBanner from './views/InitialBanner';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import ActivityIndicator from 'components/core/ActivityIndicator';

const Wallet = () => {
  const { walletDispatch } = useWalletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<WalletTabOption>(WalletTabOption.TOKENS);
  useWalletTransactions(!isLoading);

  useEffect(() => {
    walletDispatch.init().then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <ScrollView paddingHorizontal="none">
      <Box p="m" gap="m">
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <InitialBanner />
            <WalletCard />
            <SegmentedControl<WalletTabOption>
              options={SEGMENTED_CONTROL_OPTIONS}
              value={selectedOption}
              onChange={setSelectedOption}
            />
            {selectedOption === WalletTabOption.TOKENS && <TokenList />}
            {selectedOption === WalletTabOption.ACTIVITY && <TransactionList />}
          </>
        )}
      </Box>
    </ScrollView>
  );
};

export default Wallet;
