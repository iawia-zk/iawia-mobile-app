import { HDNodeWallet } from 'ethers';
import { TTokenBalance } from 'helpers/walletService/walletService.types';
import { PassportTransactionData } from 'types/passportData';

export type TWalletContext = {
  walletState: TWalletState;
  walletDispatch: TWalletDispatch;
};

export type TWalletState = {
  wallet?: HDNodeWallet;
  balance?: string;
  walletData?: PassportTransactionData;
  tokens?: TTokenBalance[];
};

export type TWalletDispatch = {
  init: () => Promise<void>;
  generateWallet: () => void;
  importWallet: (phrase: string) => void;
  sendInitialTransaction: (ipfsHash: string) => void;
  setWalletData: (data: PassportTransactionData) => void;
  getBalance: () => Promise<void>;
  getTokens: () => Promise<void>;
};
