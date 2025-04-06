import { ZKType } from 'enums/ZKType';
import { HDNodeWallet } from 'ethers';

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
};

export type TWalletDispatch = {
  init: () => void;
  generateWallet: () => void;
  importWallet: (phrase: string) => void;
  sendInitialTransaction: (data: TWalletData) => void;
  setWalletData: (data: TWalletData) => void;
};
