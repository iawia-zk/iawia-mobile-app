export interface PassportTree {
  leaves: string[];
  root: string;
  timestamp: number;
}

export interface IPFSUploadResponse {
  cid: string;
}

export interface MerkleProof {
  leaf: string;
  proof: string[];
}
