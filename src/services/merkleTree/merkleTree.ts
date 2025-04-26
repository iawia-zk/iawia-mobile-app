import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

export function buildMerkleTree(leaves: string[]) {
  const leafHashes = leaves.map((leaf) => Buffer.from(leaf.slice(2), 'hex'));
  return new MerkleTree(leafHashes, keccak256, { sortPairs: true });
}

export function getMerkleProof(tree: MerkleTree, leaf: string): string[] {
  return tree.getProof(Buffer.from(leaf.slice(2), 'hex')).map((x) => '0x' + x.data.toString('hex'));
}
