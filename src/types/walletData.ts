import { ZKType } from 'enums/ZKType';

export type TWalletData = {
  snarks: TSnark[];
};

export type TSnark = {
  type: ZKType;
  ipfsHash: string;
};
