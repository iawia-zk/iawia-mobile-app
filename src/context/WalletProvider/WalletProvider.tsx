import React, { createContext, ReactElement, useContext, useEffect, useState } from 'react';
import { TWalletContext, TWalletData, TWalletState } from './WalletProvider.types';
import { INITIAL_DISPATCH, INITIAL_STATE } from './WalletProvider.constants';
import { TChildrenOnly } from 'types/common';
import { WalletService } from 'helpers/walletService';

const walletContext = createContext<TWalletContext>({
  walletState: INITIAL_STATE,
  walletDispatch: INITIAL_DISPATCH,
});

export const walletService = new WalletService();

function WalletProvider({ children }: TChildrenOnly): ReactElement {
  const [state, setState] = useState<TWalletState>(INITIAL_STATE);

  useEffect(() => {
    async function init() {
      const wallet = await walletService.importLocalWallet();

      if (wallet) {
        setState((prevState) => ({ ...prevState, wallet: wallet }));
      }
    }
    init();
  }, []);

  function sendInitialTransaction(data: TWalletData) {
    walletService?.sendInitialTransaction(data);
  }

  function generateWallet() {
    const wallet = walletService?.generateWalletAddress();
    setState((prevState) => ({ ...prevState, wallet: wallet }));
  }

  function importWallet(phrase: string) {
    const wallet = walletService?.importFromPhrase(phrase);
    setState((prevState) => ({ ...prevState, wallet: wallet }));
  }

  const value: TWalletContext = {
    walletState: state,
    walletDispatch: { generateWallet, importWallet, sendInitialTransaction },
  };

  return <walletContext.Provider value={value}>{children}</walletContext.Provider>;
}

export default WalletProvider;

export const useWalletContext = (): TWalletContext => useContext(walletContext);
