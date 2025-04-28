import BottomInsetBox from 'components/BottomInsetBox';
import Box from 'components/core/Box';
import Button from 'components/core/Button';
import ScrollView from 'components/ScrollView';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import React from 'react';
import { Text } from 'react-native-svg';
import OnboardingResultPhases from './views/OnboardingResultPhases';
import CopyInfoItem from 'components/CopyInfoItem';
import { TNavigationProps } from 'screens/AppNavigation.types';

function OnboardingResult({ navigation }: TNavigationProps<'OnboardingResult'>) {
  const { walletState, walletDispatch } = useWalletContext();
  const [walletCreateLoading, setWalletCreateLoading] = React.useState(false);

  async function handleCreateWallet() {
    setWalletCreateLoading(true);
    setTimeout(() => {
      walletDispatch.generateWallet();
      setWalletCreateLoading(false);
    }, 0);
  }

  function navigateToHome() {
    walletDispatch.importWallet(walletState.wallet?.mnemonic?.phrase ?? '');
    navigation.navigate('Wallet');
  }

  return (
    <>
      <ScrollView paddingHorizontal="none">
        <Box gap={'m'} mx={'m'}>
          <Text>Welcome EMREHAN</Text>
          <OnboardingResultPhases />
          <CopyInfoItem
            labelId="label.walletAddress"
            value={walletState.wallet?.mnemonic?.phrase ?? '-'}
          />
        </Box>
      </ScrollView>
      <BottomInsetBox alignItems="center" paddingHorizontal="m" gap="m">
        <Button
          labelId={walletState.wallet ? 'button.start' : 'button.createWallet'}
          onPress={walletState.wallet ? navigateToHome : handleCreateWallet}
          loading={walletCreateLoading}
        />
      </BottomInsetBox>
    </>
  );
}

export default OnboardingResult;
