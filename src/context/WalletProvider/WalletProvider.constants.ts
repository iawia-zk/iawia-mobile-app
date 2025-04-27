import { ASYNC_NOOP, NOOP } from 'constants/noop';
import { TWalletDispatch, TWalletState } from './WalletProvider.types';

export const INITIAL_STATE: TWalletState = {
  wallet: undefined,
  balance: undefined,
  walletData: undefined,
  tokens: undefined,
};

export const INITIAL_DISPATCH: TWalletDispatch = {
  generateWallet: NOOP,
  importWallet: NOOP,
  sendInitialTransaction: NOOP,
  setWalletData: NOOP,
  init: ASYNC_NOOP,
  getBalance: ASYNC_NOOP,
  getTokens: ASYNC_NOOP,
};
