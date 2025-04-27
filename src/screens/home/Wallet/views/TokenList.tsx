import React, { ReactElement, useEffect } from 'react';
import Box from 'components/core/Box';
import Text from 'components/core/Text';
import { useWalletContext } from 'context/WalletProvider/WalletProvider';
import { TTokenBalance } from 'helpers/walletService/walletService.types';
import { Image } from 'react-native';

function TokenList(): ReactElement {
  const { walletState, walletDispatch } = useWalletContext();

  useEffect(() => {
    walletDispatch.getTokens();
  }, []);

  if (!walletState.tokens?.length) {
    return (
      <Box p="m" alignItems="center" justifyContent="center">
        <Text variant="textBody">Loading tokens...</Text>
      </Box>
    );
  }

  return (
    <Box px="s" gap="s">
      {walletState.tokens.map((token: TTokenBalance) => (
        <Box
          key={token.contractAddress}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          p="s"
          backgroundColor="backgroundSecondary"
          borderRadius={16}>
          <Box flexDirection="row" alignItems="center" gap="m">
            {token.logo && (
              <Box width={40} height={40} borderRadius={16} overflow="hidden">
                <Image source={{ uri: token.logo }} alt={token.symbol} width={40} height={40} />
              </Box>
            )}
            <Box>
              <Text variant="textBody">{token.name}</Text>
              <Text variant="textBody" color="textSecondary">
                {token.symbol}
              </Text>
            </Box>
          </Box>
          <Box alignItems="flex-end">
            <Text variant="textBody">{Number(token.tokenBalance) / 10 ** token.decimals}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default TokenList;
