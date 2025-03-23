import { ethers, HDNodeWallet, JsonRpcProvider } from 'ethers';
import { BURN_ADDRESS, TEST_CHAIN_KEY } from './walletService.constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from 'helpers/storage';
import { TTransaction, TTransactionDetails } from 'types/wallet';
import { TWalletData } from 'context/WalletProvider/WalletProvider.types';
class WalletService {
  private provider: JsonRpcProvider;
  private connectedWallet: HDNodeWallet | undefined;

  constructor() {
    this.provider = new JsonRpcProvider(TEST_CHAIN_KEY);
  }

  async importLocalWallet() {
    const phrase = await AsyncStorage.getItem(STORAGE_KEYS.WALLET_PHRASE);
    console.log('phrase', phrase);
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

  async sendInitialTransaction(data: TWalletData) {
    const hexData = ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify(data)));

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

    const data = await response.json();
    console.log('data', data);
    return data.result.transfers;
  }

  async getTransactionDetails(txHash: string): Promise<TTransactionDetails | null> {
    const tx = await this.provider.getTransaction(txHash);
    return tx;
  }
}

export default WalletService;
