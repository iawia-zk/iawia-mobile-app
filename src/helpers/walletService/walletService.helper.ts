import { ethers } from 'ethers';

export function getRawDataFromHex(hex: string) {
  return ethers.toUtf8String(hex);
}
