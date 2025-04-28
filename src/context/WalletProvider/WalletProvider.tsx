import React, { createContext, ReactElement, useContext, useState } from 'react';
import { TWalletContext, TWalletState } from './WalletProvider.types';
import { INITIAL_DISPATCH, INITIAL_STATE } from './WalletProvider.constants';
import { TChildrenOnly } from 'types/common';
import { WalletService } from 'helpers/walletService';
import storage, { STORAGE_KEYS } from 'helpers/storage';
import { PassportTransactionData } from 'types/passportData';

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

  function sendInitialTransaction(ipfsHash: string) {
    walletService?.sendInitialTransaction(ipfsHash);
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

  async function getBalance() {
    const balance = await walletService.getBalance(state.wallet?.address ?? '');
    setState((prevState) => ({ ...prevState, balance }));
  }

  function setWalletData(data: PassportTransactionData) {
    setState((prevState) => ({ ...prevState, walletData: data }));
  }

  async function getTokens() {
    const tokens = await walletService.getTokenBalances();
    setState((prevState) => ({ ...prevState, tokens }));
  }

  const value: TWalletContext = {
    walletState: state,
    walletDispatch: {
      init,
      generateWallet,
      getBalance,
      importWallet,
      sendInitialTransaction,
      getTokens,
      setWalletData,
    },
  };

  return <walletContext.Provider value={value}>{children}</walletContext.Provider>;
}

export default WalletProvider;

export const useWalletContext = (): TWalletContext => useContext(walletContext);
