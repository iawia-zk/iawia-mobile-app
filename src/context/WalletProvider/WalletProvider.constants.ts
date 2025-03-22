import { NOOP } from 'constants/noop';
import { TWalletDispatch, TWalletState } from './WalletProvider.types';

export const INITIAL_STATE: TWalletState = {
  wallet: undefined,
  balance: undefined,
};

export const INITIAL_DISPATCH: TWalletDispatch = {
  generateWallet: NOOP,
  importWallet: NOOP,
  sendInitialTransaction: NOOP,
};
