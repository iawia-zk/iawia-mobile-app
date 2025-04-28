import { ethers, HDNodeWallet, JsonRpcProvider } from 'ethers';
import { BURN_ADDRESS, TEST_CHAIN_KEY } from './walletService.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage, { STORAGE_KEYS } from 'helpers/storage';
import { TTransaction, TTransactionDetails } from 'types/wallet';
import { TAlchemyTokenMetadata, TTokenBalance } from './walletService.types';

class WalletService {
  private provider: JsonRpcProvider;
  private connectedWallet: HDNodeWallet | undefined;

  constructor() {
    this.provider = new JsonRpcProvider(TEST_CHAIN_KEY);
    this.provider.getNetwork();
  }

  async importLocalWallet() {
    const phrase = await storage.readStorage(STORAGE_KEYS.WALLET_PHRASE);
    if (!phrase) {
      return null;
    }
    return this.importFromPhrase(phrase);
  }

  generateWalletAddress() {
    const wallet = ethers.Wallet.createRandom();
    this.connectedWallet = wallet.connect(this.provider);
    AsyncStorage.setItem(STORAGE_KEYS.WALLET_PHRASE, wallet.mnemonic?.phrase ?? '');
    return wallet;
  }

  importFromPhrase(phrase: string) {
    const wallet = ethers.Wallet.fromPhrase(phrase);
    this.connectedWallet = wallet.connect(this.provider);
    console.log('connectedWallet', this.connectedWallet);
    return wallet;
  }

  async getBalance(address: string) {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async sendInitialTransaction(ipfsHash: string) {
    const hexData = ethers.hexlify(ethers.toUtf8Bytes(ipfsHash));

    const tx = {
      to: BURN_ADDRESS,
      value: ethers.parseEther('0.001'),
      data: hexData,
    };

    try {
      console.log('sending', this.connectedWallet);
      const txResponse = await this.connectedWallet?.sendTransaction(tx);
      console.log('txResponse', txResponse);
      return txResponse;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return null;
    }
  }

  async getTransactions(): Promise<TTransaction[]> {
    try {
      const response = await fetch(TEST_CHAIN_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getAssetTransfers',
          params: [
            {
              fromBlock: '0x0',
              toBlock: 'latest',
              fromAddress: this.connectedWallet?.address,
              category: ['external'],
            },
          ],
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!data.result || !data.result.transfers) {
        console.error('Invalid response format:', data);
        return [];
      }

      return data.result.transfers;
    } catch (error) {
      console.error('Error in getTransactions:', error);
      return [];
    }
  }

  async getTokenBalances(): Promise<TTokenBalance[]> {
    if (!this.connectedWallet?.address) {
      return [];
    }

    try {
      const response = await fetch(TEST_CHAIN_KEY, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'alchemy_getTokenBalances',
          params: [this.connectedWallet.address, 'erc20'],
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Error fetching token balances:', data.error);
        return [];
      }

      const { tokenBalances } = data.result;

      // Get token metadata for each token
      const tokensWithMetadata = await Promise.all(
        // @ts-ignore
        tokenBalances.map(async (token) => {
          const metadataResponse = await fetch(TEST_CHAIN_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'alchemy_getTokenMetadata',
              params: [token.contractAddress],
            }),
          });

          const metadataData = await metadataResponse.json();
          const metadata: TAlchemyTokenMetadata = metadataData.result;

          return {
            contractAddress: token.contractAddress,
            tokenBalance: token.tokenBalance,
            name: metadata.name,
            symbol: metadata.symbol,
            decimals: metadata.decimals,
            logo: metadata.logo,
          };
        })
      );

      // Get ETH balance
      const ethBalance = await this.getBalance(this.connectedWallet.address);

      // Add ETH to the list of tokens
      const ethToken: TTokenBalance = {
        contractAddress: '0x0000000000000000000000000000000000000000', // Zero address for ETH
        tokenBalance: ethers.parseEther(ethBalance).toString(),
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      };

      return [ethToken, ...tokensWithMetadata];
    } catch (error) {
      console.error('Error fetching token balances:', error);
      return [];
    }
  }

  async getTransactionDetails(txHash: string): Promise<TTransactionDetails | null> {
    const tx = await this.provider.getTransaction(txHash);
    return tx;
  }
}

export default WalletService;
