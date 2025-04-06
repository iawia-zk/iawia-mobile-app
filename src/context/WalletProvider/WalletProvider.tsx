import React, { createContext, ReactElement, useContext, useState } from 'react';
import { TWalletContext, TWalletData, TWalletState } from './WalletProvider.types';
import { INITIAL_DISPATCH, INITIAL_STATE } from './WalletProvider.constants';
import { TChildrenOnly } from 'types/common';
import { WalletService } from 'helpers/walletService';
import storage, { STORAGE_KEYS } from 'helpers/storage';

const walletContext = createContext<TWalletContext>({
  walletState: INITIAL_STATE,
  walletDispatch: INITIAL_DISPATCH,
});

export const walletService = new WalletService();

function WalletProvider({ children }: TChildrenOnly): ReactElement {
  const [state, setState] = useState<TWalletState>(INITIAL_STATE);

  async function init() {
    const wallet = await walletService.importLocalWallet();
    if (wallet) {
      setState((prevState) => ({ ...prevState, wallet: wallet }));
    }
  }

  function sendInitialTransaction(data: TWalletData) {
    walletService?.sendInitialTransaction(data);
  }

  function generateWallet() {
    const wallet = walletService?.generateWalletAddress();
    setState((prevState) => ({ ...prevState, wallet: wallet }));
  }

  async function importWallet(phrase: string) {
    const wallet = walletService?.importFromPhrase(phrase);
    await storage.writeStorage(STORAGE_KEYS.WALLET_PHRASE, wallet?.mnemonic?.phrase);
    setState((prevState) => ({ ...prevState, wallet: wallet }));
  }

  function setWalletData(data: TWalletData) {
    setState((prevState) => ({ ...prevState, walletData: data }));
  }

  const value: TWalletContext = {
    walletState: state,
    walletDispatch: { init, generateWallet, importWallet, sendInitialTransaction, setWalletData },
  };

  return <walletContext.Provider value={value}>{children}</walletContext.Provider>;
}

export default WalletProvider;

export const useWalletContext = (): TWalletContext => useContext(walletContext);
