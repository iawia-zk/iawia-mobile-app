import { ZKType } from 'enums/ZKType';
import { HDNodeWallet } from 'ethers';
import { TTokenBalance } from 'helpers/walletService/walletService.types';

export type TWalletData = {
  snarks: TSnark[];
};

export type TSnark = {
  type: ZKType;
  ipfsHash: string;
};

export type TWalletContext = {
  walletState: TWalletState;
  walletDispatch: TWalletDispatch;
};

export type TWalletState = {
  wallet?: HDNodeWallet;
  balance?: string;
  walletData?: TWalletData;
  tokens?: TTokenBalance[];
};

export type TWalletDispatch = {
  init: () => Promise<void>;
  generateWallet: () => void;
  importWallet: (phrase: string) => void;
  sendInitialTransaction: (data: TWalletData) => void;
  setWalletData: (data: TWalletData) => void;
  getBalance: () => Promise<void>;
  getTokens: () => Promise<void>;
};
