import { ethers } from 'ethers';

export type TTransaction = {
  hash: string;
  from: string;
  to: string;
  uniqueId: string;
  value: number;
};

export type TTransactionDetails = ethers.TransactionResponse;
