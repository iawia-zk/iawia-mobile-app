import { ethers } from 'ethers';

export type TTransaction = {
  hash: string;
  from: string;
  to: string;
  uniqueId: string;
  value: number;
};

export type TTransactionDetails = ethers.TransactionResponse;

export interface TTokenBalance {
  contractAddress: string;
  tokenBalance: string;
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}

export interface TAlchemyTokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

export interface TAlchemyTokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string;
}
