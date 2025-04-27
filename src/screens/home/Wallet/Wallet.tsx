import React, { useState } from 'react';
import Box from 'components/core/Box';
import ScrollView from 'components/ScrollView';
import { SEGMENTED_CONTROL_OPTIONS, WalletTabOption } from './Wallet.constants';
import WalletCard from './views/WalletCard';
import SegmentedControl from 'components/SegmentedControl';
import TokenList from './views/TokenList';
import TransactionList from './views/TransactionList';
import useWalletTransactions from './Wallet.hooks';

const Wallet = () => {
  const [selectedOption, setSelectedOption] = useState<WalletTabOption>(WalletTabOption.TOKENS);
  useWalletTransactions();

  return (
    <ScrollView paddingHorizontal="none">
      <Box p="m" gap="m">
        <WalletCard />
        <SegmentedControl<WalletTabOption>
          options={SEGMENTED_CONTROL_OPTIONS}
          value={selectedOption}
          onChange={setSelectedOption}
        />
        {selectedOption === WalletTabOption.TOKENS && <TokenList />}
        {selectedOption === WalletTabOption.ACTIVITY && <TransactionList />}
      </Box>
    </ScrollView>
  );
};

export default Wallet;
